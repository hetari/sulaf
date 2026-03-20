import { dirname, join } from 'node:path'
import { parse as parseSFC } from '@vue/compiler-sfc'
import { Project } from 'ts-morph'
import { registryConfig } from '../registry.config'
import type {
  AnalyzeDependenciesOptions,
  ComponentAssetFile,
  DependencyAnalysisResult,
} from './types'
import { unique } from './utils'

/**
 * Parses import statements from TypeScript or JavaScript code using ts-morph.
 * @param code The source code to parse
 * @returns An array of unique module specifiers (imports)
 */
export function parseImportsFromCode(code: string): string[] {
  try {
    const project = new Project({
      useInMemoryFileSystem: true,
      compilerOptions: {
        allowJs: true,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        moduleResolution: 2,
        target: 5,
        module: 5,
        strict: false,
        skipLibCheck: true,
      },
    })

    const sourceFile = project.createSourceFile('temp.ts', code)
    const imports: string[] = []
    sourceFile.getImportDeclarations().forEach(declaration => {
      const moduleSpecifier = declaration.getModuleSpecifierValue()
      if (moduleSpecifier) {
        imports.push(moduleSpecifier)
      }
    })

    return unique(imports)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse imports with ts-morph:', error)
    return []
  }
}

/**
 * Extracts a registry slug from a module path if it belongs to a known registry directory.
 */
export function extractRegistrySlug(modulePath: string, basePath: string): string {
  if (!modulePath.startsWith(basePath)) return ''

  const rest = modulePath.slice(basePath.length).split('/')?.find(Boolean)

  return rest || ''
}

/**
 * Normalizes a package name to its base (e.g., '@scope/pkg/subpath' -> '@scope/pkg').
 */
export function getBasePackageName(specifier: string): string {
  if (specifier.startsWith('@')) {
    const parts = specifier.split('/')
    return parts.slice(0, 2).join('/')
  }
  return specifier.split('/')[0] as string
}

/**
 * Maps runtime packages to their corresponding @types devDependencies.
 */
export function buildTypesDevDepsMap(devDependencies: string[]): Map<string, string[]> {
  const TYPES_PREFIX = '@types/'
  const typesDevDepsMap = new Map<string, string[]>()
  for (const devDep of devDependencies) {
    if (devDep.startsWith(TYPES_PREFIX)) {
      const name = devDep.slice(TYPES_PREFIX.length)
      const runtime = name.includes('__') ? `@${name.replace('__', '/')}` : name
      const list = typesDevDepsMap.get(runtime) ?? []
      list.push(devDep)
      typesDevDepsMap.set(runtime, list)
    }
  }
  return typesDevDepsMap
}

/**
 * Analyzes imports to determine production dependencies, dev dependencies, and registry dependencies.
 */
export function analyzeDependencies(
  imports: string[],
  allowedDeps: Set<string>,
  allowedDevDeps: Set<string>,
  options?: AnalyzeDependenciesOptions,
): DependencyAnalysisResult {
  const dependencies = new Set<string>()
  const devDependencies = new Set<string>()
  const registryDependencies = new Set<string>()
  const basePath = registryConfig.srcDir.endsWith('/')
    ? registryConfig.srcDir
    : `${registryConfig.srcDir}/`

  for (const mod of imports) {
    if (mod.startsWith('./')) {
      continue
    }

    if (mod.startsWith('../') && options?.filePath && options?.currentGroup) {
      const currentDir = dirname(options.filePath)
      const resolved = join(currentDir, mod).split('\\').join('/')
      if (resolved.startsWith(basePath)) {
        const targetGroup = resolved.slice(basePath.length).split('/').find(Boolean)
        if (targetGroup && targetGroup !== options.currentGroup) {
          if (!options.skipAiComponentDeps) {
            registryDependencies.add(targetGroup)
          }
        }
      }
      continue
    }

    const pkg = getBasePackageName(mod)

    if (allowedDeps.has(pkg)) {
      dependencies.add(pkg)
      if (options?.typesDevDepsMap) {
        const typePkgs = options.typesDevDepsMap.get(pkg)
        if (typePkgs) {
          for (const t of typePkgs) {
            devDependencies.add(t)
          }
        }
      }
    }

    if (allowedDevDeps.has(mod)) {
      devDependencies.add(mod)
    }

    // Handle path aliases defined in config replacements
    for (const replacement of registryConfig.replacements) {
      if (typeof replacement.to === 'string' && mod.startsWith(replacement.to)) {
        const slug = extractRegistrySlug(mod, replacement.to)
        if (slug) {
          if (options?.currentGroup && slug === options.currentGroup) continue

          if (!options?.skipAiComponentDeps) {
            // If it's a registry dependency from the same source, add the slug
            registryDependencies.add(slug)
          }
        }
      }
    }
  }

  return { dependencies, devDependencies, registryDependencies }
}

/**
 * Extracts source code from a ComponentAssetFile (.vue or .ts).
 */
export function extractSourceCode(file: ComponentAssetFile): string {
  if (file.path.endsWith('.vue')) {
    const { descriptor } = parseSFC(file.content)
    return [descriptor.script?.content || '', descriptor.scriptSetup?.content || ''].join('\n')
  }
  if (file.path.endsWith('.ts')) {
    return file.content
  }
  return ''
}

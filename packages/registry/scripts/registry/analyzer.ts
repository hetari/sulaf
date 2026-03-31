import { dirname, join } from 'node:path'
import { parse as parseSFC } from '@vue/compiler-sfc'
import { Project } from 'ts-morph'
import { registryConfig } from '../registry.config'
import type {
  AnalyzeDependenciesOptions,
  ComponentAssetFile,
  DependencyAnalysisResult,
} from './types'
import { unique, getBasePackageName, extractRegistrySlug } from './utils'

// Global ts-morph project for performance (persistence across calls)
const project = new Project({
  useInMemoryFileSystem: true,
  compilerOptions: {
    allowJs: true,
    esModuleInterop: true,
    moduleResolution: 2,
    target: 5,
    module: 5,
    strict: false,
    skipLibCheck: true,
  },
})

/**
 * Parses import statements from TypeScript or JavaScript code using ts-morph.
 */
export function parseImportsFromCode(code: string): string[] {
  try {
    const sourceFile = project.createSourceFile('temp.ts', code, { overwrite: true })
    const imports = sourceFile.getImportDeclarations().map(d => d.getModuleSpecifierValue())
    sourceFile.forget() // Cleanup memory
    return unique(imports.filter(Boolean))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse imports:', error)
    return []
  }
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

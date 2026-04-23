import type { Dirent } from 'node:fs'
import type { Registry, RegistryItem } from 'shadcn-vue/schema'
import { promises as fs } from 'node:fs'
import { basename, dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseSFC } from '@vue/compiler-sfc'
import { registryItemSchema } from 'shadcn-vue/schema'
import { Project } from 'ts-morph'
import { registryConfig } from './registry.config'

interface ComponentAssetFile {
  type: 'registry:component' | 'registry:ui' | 'registry:hook'
  path: string
  content: string
  target?: string
}

interface ExampleAssetFile {
  type: 'registry:block'
  path: string
  content: string
  target?: string
}

interface PackageJson {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

function toTitle(slug: string) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

function validateRegistryItem(item: unknown, label: string): item is RegistryItem {
  const parsed = registryItemSchema.safeParse(item)
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.warn(`Invalid registry item schema (${label}):`, parsed.error.issues)
    return false
  }

  // Extra runtime guarantees for our generated assets.
  if (!parsed.data.files || parsed.data.files.length === 0) {
    // eslint-disable-next-line no-console
    console.warn(`Invalid registry item: files must be non-empty array (${label})`)
    return false
  }

  return true
}

interface DependencyAnalysisResult {
  dependencies: Set<string>
  devDependencies: Set<string>
  registryDependencies: Set<string>
}

function parseImportsFromCode(code: string): string[] {
  try {
    // Use ts-morph to parse TypeScript code and extract imports
    const project = new Project({
      useInMemoryFileSystem: true,
      compilerOptions: {
        allowJs: true,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        moduleResolution: 2, // Node
        target: 5, // ESNext
        module: 5, // ESNext
        strict: false,
        skipLibCheck: true,
      },
    })

    // Create a temporary source file
    const sourceFile = project.createSourceFile('temp.ts', code)

    // Extract all import declarations
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

function extractRegistrySlug(modulePath: string, basePath: string): string {
  if (!modulePath.startsWith(basePath)) return ''

  return modulePath.slice(basePath.length).split('/').find(Boolean) || ''
}

// Normalize to package root (supports scoped and deep subpath imports)
function getBasePackageName(specifier: string): string {
  if (specifier.startsWith('@')) {
    const parts = specifier.split('/')
    return parts.slice(0, 2).join('/')
  }
  return specifier.split('/')[0] || ''
}

// Build a mapping from import package -> its @types devDependency package(s)
function buildTypesDevDepsMap(devDependencies: string[]): Map<string, string[]> {
  const TYPES_PREFIX = '@types/'
  const typesDevDepsMap = new Map<string, string[]>()
  for (const devDep of devDependencies) {
    if (devDep.startsWith(TYPES_PREFIX)) {
      const name = devDep.slice(TYPES_PREFIX.length)
      // Scoped packages in DefinitelyTyped use __ separator, e.g. @types/babel__core for @babel/core
      const runtime = name.includes('__') ? `@${name.replace('__', '/')}` : name
      const list = typesDevDepsMap.get(runtime) ?? []
      list.push(devDep)
      typesDevDepsMap.set(runtime, list)
    }
  }
  return typesDevDepsMap
}

interface AnalyzeDependenciesOptions {
  filePath?: string
  currentGroup?: string
  /** If true, skip adding component dependencies (for all.json bundling) */
  skipAiComponentDeps?: boolean
  /** Mapping from import package to @types/ packages */
  typesDevDepsMap?: Map<string, string[]>
}

function analyzeDependencies(
  imports: string[],
  allowedDeps: Set<string>,
  allowedDevDeps: Set<string>,
  options?: AnalyzeDependenciesOptions,
): DependencyAnalysisResult {
  const dependencies = new Set<string>()
  const devDependencies = new Set<string>()
  const registryDependencies = new Set<string>()

  for (const mod of imports) {
    if (mod.startsWith('./')) {
      continue
    }

    if (mod.startsWith('../') && options?.filePath && options?.currentGroup) {
      const currentDir = dirname(options.filePath)
      const resolved = join(currentDir, mod).split('\\').join('/')
      if (!resolved.startsWith('..')) {
        const targetGroup = resolved.split('/').find(Boolean)
        if (targetGroup && targetGroup !== options.currentGroup) {
          // Skip component deps for all.json bundling
          if (!options.skipAiComponentDeps) {
            registryDependencies.add(targetGroup)
          }
        }
      }
      continue
    }

    // Normalize to base package name for dependency lookup
    const pkg = getBasePackageName(mod)

    if (allowedDeps.has(pkg)) {
      dependencies.add(pkg)
      // Check if it has a corresponding @types/ package
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

    if (mod.startsWith('@/components/ui/')) {
      const slug = extractRegistrySlug(mod, '@/components/ui/')
      if (slug && slug !== options?.currentGroup) registryDependencies.add(slug)
    }

    if (mod.startsWith('@/hooks/')) {
      const slug = extractRegistrySlug(mod, '@/hooks/')
      if (slug && slug !== options?.currentGroup) registryDependencies.add(slug)
    }

    if (mod.startsWith('@/composables/')) {
      const slug = extractRegistrySlug(mod, '@/composables/')
      if (slug && slug !== options?.currentGroup) registryDependencies.add(slug)
    }

    const appComponentPath = `@/components/${registryConfig.componentDir}/`
    if (mod.startsWith(appComponentPath)) {
      const slug = extractRegistrySlug(mod, appComponentPath)
      if (slug) {
        if (options?.currentGroup && slug === options.currentGroup) continue
        // Skip component deps for all.json bundling
        if (!options?.skipAiComponentDeps) {
          registryDependencies.add(slug)
        }
      }
    }
  }

  return { dependencies, devDependencies, registryDependencies }
}

async function walkComponentFiles(dir: string, rootDir: string): Promise<string[]> {
  const out: string[] = []
  let entries: Dirent[] = []
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      const nested = await walkComponentFiles(full, rootDir)
      out.push(...nested)
    } else if (entry.isFile()) {
      // Include all .vue files
      if (entry.name.endsWith('.vue')) {
        out.push(full)
      }
      // Include all .ts files except the root src/index.ts
      else if (entry.name.endsWith('.ts')) {
        const isRootIndex = full === join(rootDir, 'index.ts')
        if (!isRootIndex) {
          out.push(full)
        }
      }
    }
  }
  return out
}

function extractSourceCode(file: ComponentAssetFile): string {
  // Handle Vue SFC files
  if (file.path.endsWith('.vue')) {
    const { descriptor } = parseSFC(file.content)
    return [descriptor.script?.content || '', descriptor.scriptSetup?.content || ''].join('\n')
  }
  // Handle TypeScript files
  if (file.path.endsWith('.ts')) {
    return file.content
  }
  return ''
}

export async function generateRegistryAssets(ctx: { rootDir: string }) {
  const rootDir = ctx.rootDir
  const examplesDir = join(rootDir, 'examples')

  // read package.json for dependency sets
  let pkg: PackageJson = {}
  try {
    const raw = await fs.readFile(join(rootDir, 'package.json'), 'utf-8')
    pkg = JSON.parse(raw) as PackageJson
  } catch {}

  const allDeps = { ...pkg.dependencies }
  const allDevDeps = { ...pkg.devDependencies }

  // Packages to exclude from dependencies
  const excludedDeps = registryConfig.excludedDeps
  const excludedDevDeps = new Set(['typescript'])

  const allowedDeps = new Set(
    Object.keys(allDeps || {}).filter((d: string) => !excludedDeps.includes(d)),
  )
  const allowedDevDeps = new Set(
    Object.keys(allDevDeps || {}).filter((d: string) => !excludedDevDeps.has(d)),
  )

  // Build the @types/ mapping for devDependencies
  const typesDevDepsMap = buildTypesDevDepsMap(Array.from(allowedDevDeps))

  const componentFiles: ComponentAssetFile[] = []
  for (const srcDirName of registryConfig.srcDirs) {
    const srcPath = join(rootDir, srcDirName)
    const files = await walkComponentFiles(srcPath, srcPath)

    // Determine registry type based on source directory
    const baseType: ComponentAssetFile['type'] =
      srcDirName === 'components'
        ? 'registry:ui'
        : srcDirName === 'hooks'
          ? 'registry:hook'
          : 'registry:component'

    for (const abs of files) {
      const raw = await fs.readFile(abs, 'utf-8')
      let parsed = raw
      for (const replacement of registryConfig.replacements) {
        parsed = parsed.replace(replacement.from, replacement.to)
      }
      let rel = relative(srcPath, abs).split('\\').join('/')

      // Flatten hooks: use-foo/index.ts -> use-foo.ts
      if (srcDirName === 'hooks' && rel.endsWith('/index.ts')) {
        rel = rel.replace('/index.ts', '.ts')
      }

      const fileType: ComponentAssetFile['type'] = baseType

      componentFiles.push({
        type: fileType,
        path: rel,
        content: parsed,
      })
    }
  }

  const exampleFiles: ExampleAssetFile[] = []
  try {
    const entries = await fs.readdir?.(examplesDir, { withFileTypes: true })
    if (entries) {
      const candidates = entries
        .filter(e => e.isFile() && e.name.endsWith('.vue'))
        .map(e => join(examplesDir, e.name))
      for (const abs of candidates) {
        const raw = await fs.readFile(abs, 'utf-8')
        let parsed = raw
        for (const replacement of registryConfig.replacements) {
          parsed = parsed.replace(replacement.from, replacement.to)
        }
        const name = basename(abs)
        exampleFiles.push({
          type: 'registry:block',
          path: `examples/${name}`,
          content: parsed,
        })
      }
    }
  } catch {}

  const groupMap = new Map<string, ComponentAssetFile[]>()
  for (const f of componentFiles) {
    const rel = f.path
    let group = rel.split('/')[0]

    // For flattened hooks, the group should be the slug (filename without .ts)
    if (f.type === 'registry:hook' && !rel.includes('/') && rel.endsWith('.ts')) {
      group = rel.replace('.ts', '')
    }

    if (!group) continue

    if (!groupMap.has(group)) groupMap.set(group, [])
    groupMap.get(group)!.push(f)
  }

  const componentItems: RegistryItem[] = Array.from(groupMap.keys()).map(group => {
    const files = groupMap.get(group)!
    // Prefer registry:ui if present, otherwise registry:hook, else registry:component
    const primaryType =
      files.find(f => f.type === 'registry:ui')?.type ||
      files.find(f => f.type === 'registry:hook')?.type ||
      files.find(f => f.type === 'registry:component')?.type ||
      'registry:component'

    return {
      name: group,
      type: primaryType as 'registry:ui' | 'registry:component' | 'registry:hook',
      title: toTitle(group),
      description: `${registryConfig.registry.name} ${group.replace('-', ' ')} components.`,
      files: files.map(f => ({
        path: f.path,
        type: f.type,
        target: f.target,
      })),
    }
  })

  const exampleItems: RegistryItem[] = exampleFiles.map(ef => {
    const fileName = basename(ef.path)
    const name = fileName.replace('.vue', '')
    return {
      name: `example-${name}`,
      type: 'registry:block',
      title: `${toTitle(name)} Example`,
      description: `Example implementation of ${name.replace('-', ' ')}.`,
      files: [{ path: ef.path, type: ef.type }],
    }
  })

  const registryJson: Registry = {
    name: registryConfig.registry.name,
    homepage: registryConfig.registry.homepage,
    items: [...componentItems, ...exampleItems],
  }

  const outBase = join(rootDir, registryConfig.outputDir)
  await fs.mkdir(join(outBase, 'components'), { recursive: true })
  await fs.mkdir(join(outBase, 'examples'), { recursive: true })
  await fs.writeFile(join(outBase, 'registry.json'), JSON.stringify(registryJson, null, 2), 'utf-8')

  // Collect dependencies for all.json (bundle of all components)
  const allDependencies = new Set<string>()
  const allDevDependencies = new Set<string>()
  const allRegistryDependencies = new Set<string>()
  const allFilesWithContent: Array<{
    path: string
    type: string
    content: string
    target?: string
  }> = []

  for (const [group, groupFiles] of groupMap) {
    const groupDeps = new Set<string>()
    const groupDevDeps = new Set<string>()
    const groupRegistryDeps = new Set<string>()

    for (const f of groupFiles) {
      const code = extractSourceCode(f)
      if (code) {
        const imports = parseImportsFromCode(code)
        // For individual component: include component deps
        const analysis = analyzeDependencies(imports, allowedDeps, allowedDevDeps, {
          filePath: f.path,
          currentGroup: group,
          skipAiComponentDeps: false,
          typesDevDepsMap,
        })
        analysis.dependencies.forEach(dep => groupDeps.add(dep))
        analysis.devDependencies.forEach(dep => groupDevDeps.add(dep))
        analysis.registryDependencies.forEach(dep => groupRegistryDeps.add(dep))

        // For all.json: skip component deps, only include shadcn-vue deps
        const allAnalysis = analyzeDependencies(imports, allowedDeps, allowedDevDeps, {
          filePath: f.path,
          currentGroup: group,
          skipAiComponentDeps: true,
          typesDevDepsMap,
        })
        allAnalysis.dependencies.forEach(dep => allDependencies.add(dep))
        allAnalysis.devDependencies.forEach(dep => allDevDependencies.add(dep))
        allAnalysis.registryDependencies.forEach(dep => allRegistryDependencies.add(dep))
      }

      // Collect files for all.json
      allFilesWithContent.push({
        path: f.path,
        type: f.type,
        content: f.content,
        ...(f.target ? { target: f.target } : {}),
      })
    }

    const primaryType =
      groupFiles.find(f => f.type === 'registry:ui')?.type ||
      groupFiles.find(f => f.type === 'registry:hook')?.type ||
      groupFiles.find(f => f.type === 'registry:component')?.type ||
      'registry:component'

    // Bundle hooks instead of adding them as registry dependencies
    const finalRegistryDeps = new Set<string>()
    const bundledFiles = [...groupFiles]

    for (const dep of groupRegistryDeps) {
      const depFiles = groupMap.get(dep)
      if (depFiles) {
        const isHook = depFiles.some(f => f.type === 'registry:hook')
        if (isHook) {
          // Add hook files to the current component's files
          for (const df of depFiles) {
            if (!bundledFiles.some(bf => bf.path === df.path)) {
              bundledFiles.push(df)
            }
          }
          continue
        }
      }
      finalRegistryDeps.add(dep)
    }

    const itemJson = {
      $schema: 'https://shadcn-vue.com/schema/registry-item.json',
      name: group,
      type: primaryType as 'registry:ui' | 'registry:component' | 'registry:hook',
      title: toTitle(group),
      description: `${registryConfig.registry.name} ${group.replace('-', ' ')} components.`,
      files: bundledFiles,
      dependencies: Array.from(groupDeps),
      devDependencies: Array.from(groupDevDeps),
      registryDependencies: Array.from(finalRegistryDeps),
    }

    // Validate before writing
    if (validateRegistryItem(itemJson, `component-${group}`)) {
      await fs.writeFile(join(outBase, `${group}.json`), JSON.stringify(itemJson, null, 2), 'utf-8')
    } else {
      // eslint-disable-next-line no-console
      console.error(`Skipping invalid component: ${group}`)
    }
  }

  for (const ef of exampleFiles) {
    const fileName = basename(ef.path)
    const name = fileName.replace('.vue', '')

    // Analyze dependencies for example files
    const { descriptor } = parseSFC(ef.content)
    const code = [descriptor.script?.content || '', descriptor.scriptSetup?.content || ''].join(
      '\n',
    )
    const imports = parseImportsFromCode(code)
    const analysis = analyzeDependencies(imports, allowedDeps, allowedDevDeps, {
      typesDevDepsMap,
    })

    const itemJson = {
      $schema: 'https://shadcn-vue.com/schema/registry-item.json',
      name: `example-${name}`,
      type: 'registry:block',
      title: `${toTitle(name)} Example`,
      description: `Example implementation of ${name.replace('-', ' ')}.`,
      files: [ef],
      dependencies: Array.from(analysis.dependencies),
      devDependencies: Array.from(analysis.devDependencies),
      registryDependencies: Array.from(analysis.registryDependencies),
    }

    // Validate before writing
    if (validateRegistryItem(itemJson, `example-${name}`)) {
      await fs.writeFile(
        join(outBase, 'examples', `${name}.json`),
        JSON.stringify(itemJson, null, 2),
        'utf-8',
      )
    } else {
      // eslint-disable-next-line no-console
      console.error(`Skipping invalid example: ${name}`)
    }
  }

  // Generate all.json - a single RegistryItem containing all component files
  // This is for bundled installation via: npx shadcn-vue@latest add <registry-url>/all.json
  const allJson = {
    $schema: 'https://shadcn-vue.com/schema/registry-item.json',
    name: 'all',
    type: 'registry:ui',
    title: `All ${registryConfig.registry.name} Elements`,
    description: `Bundle containing all ${registryConfig.registry.name} components.`,
    files: allFilesWithContent,
    dependencies: Array.from(allDependencies),
    devDependencies: Array.from(allDevDependencies),
    // Only include shadcn-vue component dependencies, not component dependencies
    registryDependencies: Array.from(allRegistryDependencies),
  }

  if (validateRegistryItem(allJson, 'all')) {
    await fs.writeFile(join(outBase, 'all.json'), JSON.stringify(allJson, null, 2), 'utf-8')
  } else {
    // eslint-disable-next-line no-console
    console.error('Skipping invalid all.json')
  }

  // eslint-disable-next-line no-console
  // eslint-disable-next-line no-console
  console.info('[registry] registry assets generated at', outBase)
}

if (
  import.meta.main ||
  (typeof process !== 'undefined' && process.argv[1]?.endsWith('registry-builder.ts'))
) {
  generateRegistryAssets({
    rootDir: join(dirname(fileURLToPath(import.meta.url)), '..'),
  })
}

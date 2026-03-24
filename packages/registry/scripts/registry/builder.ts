import { promises as fs } from 'node:fs'
import { join, relative } from 'node:path'
import { registryConfig } from '../registry.config'
import type { ComponentAssetFile, PackageJson, RegistryContext } from './types'
import { walkComponentFiles, toTitle, validateRegistryItem } from './utils'
import {
  buildTypesDevDepsMap,
  extractSourceCode,
  parseImportsFromCode,
  analyzeDependencies,
} from './analyzer'
import type { Registry, RegistryItem } from 'shadcn-vue/schema'

/**
 * Main function to generate registry assets based on the global configuration.
 */
export async function generateRegistryAssets(ctx: RegistryContext) {
  const { rootDir } = ctx
  const srcDir = join(rootDir, registryConfig.srcDir)

  // 1. Prepare Paths
  const outBase = join(rootDir, registryConfig.outputDir)
  const publicBase = join(rootDir, registryConfig.publicDir)

  // 2. Load dependencies from package.json
  let pkg: PackageJson = {}
  try {
    const raw = await fs.readFile(join(rootDir, 'package.json'), 'utf-8')
    pkg = JSON.parse(raw) as PackageJson
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to read package.json', e)
  }

  const allDeps = pkg.dependencies || {}
  const allDevDeps = pkg.devDependencies || {}
  const allowedDeps = new Set(
    Object.keys(allDeps).filter(d => !registryConfig.excludedDeps.includes(d)),
  )
  const allowedDevDeps = new Set(
    Object.keys(allDevDeps).filter(d => !registryConfig.excludedDeps.includes(d)),
  )
  const typesDevDepsMap = buildTypesDevDepsMap(Array.from(allowedDevDeps))

  // 3. Collect component files
  const componentFiles = await walkComponentFiles(srcDir, srcDir)
  const files: ComponentAssetFile[] = []

  for (const abs of componentFiles) {
    const raw = await fs.readFile(abs, 'utf-8')
    let parsed = raw

    for (const replacement of registryConfig.replacements) {
      parsed = parsed.replace(replacement.from, replacement.to)
    }

    const rel = relative(srcDir, abs).split('\\').join('/')
    files.push({
      type: 'registry:component',
      path: join(registryConfig.srcDir, rel).split('\\').join('/'),
      content: parsed,
    })
  }

  // 4. Group files by component
  const groupMap = new Map<string, ComponentAssetFile[]>()
  for (const f of files) {
    const rel = f.path.replace(
      registryConfig.srcDir.endsWith('/') ? registryConfig.srcDir : `${registryConfig.srcDir}/`,
      '',
    )
    const group = rel.split('/')[0]
    if (!group) return

    if (!groupMap.has(group)) groupMap.set(group, [])
    groupMap.get(group)!.push(f)
  }

  // 5. Generate individual component JSON files
  const componentItems: RegistryItem[] = []

  for (const [group, groupFiles] of groupMap) {
    const groupDeps = new Set<string>()
    const groupDevDeps = new Set<string>()
    const groupRegistryDeps = new Set<string>()

    // 5.1 Load local registry.json if it exists
    let localMetadata: any = {}
    const localRegistryPath = join(srcDir, group, 'registry.json')
    try {
      const raw = await fs.readFile(localRegistryPath, 'utf-8')
      localMetadata = JSON.parse(raw)
    } catch {
      // No local registry.json, use defaults
    }

    for (const f of groupFiles) {
      const code = extractSourceCode(f)
      if (code) {
        const imports = parseImportsFromCode(code)
        const analysis = analyzeDependencies(imports, allowedDeps, allowedDevDeps, {
          filePath: f.path,
          currentGroup: group,
          skipAiComponentDeps: false,
          typesDevDepsMap,
        })
        analysis.dependencies.forEach(dep => groupDeps.add(dep))
        analysis.devDependencies.forEach(dep => groupDevDeps.add(dep))
        analysis.registryDependencies.forEach(dep => groupRegistryDeps.add(dep))
      }

      // Update file type if specified in local metadata
      const relPath = relative(join(registryConfig.srcDir, group), f.path).split('\\').join('/')
      const localFile = localMetadata.files?.find((lf: any) => lf.path === relPath)
      if (localFile?.type) {
        f.type = localFile.type
      } else if (localMetadata.type) {
        f.type = localMetadata.type
      }
    }

    // Merge group dependencies from local metadata if present
    if (localMetadata.dependencies) {
      localMetadata.dependencies.forEach((dep: string) => groupDeps.add(dep))
    }
    if (localMetadata.devDependencies) {
      localMetadata.devDependencies.forEach((dep: string) => groupDevDeps.add(dep))
    }
    if (localMetadata.registryDependencies) {
      localMetadata.registryDependencies.forEach((dep: string) => groupRegistryDeps.add(dep))
    }

    const itemJson = {
      $schema: 'https://shadcn-vue.com/schema/registry-item.json',
      name: group,
      type: (localMetadata.type || 'registry:component') as any,
      title: localMetadata.title || toTitle(group),
      description: localMetadata.description || `${group.replace('-', ' ')} components.`,
      files: groupFiles.map(f => {
        const file: any = {
          path: f.path,
          type: f.type,
        }
        if (f.target) {
          file.target = f.target
        }
        return file
      }),
      dependencies: Array.from(groupDeps),
      devDependencies: Array.from(groupDevDeps),
      registryDependencies: Array.from(groupRegistryDeps),
    }

    if (validateRegistryItem(itemJson, `component-${group}`)) {
      await fs.mkdir(join(outBase, 'components'), { recursive: true })
      await fs.writeFile(
        join(outBase, 'components', `${group}.json`),
        JSON.stringify(itemJson, null, 2),
        'utf-8',
      )
      componentItems.push({
        name: group,
        type: itemJson.type,
        title: itemJson.title,
        files: itemJson.files,
      })
    }
  }

  // 6. Generate main registry.json
  const registryJson: Registry = {
    name: registryConfig.registry.name,
    homepage: registryConfig.registry.homepage,
    items: componentItems,
  }

  await fs.mkdir(outBase, { recursive: true })
  await fs.mkdir(publicBase, { recursive: true })

  await fs.writeFile(join(outBase, 'registry.json'), JSON.stringify(registryJson, null, 2), 'utf-8')
  await fs.writeFile(
    join(publicBase, 'registry.json'),
    JSON.stringify(registryJson, null, 2),
    'utf-8',
  )

  // 7. Regenerate all.json (bundled components)
  await generateAllJson({ rootDir, groupMap, allowedDeps, allowedDevDeps, typesDevDepsMap })

  // eslint-disable-next-line no-console
  console.info('Registry generated at', outBase)
}

/**
 * Regenerates the all.json bundle containing all registered components.
 */
export async function generateAllJson(options: {
  rootDir: string
  groupMap: Map<string, ComponentAssetFile[]>
  allowedDeps: Set<string>
  allowedDevDeps: Set<string>
  typesDevDepsMap: Map<string, string[]>
}) {
  const { rootDir, groupMap, allowedDeps, allowedDevDeps, typesDevDepsMap } = options
  const outBase = join(rootDir, registryConfig.outputDir)

  const allDependencies = new Set<string>()
  const allDevDependencies = new Set<string>()
  const allRegistryDependencies = new Set<string>()
  const allFiles: Array<any> = []

  for (const [group, groupFiles] of groupMap) {
    for (const f of groupFiles) {
      const code = extractSourceCode(f)
      if (code) {
        const imports = parseImportsFromCode(code)
        const analysis = analyzeDependencies(imports, allowedDeps, allowedDevDeps, {
          filePath: f.path,
          currentGroup: group,
          skipAiComponentDeps: false,
          typesDevDepsMap,
        })
        analysis.dependencies.forEach(dep => allDependencies.add(dep))
        analysis.devDependencies.forEach(dep => allDevDependencies.add(dep))
        analysis.registryDependencies.forEach(dep => allRegistryDependencies.add(dep))
      }

      const file: any = {
        path: f.path,
        type: f.type,
        content: f.content,
      }
      if (f.target) {
        file.target = f.target
      }
      allFiles.push(file)
    }
  }

  const allJson = {
    $schema: 'https://shadcn-vue.com/schema/registry-item.json',
    name: 'all',
    type: 'registry:component' as const,
    title: 'All Components Bundle',
    description: 'Bundle containing all registered components.',
    files: allFiles,
    dependencies: Array.from(allDependencies),
    devDependencies: Array.from(allDevDependencies),
    registryDependencies: Array.from(allRegistryDependencies).filter(dep => !groupMap.has(dep)),
  }

  if (validateRegistryItem(allJson, 'all')) {
    await fs.writeFile(join(outBase, 'all.json'), JSON.stringify(allJson, null, 2), 'utf-8')
    // eslint-disable-next-line no-console
    console.info('Bundle generated: all.json')
  }
}

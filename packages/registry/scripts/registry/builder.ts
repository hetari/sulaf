import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import { registryConfig } from '../registry.config'
import type { ComponentAssetFile, PackageJson, RegistryContext, RegistryItemType } from './types'
import {
  walkComponentFiles,
  toTitle,
  validateRegistryItem,
  getRegistryTypeFromFile,
  buildTypesDevDepsMap,
  loadLocalMetadata,
  getRelativeSourcePath,
  normalizeRegistryFile,
} from './utils'
import { extractSourceCode, parseImportsFromCode, analyzeDependencies } from './analyzer'
import type { Registry, RegistryItem } from 'shadcn-vue/schema'

/**
 * Loads and filters dependencies from package.json.
 */
async function loadProjectDependencies(rootDir: string) {
  const pkgPath = join(rootDir, 'package.json')
  let pkg: PackageJson = {}
  try {
    const raw = await fs.readFile(pkgPath, 'utf-8')
    pkg = JSON.parse(raw)
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

  return { allowedDeps, allowedDevDeps, typesDevDepsMap }
}

/**
 * Resolves dependencies for a set of files by analyzing imports.
 */
function resolveFileDependencies(
  files: ComponentAssetFile[],
  group: string,
  allowedDeps: Set<string>,
  allowedDevDeps: Set<string>,
  typesDevDepsMap: Map<string, string[]>,
) {
  const dependencies = new Set<string>()
  const devDependencies = new Set<string>()
  const registryDependencies = new Set<string>()

  for (const f of files) {
    const code = extractSourceCode(f)
    if (!code) continue

    const analysis = analyzeDependencies(parseImportsFromCode(code), allowedDeps, allowedDevDeps, {
      filePath: f.path,
      currentGroup: group,
      typesDevDepsMap,
    })

    analysis.dependencies.forEach(d => dependencies.add(d))
    analysis.devDependencies.forEach(d => devDependencies.add(d))
    analysis.registryDependencies.forEach(d => registryDependencies.add(d))
  }

  return { dependencies, devDependencies, registryDependencies }
}

/**
 * Main function to generate registry assets based on the global configuration.
 */
export async function generateRegistryAssets(ctx: RegistryContext) {
  const { rootDir } = ctx
  const srcDir = join(rootDir, registryConfig.srcDir)
  const { allowedDeps, allowedDevDeps, typesDevDepsMap } = await loadProjectDependencies(rootDir)

  // 1. Prepare Paths
  const outBase = join(rootDir, registryConfig.outputDir)
  const publicBase = join(rootDir, registryConfig.publicDir)

  // 3. Collect component files
  const componentFiles = await walkComponentFiles(srcDir, srcDir)
  const files: ComponentAssetFile[] = []

  for (const abs of componentFiles) {
    const raw = await fs.readFile(abs, 'utf-8')
    let parsed = raw

    for (const replacement of registryConfig.replacements) {
      parsed = parsed.replace(replacement.from, replacement.to)
    }

    files.push({
      type: getRegistryTypeFromFile(abs),
      path: getRelativeSourcePath(abs, rootDir),
      content: parsed,
    })
  }

  // 4. Group files by component
  const groupMap = new Map<string, ComponentAssetFile[]>()
  const itemTypeMap = new Map<string, RegistryItemType>()

  for (const f of files) {
    const rel = f.path.replace(
      registryConfig.srcDir.endsWith('/') ? registryConfig.srcDir : `${registryConfig.srcDir}/`,
      '',
    )
    const parts = rel.split('/')
    let group = parts[0]
    if (!group) continue

    // Detect item type based on parent directory
    if (group === 'blocks' || group === 'pages' || group === 'ui') {
      const type = `registry:${group === 'ui' ? 'ui' : group.replace(/s$/, '')}` as RegistryItemType
      group = parts[1] || group
      itemTypeMap.set(group, type)
    }

    if (!groupMap.has(group)) groupMap.set(group, [])
    groupMap.get(group)!.push(f)
  }

  // 5. Generate individual component JSON files
  const componentItems: RegistryItem[] = []

  for (const [group, groupFiles] of groupMap) {
    // 5.1 Load local registry.json if it exists for this component
    const localMetadata = await loadLocalMetadata(srcDir, group)

    // 5.2 Analysis: Resolve dependencies from imports
    const groupDeps = resolveFileDependencies(
      groupFiles,
      group,
      allowedDeps,
      allowedDevDeps,
      typesDevDepsMap,
    )

    // 5.2 Merge manual metadata overrides for files and types
    for (const f of groupFiles) {
      const relPath = getRelativeSourcePath(f.path, join(registryConfig.srcDir, group))
      const localOverride = localMetadata.files?.find(lf => lf.path === relPath)

      if (localOverride?.type) {
        f.type = localOverride.type
      } else if (localMetadata.type && localMetadata.type !== 'registry:block') {
        f.type = localMetadata.type
      }
    }

    // 5.4 Merge manual metadata overrides for dependencies
    localMetadata.dependencies?.forEach(d => groupDeps.dependencies.add(d))
    localMetadata.devDependencies?.forEach(d => groupDeps.devDependencies.add(d))
    localMetadata.registryDependencies?.forEach(d => groupDeps.registryDependencies.add(d))

    // 5.5 Construct the final registry item JSON
    const itemJson = {
      $schema: 'https://shadcn-vue.com/schema/registry-item.json',
      name: group,
      type: localMetadata.type || itemTypeMap.get(group) || 'registry:component',
      title: localMetadata.title || toTitle(group),
      description: localMetadata.description || `${toTitle(group)} component set.`,
      files: groupFiles.map(f => {
        const local = localMetadata.files?.find(
          lf => lf.path === getRelativeSourcePath(f.path, join(registryConfig.srcDir, group)),
        )
        return normalizeRegistryFile(f.path, f.type, group, registryConfig.srcDir, local?.target)
      }),
      dependencies: Array.from(groupDeps.dependencies),
      devDependencies: Array.from(groupDeps.devDependencies),
      registryDependencies: Array.from(groupDeps.registryDependencies),
    } as any

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

  // 1. Resolve global dependencies for the entire bundle
  const allFiles: ComponentAssetFile[] = Array.from(groupMap.values()).flat()
  const globalDeps = resolveFileDependencies(
    allFiles,
    'all',
    allowedDeps,
    allowedDevDeps,
    typesDevDepsMap,
  )

  // 2. Prepare items for bundle
  const bundledFiles = allFiles.map(f => {
    // Determine the group for this file to get correct relative path
    const rel = getRelativeSourcePath(f.path, registryConfig.srcDir)
    const group = rel.split('/')[0] === 'ui' ? rel.split('/')[1] : rel.split('/')[0]

    const item = normalizeRegistryFile(f.path, f.type, group || '', registryConfig.srcDir)
    return Object.assign(item, { content: f.content })
  })

  const allJson = {
    $schema: 'https://shadcn-vue.com/schema/registry-item.json',
    name: 'all',
    type: 'registry:component',
    title: 'All Components Bundle',
    description: 'Bundle containing all registered components.',
    files: bundledFiles,
    dependencies: Array.from(globalDeps.dependencies),
    devDependencies: Array.from(globalDeps.devDependencies),
    registryDependencies: Array.from(globalDeps.registryDependencies).filter(
      dep => !groupMap.has(dep),
    ),
  } as any

  if (validateRegistryItem(allJson, 'all')) {
    await fs.writeFile(join(outBase, 'all.json'), JSON.stringify(allJson, null, 2), 'utf-8')
    // eslint-disable-next-line no-console
    console.info('Bundle generated: all.json')
  }
}

import type { Registry } from 'shadcn-vue/schema'
import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildTypesDevDepsMap, resolveFile } from '../src/dependency-resolver'
import { bundleAll, emitRegistry, toTitle } from '../src/registry-emitter'
import type { ResolvedComponentDeps } from '../src/registry-emitter'
import { collectSources } from '../src/source-collector'
import { registryConfig } from './registry.config'

interface PackageJson {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

async function main(rootDir: string): Promise<void> {
  // ---------------------------------------------------------------------------
  // 1. Read package.json for allowed dependency sets.
  // ---------------------------------------------------------------------------
  let pkg: PackageJson = {}
  try {
    const raw = await fs.readFile(join(rootDir, 'package.json'), 'utf-8')
    pkg = JSON.parse(raw) as PackageJson
  } catch {}

  const excludedDeps = new Set(registryConfig.excludedDeps)
  const excludedDevDeps = new Set(['typescript'])

  const allowedDeps = new Set(Object.keys(pkg.dependencies ?? {}).filter(d => !excludedDeps.has(d)))
  const allowedDevDeps = new Set(
    Object.keys(pkg.devDependencies ?? {}).filter(d => !excludedDevDeps.has(d)),
  )
  const typesDevDepsMap = buildTypesDevDepsMap(Array.from(allowedDevDeps))

  // ---------------------------------------------------------------------------
  // 2. Collect sources (Stage 1).
  // ---------------------------------------------------------------------------
  const { components, examples } = await collectSources(rootDir, registryConfig)

  // ---------------------------------------------------------------------------
  // 3. Resolve dependencies per slug (Stage 2).
  // ---------------------------------------------------------------------------
  const resolvedDeps = new Map<string, ResolvedComponentDeps>()

  // Merge DependencyResult sets for all files in a group into one ResolvedComponentDeps.
  function mergeIntoDeps(
    target: ResolvedComponentDeps,
    content: string,
    filePath: string,
    currentSlug: string,
    skipInternalRegistryDeps = false,
  ): void {
    const result = resolveFile(content, filePath, {
      allowedDeps,
      allowedDevDeps,
      typesDevDepsMap,
      componentDir: registryConfig.componentDir,
      currentSlug,
      skipInternalRegistryDeps,
    })
    result.dependencies.forEach(d => target.dependencies.add(d))
    result.devDependencies.forEach(d => target.devDependencies.add(d))
    result.registryDependencies.forEach(d => target.registryDependencies.add(d))
  }

  for (const [slug, groupFiles] of components) {
    const deps: ResolvedComponentDeps = {
      dependencies: new Set(),
      devDependencies: new Set(),
      registryDependencies: new Set(),
    }
    for (const f of groupFiles) {
      mergeIntoDeps(deps, f.content, f.path, slug)
    }
    resolvedDeps.set(slug, deps)
  }

  // Resolve example deps.
  for (const ef of examples) {
    const name = ef.path.replace('examples/', '').replace('.vue', '')
    const deps: ResolvedComponentDeps = {
      dependencies: new Set(),
      devDependencies: new Set(),
      registryDependencies: new Set(),
    }
    mergeIntoDeps(deps, ef.content, ef.path, `example-${name}`)
    resolvedDeps.set(`example-${name}`, deps)
  }

  // ---------------------------------------------------------------------------
  // 4. Emit in-memory JSON (Stage 3).
  // ---------------------------------------------------------------------------
  const emitterConfig = { registryName: registryConfig.registry.name }
  const emitted = emitRegistry(components, examples, resolvedDeps, emitterConfig)

  // Compute merged deps for all.json (skip internal registryDeps — hooks/composables are in-bundle).
  const allDeps: ResolvedComponentDeps = {
    dependencies: new Set(),
    devDependencies: new Set(),
    registryDependencies: new Set(),
  }
  for (const [slug, groupFiles] of components) {
    for (const f of groupFiles) {
      mergeIntoDeps(allDeps, f.content, f.path, slug, /* skipInternalRegistryDeps */ true)
    }
  }

  // Separate component items from example items for bundleAll.
  const componentItems = emitted.filter(
    e => !e.path.startsWith('examples/') && e.path !== 'all.json',
  )
  const allItem = bundleAll(componentItems, allDeps, emitterConfig)

  // ---------------------------------------------------------------------------
  // 5. Write to disk (entry-point responsibility only).
  // ---------------------------------------------------------------------------
  const outBase = join(rootDir, registryConfig.outputDir)
  await fs.mkdir(join(outBase, 'components'), { recursive: true })
  await fs.mkdir(join(outBase, 'examples'), { recursive: true })

  for (const item of emitted) {
    await fs.writeFile(join(outBase, item.path), item.content, 'utf-8')
  }

  if (allItem) {
    await fs.writeFile(join(outBase, allItem.path), allItem.content, 'utf-8')
  }

  // ---------------------------------------------------------------------------
  // 6. Write registry.json index.
  // ---------------------------------------------------------------------------
  const registryJson: Registry = {
    name: registryConfig.registry.name,
    homepage: registryConfig.registry.homepage,
    items: [
      ...Array.from(components.keys()).map(slug => {
        const files = components.get(slug)!
        const primaryType =
          files.find(f => f.type === 'registry:ui')?.type ??
          files.find(f => f.type === 'registry:hook')?.type ??
          files.find(f => f.type === 'registry:component')?.type ??
          'registry:component'
        return {
          name: slug,
          type: primaryType as 'registry:ui' | 'registry:component' | 'registry:hook',
          title: toTitle(slug),
          description: `${registryConfig.registry.name} ${slug.replace('-', ' ')} components.`,
          files: files.map(f => ({ path: f.path, type: f.type })),
        }
      }),
      ...examples.map(ef => {
        const fileName = ef.path.replace('examples/', '')
        const name = fileName.replace('.vue', '')
        return {
          name: `example-${name}`,
          type: 'registry:block' as const,
          title: `${toTitle(name)} Example`,
          description: `Example implementation of ${name.replace('-', ' ')}.`,
          files: [{ path: ef.path, type: ef.type }],
        }
      }),
    ],
  }

  await fs.writeFile(join(outBase, 'registry.json'), JSON.stringify(registryJson, null, 2), 'utf-8')

  // eslint-disable-next-line no-console
  console.info('[registry] registry assets generated at', outBase)
}

if (
  import.meta.main ||
  (typeof process !== 'undefined' && process.argv[1]?.endsWith('registry-builder.ts'))
) {
  main(join(dirname(fileURLToPath(import.meta.url)), '..'))
}

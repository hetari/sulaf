import { basename } from 'node:path'
import { registryItemSchema } from 'shadcn-vue/schema'
import type { CollectedFile, EmittedFile, ExampleFile } from './types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a kebab-case slug to Title Case (e.g. `phone-input` → `Phone Input`). */
export function toTitle(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** Zod validation — emits a console.warn for non-fatal issues, returns false on failure. */
function validateRegistryItem(item: unknown, label: string): boolean {
  const parsed = registryItemSchema.safeParse(item)
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.warn(`Invalid registry item schema (${label}):`, parsed.error.issues)
    return false
  }
  if (!parsed.data.files || parsed.data.files.length === 0) {
    // eslint-disable-next-line no-console
    console.warn(`Invalid registry item: files must be non-empty array (${label})`)
    return false
  }
  return true
}

/** Pick primary registry type from a group's files (ui > hook > component). */
function primaryType(
  files: CollectedFile[],
): 'registry:ui' | 'registry:component' | 'registry:hook' {
  if (files.some(f => f.type === 'registry:ui')) return 'registry:ui'
  if (files.some(f => f.type === 'registry:hook')) return 'registry:hook'
  return 'registry:component'
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface EmitRegistryConfig {
  /** Registry display name (e.g. `'sulaf'`). */
  registryName: string
}

/**
 * Pre-resolved dependency data for a single component slug.
 * Produced by calling `resolveFile` for every file in the group and merging.
 */
export interface ResolvedComponentDeps {
  dependencies: Set<string>
  devDependencies: Set<string>
  registryDependencies: Set<string>
}

/**
 * Registry Emitter — the third stage of the registry build pipeline.
 *
 * Takes grouped, pre-analyzed component data and produces serialized registry
 * JSON in-memory as `{ path: string, content: string }[]`.
 *
 * Handles:
 * - Zod schema validation (console.warn for non-fatal, skips invalid items).
 * - Hook bundling: inlines hook files into consuming component's `files` array
 *   and removes the hook from `registryDependencies`.
 * - Per-component JSON generation.
 *
 * Does NOT write to disk — the entry-point script handles all filesystem output.
 *
 * @param components     Grouped component files from the Source Collector.
 * @param examples       Example files from the Source Collector.
 * @param resolvedDeps   Map<slug, ResolvedComponentDeps> from the Dependency Resolver.
 * @param config         Minimal emitter configuration.
 * @returns              Array of in-memory `{ path, content }` items.
 */
export function emitRegistry(
  components: Map<string, CollectedFile[]>,
  examples: ExampleFile[],
  resolvedDeps: Map<string, ResolvedComponentDeps>,
  config: EmitRegistryConfig,
): EmittedFile[] {
  const emitted: EmittedFile[] = []

  // ---------------------------------------------------------------------------
  // Per-component items
  // ---------------------------------------------------------------------------
  for (const [slug, groupFiles] of components) {
    const deps = resolvedDeps.get(slug) ?? {
      dependencies: new Set<string>(),
      devDependencies: new Set<string>(),
      registryDependencies: new Set<string>(),
    }

    // Hook bundling: transitively inline hook files and merge their dependencies, remove from registryDependencies.
    const finalRegistryDeps = new Set<string>()
    const bundledFiles = [...groupFiles]
    const mergedDependencies = new Set(deps.dependencies)
    const mergedDevDependencies = new Set(deps.devDependencies)

    const hookQueue: string[] = []
    const visitedHooks = new Set<string>()

    for (const dep of deps.registryDependencies) {
      const depFiles = components.get(dep)
      if (depFiles && depFiles.some(f => f.type === 'registry:hook')) {
        hookQueue.push(dep)
      } else {
        finalRegistryDeps.add(dep)
      }
    }

    while (hookQueue.length > 0) {
      const hookSlug = hookQueue.shift()!
      if (visitedHooks.has(hookSlug)) continue
      visitedHooks.add(hookSlug)

      const hookFiles = components.get(hookSlug)
      if (hookFiles) {
        for (const hf of hookFiles) {
          if (!bundledFiles.some(bf => bf.path === hf.path)) {
            bundledFiles.push(hf)
          }
        }
      }

      const hookDeps = resolvedDeps.get(hookSlug)
      if (hookDeps) {
        hookDeps.dependencies.forEach(d => mergedDependencies.add(d))
        hookDeps.devDependencies.forEach(d => mergedDevDependencies.add(d))
        for (const transDep of hookDeps.registryDependencies) {
          const transFiles = components.get(transDep)
          if (transFiles && transFiles.some(f => f.type === 'registry:hook')) {
            if (!visitedHooks.has(transDep)) {
              hookQueue.push(transDep)
            }
          } else {
            finalRegistryDeps.add(transDep)
          }
        }
      }
    }

    const itemJson = {
      $schema: 'https://shadcn-vue.com/schema/registry-item.json',
      name: slug,
      type: primaryType(groupFiles),
      title: toTitle(slug),
      description: `${config.registryName} ${slug.replace('-', ' ')} components.`,
      files: bundledFiles.map(f =>
        Object.assign(
          { type: f.type, path: f.path, content: f.content },
          f.target !== undefined ? { target: f.target } : {},
        ),
      ),
      dependencies: Array.from(mergedDependencies),
      devDependencies: Array.from(mergedDevDependencies),
      registryDependencies: Array.from(finalRegistryDeps),
    }

    if (validateRegistryItem(itemJson, `component-${slug}`)) {
      emitted.push({ path: `${slug}.json`, content: `${JSON.stringify(itemJson, null, 2)}\n` })
    } else {
      // eslint-disable-next-line no-console
      console.error(`Skipping invalid component: ${slug}`)
    }
  }

  // ---------------------------------------------------------------------------
  // Per-example items
  // ---------------------------------------------------------------------------
  for (const ef of examples) {
    const fileName = basename(ef.path)
    const name = fileName.replace('.vue', '')
    // Example deps are resolved separately and passed in resolvedDeps under the key `example-<name>`
    const deps = resolvedDeps.get(`example-${name}`) ?? {
      dependencies: new Set<string>(),
      devDependencies: new Set<string>(),
      registryDependencies: new Set<string>(),
    }

    const itemJson = {
      $schema: 'https://shadcn-vue.com/schema/registry-item.json',
      name: `example-${name}`,
      type: 'registry:block',
      title: `${toTitle(name)} Example`,
      description: `Example implementation of ${name.replace('-', ' ')}.`,
      files: [{ type: ef.type, path: ef.path, content: ef.content }],
      dependencies: Array.from(deps.dependencies),
      devDependencies: Array.from(deps.devDependencies),
      registryDependencies: Array.from(deps.registryDependencies),
    }

    if (validateRegistryItem(itemJson, `example-${name}`)) {
      emitted.push({
        path: `examples/${name}.json`,
        content: `${JSON.stringify(itemJson, null, 2)}\n`,
      })
    } else {
      // eslint-disable-next-line no-console
      console.error(`Skipping invalid example: ${name}`)
    }
  }

  return emitted
}

/**
 * Post-processing step that produces `all.json` from already-emitted per-component items.
 *
 * Unions files from all component items, strips any `registryDependency` whose slug
 * is present in the bundle, and emits a single `registry:ui` item.
 *
 * @param componentItems  Only component items (not examples) from `emitRegistry` output.
 * @param allDeps         Pre-computed merged deps for `all.json` (from the entry-point resolver pass with `skipInternalRegistryDeps: true`).
 * @param config          Emitter configuration.
 */
export function bundleAll(
  componentItems: EmittedFile[],
  allDeps: {
    dependencies: Set<string>
    devDependencies: Set<string>
    registryDependencies: Set<string>
  },
  config: EmitRegistryConfig,
): EmittedFile | null {
  // Parse already-serialized JSON to extract file lists.
  const allFiles: Array<{ path: string; type: string; content: string; target?: string }> = []
  const slugsInBundle = new Set<string>()

  for (const item of componentItems) {
    try {
      const parsed = JSON.parse(item.content) as {
        name: string
        files: Array<{ path: string; type: string; content: string; target?: string }>
      }
      slugsInBundle.add(parsed.name)
      for (const f of parsed.files ?? []) {
        if (!allFiles.some(af => af.path === f.path)) {
          allFiles.push(f)
        }
      }
    } catch {
      // skip malformed items
    }
  }

  const allJson = {
    $schema: 'https://shadcn-vue.com/schema/registry-item.json',
    name: 'all',
    type: 'registry:ui',
    title: `All ${config.registryName} Elements`,
    description: `Bundle containing all ${config.registryName} components.`,
    files: allFiles,
    dependencies: Array.from(allDeps.dependencies),
    devDependencies: Array.from(allDeps.devDependencies),
    registryDependencies: Array.from(allDeps.registryDependencies).filter(
      dep => !slugsInBundle.has(dep),
    ),
  }

  if (validateRegistryItem(allJson, 'all')) {
    return { path: 'all.json', content: `${JSON.stringify(allJson, null, 2)}\n` }
  }
  // eslint-disable-next-line no-console
  console.error('Skipping invalid all.json')
  return null
}

import type { Dirent } from 'node:fs'
import { promises as fs } from 'node:fs'
import { basename, join, relative } from 'node:path'
import type { CollectedFile, CollectedSources, ExampleFile, RegistryFileType } from './types'

// ---------------------------------------------------------------------------
// Filesystem walker
// ---------------------------------------------------------------------------

async function walkFiles(dir: string, rootDir: string): Promise<string[]> {
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
      out.push(...(await walkFiles(full, rootDir)))
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.vue')) {
        out.push(full)
      } else if (entry.name.endsWith('.ts')) {
        // Exclude root src/index.ts
        const isRootIndex = full === join(rootDir, 'index.ts')
        if (!isRootIndex) out.push(full)
      }
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// Registry type resolution
// ---------------------------------------------------------------------------

function srcDirToFileType(srcDir: string): RegistryFileType {
  if (srcDir === 'components') return 'registry:ui'
  if (srcDir === 'hooks') return 'registry:hook'
  return 'registry:component'
}

// ---------------------------------------------------------------------------
// Grouping
// ---------------------------------------------------------------------------

function groupBySlug(files: CollectedFile[]): Map<string, CollectedFile[]> {
  const map = new Map<string, CollectedFile[]>()
  for (const f of files) {
    if (!map.has(f.slug)) map.set(f.slug, [])
    map.get(f.slug)!.push(f)
  }
  return map
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface SourceCollectorConfig {
  /** Source directories to walk (e.g. `['components', 'blocks', 'pages', 'hooks']`). */
  srcDirs: string[]
  /** Path replacements applied to raw file content before storing. */
  replacements: Array<{ from: RegExp | string; to: string }>
}

/**
 * Source Collector — the first stage of the registry build pipeline.
 *
 * Walks each configured source directory, reads file contents, applies alias
 * replacements, flattens hook paths, and groups files by slug.
 *
 * Does NOT analyse dependencies — that responsibility belongs to the Dependency Resolver.
 *
 * @param rootDir  Absolute path to the registry package root (used to resolve `srcDirs`).
 * @param config   Source collection configuration (subset of the full registryConfig).
 * @returns        Structured result: `{ components: Map<slug, CollectedFile[]>, examples: ExampleFile[] }`.
 */
export async function collectSources(
  rootDir: string,
  config: SourceCollectorConfig,
): Promise<CollectedSources> {
  const rawFiles: CollectedFile[] = []

  for (const srcDir of config.srcDirs) {
    const srcPath = join(rootDir, srcDir)
    const absPaths = await walkFiles(srcPath, srcPath)
    const baseType = srcDirToFileType(srcDir)

    for (const abs of absPaths) {
      const raw = await fs.readFile(abs, 'utf-8')

      // Apply alias replacements
      let content = raw
      for (const r of config.replacements) {
        content = content.replace(r.from as RegExp, r.to)
      }

      let rel = relative(srcPath, abs).split('\\').join('/')

      // Flatten hooks: use-foo/index.ts → use-foo.ts
      if (srcDir === 'hooks' && rel.endsWith('/index.ts')) {
        rel = rel.replace('/index.ts', '.ts')
      }

      // Derive slug from path
      let slug: string
      if (baseType === 'registry:hook' && !rel.includes('/') && rel.endsWith('.ts')) {
        // Flattened hook file — slug is the filename without extension
        slug = rel.replace('.ts', '')
      } else {
        slug = rel.split('/')[0] ?? ''
      }

      if (!slug) continue

      rawFiles.push({ path: rel, content, type: baseType, slug, srcDir })
    }
  }

  const components = groupBySlug(rawFiles)

  // ---------------------------------------------------------------------------
  // Examples
  // ---------------------------------------------------------------------------
  const examplesDir = join(rootDir, 'examples')
  const examples: ExampleFile[] = []
  try {
    const entries = await fs.readdir(examplesDir, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.vue')) continue
      const abs = join(examplesDir, entry.name)
      const raw = await fs.readFile(abs, 'utf-8')
      let content = raw
      for (const r of config.replacements) {
        content = content.replace(r.from as RegExp, r.to)
      }
      examples.push({
        path: `examples/${basename(abs)}`,
        content,
        type: 'registry:block',
      })
    }
  } catch {
    // examples/ directory is optional
  }

  return { components, examples }
}

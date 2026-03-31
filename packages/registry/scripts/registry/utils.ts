import { promises as fs, type Dirent } from 'node:fs'
import { join, relative } from 'node:path'
import { registryItemSchema, type RegistryItem } from 'shadcn-vue/schema'
import type { RegistryFileType, RegistryItemMetadata } from './types'

/**
 * Converts a slug-case string to Title Case.
 * @param slug The slug string (e.g., 'hello-world')
 * @returns The title string (e.g., 'Hello World')
 */
export function toTitle(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/**
 * Removes duplicate values from an array.
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

/**
 * Normalizes a package name to its base (e.g., '@scope/pkg/subpath' -> '@scope/pkg').
 */
export function getBasePackageName(specifier: string): string {
  if (specifier.startsWith('@')) {
    const parts = specifier.split('/')
    return parts.slice(0, 2).join('/')
  }
  return specifier.split('/')[0] || ''
}

/**
 * Extracts a registry slug from a module path if it belongs to a known registry directory.
 */
export function extractRegistrySlug(modulePath: string, basePath: string): string {
  if (!modulePath.startsWith(basePath)) return ''

  const rest = modulePath.slice(basePath.length).split('/').find(Boolean)

  return rest || ''
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
 * Validates a registry item against the shadcn-vue schema.
 * @param item The item to validate
 * @param label A label for logging purposes
 * @returns True if valid, false otherwise
 */
export function validateRegistryItem(item: unknown, label: string): item is RegistryItem {
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

/**
 * Recursively walks a directory to find component-related files (.vue, .ts).
 * @param dir The directory to walk
 * @param rootDir The root directory of the component set (to filter out index.ts)
 * @returns A promise that resolves to an array of absolute file paths
 */
export async function walkComponentFiles(dir: string, rootDir: string): Promise<string[]> {
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
      if (entry.name.endsWith('.vue')) {
        out.push(full)
      } else if (entry.name.endsWith('.ts')) {
        const isRootIndex = full === join(rootDir, 'index.ts')
        if (!isRootIndex) {
          out.push(full)
        }
      }
    }
  }
  return out
}

/**
 * Auto-detects the registry file type based on filename and extension.
 */
export function getRegistryTypeFromFile(filePath: string): RegistryFileType {
  const fileName = filePath.split('/').pop() || ''

  if (fileName.endsWith('.vue')) {
    return filePath.includes('/ui/') ? 'registry:ui' : 'registry:component'
  }

  if (fileName.startsWith('use') && fileName.endsWith('.ts')) {
    return 'registry:hook'
  }

  if (['context.ts', 'types.ts', 'index.ts'].includes(fileName)) {
    return 'registry:file'
  }

  if (['utils.ts', 'lib.ts'].includes(fileName)) {
    return 'registry:lib'
  }

  return 'registry:file'
}

/**
 * Loads and parses local registry.json if it exists in the component directory.
 */
export async function loadLocalMetadata(
  srcDir: string,
  group: string,
): Promise<RegistryItemMetadata> {
  const localRegistryPath = join(srcDir, group, 'registry.json')
  try {
    const raw = await fs.readFile(localRegistryPath, 'utf-8')
    return JSON.parse(raw) as RegistryItemMetadata
  } catch {
    return {}
  }
}

/**
 * Helper to get path relative to source directory with forward slashes.
 */
export function getRelativeSourcePath(filePath: string, srcDir: string): string {
  return relative(srcDir, filePath).split('\\').join('/')
}

/**
 * Normalizes a file object for registry JSON, applying target defaults.
 */
export function normalizeRegistryFile(
  path: string,
  type: RegistryFileType,
  group: string,
  srcDir: string,
  explicitTarget?: string,
) {
  const relPath = relative(join(srcDir, group), path).split('\\').join('/')

  const file: {
    path: string
    type: RegistryFileType
    target?: string
    content?: string
  } = { path, type }

  if (explicitTarget) {
    file.target = explicitTarget
  } else if (type === 'registry:file' || type === 'registry:page') {
    file.target = relPath
  }

  return file
}

import { promises as fs, type Dirent } from 'node:fs'
import { join } from 'node:path'
import { registryItemSchema, type RegistryItem } from 'shadcn-vue/schema'

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
 * @param arr The array containing potential duplicates
 * @returns A new array with unique values
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
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

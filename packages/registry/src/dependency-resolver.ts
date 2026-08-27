import { parse as parseSFC } from '@vue/compiler-sfc'
import type { DependencyResult } from './types'

// ---------------------------------------------------------------------------
// Regex-based import extraction
// Matches: import ... from '...' / export ... from '...'
// Deliberately avoids ts-morph to eliminate per-file Project instantiation cost.
// ---------------------------------------------------------------------------
const IMPORT_RE = /(?:^|\n)\s*(?:import|export)\s[\s\S]*?from\s+['"]([^'"]+)['"]/g

/** Extract all import/export specifiers from a block of TypeScript/JavaScript code. */
export function parseImportSpecifiers(code: string): string[] {
  const seen = new Set<string>()
  let match: RegExpExecArray | null
  // Reset lastIndex before each use (regex is stateful when using /g flag)
  IMPORT_RE.lastIndex = 0
  while ((match = IMPORT_RE.exec(code)) !== null) {
    if (match[1]) seen.add(match[1])
  }
  return Array.from(seen)
}

// ---------------------------------------------------------------------------
// SFC extraction — owned internally by the resolver, not exposed to callers.
// ---------------------------------------------------------------------------

function extractSFCScriptCode(content: string): string {
  const { descriptor } = parseSFC(content)
  return [descriptor.script?.content ?? '', descriptor.scriptSetup?.content ?? ''].join('\n')
}

// ---------------------------------------------------------------------------
// Package name helpers
// ---------------------------------------------------------------------------

/** Normalize a specifier to its base package name (handles scoped packages). */
export function getBasePackageName(specifier: string): string {
  if (specifier.startsWith('@')) {
    return specifier.split('/').slice(0, 2).join('/')
  }
  return specifier.split('/')[0] ?? ''
}

/**
 * Build a mapping from runtime package name → its `@types/` devDependency names.
 * e.g. `libphonenumber-js` → `['@types/libphonenumber-js']`
 * Scoped packages follow DefinitelyTyped convention: `@babel/core` → `@types/babel__core`.
 */
export function buildTypesDevDepsMap(devDependencies: string[]): Map<string, string[]> {
  const TYPES_PREFIX = '@types/'
  const map = new Map<string, string[]>()
  for (const dep of devDependencies) {
    if (!dep.startsWith(TYPES_PREFIX)) continue
    const name = dep.slice(TYPES_PREFIX.length)
    // DefinitelyTyped uses __ for scoped packages: @types/babel__core → @babel/core
    const runtime = name.includes('__') ? `@${name.replace('__', '/')}` : name
    const list = map.get(runtime) ?? []
    list.push(dep)
    map.set(runtime, list)
  }
  return map
}

/** Extract the registry slug from an internal alias path (e.g. `@/components/ui/button/index` → `button`). */
function extractRegistrySlug(modulePath: string, basePath: string): string {
  if (!modulePath.startsWith(basePath)) return ''
  return modulePath.slice(basePath.length).split('/').find(Boolean) ?? ''
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface ResolveDepsOptions {
  /** Allowed npm `dependencies` (from package.json, after exclusions). */
  allowedDeps: Set<string>
  /** Allowed npm `devDependencies` (from package.json, after exclusions). */
  allowedDevDeps: Set<string>
  /** Pre-built @types/ mapping. */
  typesDevDepsMap: Map<string, string[]>
  /** The component directory alias segment (e.g. `'ui'` → `@/components/ui/`). */
  componentDir: string
  /** The slug for the current file's group — used to skip self-references. */
  currentSlug?: string
  /** When true, skip adding internal `registryDependencies` (used for `all.json` bundling). */
  skipInternalRegistryDeps?: boolean
}

/**
 * Dependency Resolver — the second stage of the registry build pipeline.
 *
 * Accepts raw file content and its path. Internally decides whether to extract
 * the TypeScript code from a Vue SFC or use the content directly for `.ts` files.
 * Parses import specifiers via regex (no AST tooling) and classifies them into
 * npm `dependencies`, npm `devDependencies`, and internal `registryDependencies`.
 *
 * @param content  Raw file content (may be a Vue SFC or plain TypeScript).
 * @param filePath File path, used only to determine parsing strategy (`.vue` vs `.ts`).
 * @param opts     Allowed dependency sets and classification options.
 */
export function resolveFile(
  content: string,
  filePath: string,
  opts: ResolveDepsOptions,
): DependencyResult {
  const code = filePath.endsWith('.vue') ? extractSFCScriptCode(content) : content
  const specifiers = parseImportSpecifiers(code)

  const dependencies = new Set<string>()
  const devDependencies = new Set<string>()
  const registryDependencies = new Set<string>()

  for (const mod of specifiers) {
    // Relative imports within the same group — skip entirely.
    if (mod.startsWith('./')) continue

    // Relative cross-group imports (e.g. `../../other-component`) — treat as registryDependency.
    // (Edge case: not commonly present but retained for parity with original builder.)
    if (mod.startsWith('../')) {
      // We don't have enough context to resolve cross-group relative paths at this level;
      // the entry point passes the relative path of the file, not an absolute path.
      // This case is handled conservatively: skip.
      continue
    }

    // Normalize to base package name for dep set lookups.
    const pkg = getBasePackageName(mod)

    if (opts.allowedDeps.has(pkg)) {
      dependencies.add(pkg)
      // Pull in corresponding @types/ packages when present.
      const typePkgs = opts.typesDevDepsMap.get(pkg)
      if (typePkgs) {
        for (const t of typePkgs) devDependencies.add(t)
      }
    }

    if (opts.allowedDevDeps.has(mod)) {
      devDependencies.add(mod)
    }

    // Internal component alias: @/components/ui/<slug>/...
    // NOTE: these are ALWAYS added to registryDependencies regardless of skipInternalRegistryDeps,
    // because they may reference external shadcn-vue registry items (not only our own).
    // This matches the original builder's behaviour.
    if (mod.startsWith(`@/components/${opts.componentDir}/`)) {
      const slug = extractRegistrySlug(mod, `@/components/${opts.componentDir}/`)
      if (slug && slug !== opts.currentSlug) {
        registryDependencies.add(slug)
      }
      continue
    }

    if (!opts.skipInternalRegistryDeps) {
      // Hook alias: @/hooks/<slug>/...
      if (mod.startsWith('@/hooks/')) {
        const slug = extractRegistrySlug(mod, '@/hooks/')
        if (slug && slug !== opts.currentSlug) registryDependencies.add(slug)
        continue
      }

      // Composable alias: @/composables/<slug>/...
      if (mod.startsWith('@/composables/')) {
        const slug = extractRegistrySlug(mod, '@/composables/')
        if (slug && slug !== opts.currentSlug) registryDependencies.add(slug)
        continue
      }
    }
  }

  return { dependencies, devDependencies, registryDependencies }
}

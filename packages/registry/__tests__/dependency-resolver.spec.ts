import { describe, it, expect } from 'vitest'
import {
  buildTypesDevDepsMap,
  getBasePackageName,
  parseImportSpecifiers,
  resolveFile,
} from '../src/dependency-resolver'
import type { ResolveDepsOptions } from '../src/dependency-resolver'

// ---------------------------------------------------------------------------
// Shared test fixtures
// ---------------------------------------------------------------------------

const baseOpts: ResolveDepsOptions = {
  allowedDeps: new Set([
    'reka-ui',
    'class-variance-authority',
    'lucide-vue-next',
    'libphonenumber-js',
  ]),
  allowedDevDeps: new Set(['@types/libphonenumber-js']),
  typesDevDepsMap: new Map([['libphonenumber-js', ['@types/libphonenumber-js']]]),
  componentDir: 'ui',
  currentSlug: undefined,
  skipInternalRegistryDeps: false,
}

// ---------------------------------------------------------------------------
// parseImportSpecifiers
// ---------------------------------------------------------------------------

describe('parseImportSpecifiers', () => {
  it('extracts specifiers from standard import statements', () => {
    const code = `
import { ref } from 'vue'
import { cva } from 'class-variance-authority'
import type { Ref } from 'vue'
`
    const result = parseImportSpecifiers(code)
    expect(result).toContain('vue')
    expect(result).toContain('class-variance-authority')
  })

  it('extracts specifiers from export ... from statements', () => {
    const code = `export { Button } from './Button'`
    const result = parseImportSpecifiers(code)
    expect(result).toContain('./Button')
  })

  it('extracts specifiers from side-effect imports', () => {
    const code = `
import 'package/styles.css'
import "other-package/dist/index.css"
`
    const result = parseImportSpecifiers(code)
    expect(result).toContain('package/styles.css')
    expect(result).toContain('other-package/dist/index.css')
  })

  it('deduplicates repeated specifiers', () => {
    const code = `
import { ref } from 'vue'
import { computed } from 'vue'
`
    const result = parseImportSpecifiers(code)
    expect(result.filter(s => s === 'vue').length).toBe(1)
  })

  it('returns empty array for code with no imports', () => {
    const code = `const x = 42\nexport default x`
    expect(parseImportSpecifiers(code)).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// getBasePackageName
// ---------------------------------------------------------------------------

describe('getBasePackageName', () => {
  it('returns unscoped package name', () => {
    expect(getBasePackageName('vue')).toBe('vue')
    expect(getBasePackageName('class-variance-authority')).toBe('class-variance-authority')
  })

  it('returns scoped package name', () => {
    expect(getBasePackageName('@vueuse/core')).toBe('@vueuse/core')
    expect(getBasePackageName('@vueuse/core/something')).toBe('@vueuse/core')
  })

  it('handles deep subpath imports', () => {
    expect(getBasePackageName('lucide-vue-next/icons/ArrowRight')).toBe('lucide-vue-next')
  })
})

// ---------------------------------------------------------------------------
// buildTypesDevDepsMap
// ---------------------------------------------------------------------------

describe('buildTypesDevDepsMap', () => {
  it('maps a runtime package to its @types/ package', () => {
    const map = buildTypesDevDepsMap(['@types/libphonenumber-js', '@types/node'])
    expect(map.get('libphonenumber-js')).toEqual(['@types/libphonenumber-js'])
    expect(map.get('node')).toEqual(['@types/node'])
  })

  it('handles scoped @types/ packages with __ separator', () => {
    const map = buildTypesDevDepsMap(['@types/babel__core'])
    expect(map.get('@babel/core')).toEqual(['@types/babel__core'])
  })

  it('ignores non-@types/ entries', () => {
    const map = buildTypesDevDepsMap(['typescript', 'vitest'])
    expect(map.size).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// resolveFile — plain TypeScript file
// ---------------------------------------------------------------------------

describe('resolveFile — plain .ts file', () => {
  it('classifies npm dependencies', () => {
    const content = `
import { ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { cva } from 'class-variance-authority'
`
    const opts: ResolveDepsOptions = {
      ...baseOpts,
      allowedDeps: new Set(['class-variance-authority']),
    }
    const result = resolveFile(content, 'use-counter.ts', opts)
    expect(result.dependencies.has('class-variance-authority')).toBe(true)
    // vue is not in allowedDeps
    expect(result.dependencies.has('vue')).toBe(false)
  })

  it('classifies npm dependencies from side-effect bare imports', () => {
    const content = `import 'libphonenumber-js/bundle.css'`
    const result = resolveFile(content, 'Component.ts', baseOpts)
    expect(result.dependencies.has('libphonenumber-js')).toBe(true)
  })

  it('matches subpath imports to allowedDevDeps base package name', () => {
    const content = `
import 'vite/client'
import type { UserConfig } from 'vite/config'
`
    const opts: ResolveDepsOptions = {
      ...baseOpts,
      allowedDevDeps: new Set(['vite']),
    }
    const result = resolveFile(content, 'vite.config.ts', opts)
    expect(result.devDependencies.has('vite')).toBe(true)
  })

  it('auto-includes @types/ package for a matched npm dep', () => {
    const content = `import { parsePhoneNumber } from 'libphonenumber-js'`
    const result = resolveFile(content, 'PhoneInput.ts', baseOpts)
    expect(result.dependencies.has('libphonenumber-js')).toBe(true)
    expect(result.devDependencies.has('@types/libphonenumber-js')).toBe(true)
  })

  it('classifies @/hooks/ path as registryDependency', () => {
    const content = `import { useCounter } from '@/hooks/use-counter'`
    const result = resolveFile(content, 'some-component.ts', baseOpts)
    expect(result.registryDependencies.has('use-counter')).toBe(true)
  })

  it('classifies @/composables/ path as registryDependency', () => {
    const content = `import { useX } from '@/composables/use-x'`
    const result = resolveFile(content, 'some-component.ts', baseOpts)
    expect(result.registryDependencies.has('use-x')).toBe(true)
  })

  it('classifies @/components/ui/<slug> as registryDependency', () => {
    const content = `import Button from '@/components/ui/button/Button.vue'`
    const result = resolveFile(content, 'some-component.ts', baseOpts)
    expect(result.registryDependencies.has('button')).toBe(true)
  })

  it('skips self-referencing slug in registryDependencies', () => {
    const content = `import Button from '@/components/ui/button/Button.vue'`
    const result = resolveFile(content, 'button/Button.vue', { ...baseOpts, currentSlug: 'button' })
    expect(result.registryDependencies.has('button')).toBe(false)
  })

  it('skips relative ./  imports', () => {
    const content = `import { helper } from './utils'`
    const result = resolveFile(content, 'button/Button.ts', baseOpts)
    expect(result.registryDependencies.size).toBe(0)
    expect(result.dependencies.size).toBe(0)
  })

  it('returns empty result for file with no imports', () => {
    const result = resolveFile('const x = 42', 'no-imports.ts', baseOpts)
    expect(result.dependencies.size).toBe(0)
    expect(result.devDependencies.size).toBe(0)
    expect(result.registryDependencies.size).toBe(0)
  })

  it('skips hooks/composables registryDeps when skipInternalRegistryDeps is true, but keeps @/components/ui/ deps', () => {
    const content = `
import { useCounter } from '@/hooks/use-counter'
import Button from '@/components/ui/button/Button.vue'
import { cva } from 'class-variance-authority'
`
    const opts: ResolveDepsOptions = {
      ...baseOpts,
      allowedDeps: new Set(['class-variance-authority']),
      skipInternalRegistryDeps: true,
    }
    const result = resolveFile(content, 'some.ts', opts)
    // hooks are skipped
    expect(result.registryDependencies.has('use-counter')).toBe(false)
    // @/components/ui/ is always kept (may be an external shadcn-vue dep)
    expect(result.registryDependencies.has('button')).toBe(true)
    expect(result.dependencies.has('class-variance-authority')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// resolveFile — Vue SFC
// ---------------------------------------------------------------------------

describe('resolveFile — Vue SFC (.vue)', () => {
  it('extracts imports from <script setup>', () => {
    const content = `
<template><div /></template>
<script setup lang="ts">
import { ref } from 'vue'
import { cva } from 'class-variance-authority'
import { Primitive } from 'reka-ui'
</script>
`
    const opts: ResolveDepsOptions = {
      ...baseOpts,
      allowedDeps: new Set(['class-variance-authority', 'reka-ui']),
    }
    const result = resolveFile(content, 'Button.vue', opts)
    expect(result.dependencies.has('class-variance-authority')).toBe(true)
    expect(result.dependencies.has('reka-ui')).toBe(true)
  })

  it('classifies internal component imports from SFC', () => {
    const content = `
<template><div /></template>
<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
</script>
`
    const result = resolveFile(content, 'Card.vue', baseOpts)
    expect(result.registryDependencies.has('button')).toBe(true)
  })

  it('handles SFCs with only <script> (no setup)', () => {
    const content = `
<template><div /></template>
<script lang="ts">
import { defineComponent } from 'vue'
import { lucide } from 'lucide-vue-next'
export default defineComponent({})
</script>
`
    const opts: ResolveDepsOptions = {
      ...baseOpts,
      allowedDeps: new Set(['lucide-vue-next']),
    }
    const result = resolveFile(content, 'Icon.vue', opts)
    expect(result.dependencies.has('lucide-vue-next')).toBe(true)
  })
})

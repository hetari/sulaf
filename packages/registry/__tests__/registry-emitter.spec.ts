import { describe, it, expect } from 'vitest'
import { emitRegistry, bundleAll } from '../src/registry-emitter'
import type { EmitRegistryConfig, ResolvedComponentDeps } from '../src/registry-emitter'
import type { CollectedFile, ExampleFile } from '../src/types'

// ---------------------------------------------------------------------------
// In-memory test data helpers
// ---------------------------------------------------------------------------

function makeCollectedFile(overrides: Partial<CollectedFile> = {}): CollectedFile {
  return {
    path: 'button/Button.vue',
    content: '<template><button /></template>\n<script setup lang="ts">\n</script>',
    type: 'registry:ui',
    slug: 'button',
    srcDir: 'components',
    ...overrides,
  }
}

function makeExampleFile(overrides: Partial<ExampleFile> = {}): ExampleFile {
  return {
    path: 'examples/ButtonDemo.vue',
    content: '<template><Button /></template>',
    type: 'registry:block',
    ...overrides,
  }
}

function makeResolvedDeps(overrides: Partial<ResolvedComponentDeps> = {}): ResolvedComponentDeps {
  return {
    dependencies: new Set(),
    devDependencies: new Set(),
    registryDependencies: new Set(),
    ...overrides,
  }
}

const cfg: EmitRegistryConfig = { registryName: 'sulaf' }

// ---------------------------------------------------------------------------
// emitRegistry — basic JSON structure
// ---------------------------------------------------------------------------

describe('emitRegistry — JSON structure', () => {
  it('emits one item per slug', () => {
    const components = new Map<string, CollectedFile[]>([['button', [makeCollectedFile()]]])
    const resolvedDeps = new Map([['button', makeResolvedDeps()]])
    const result = emitRegistry(components, [], resolvedDeps, cfg)

    expect(result).toHaveLength(1)
    expect(result[0].path).toBe('button.json')
  })

  it('serialized JSON contains expected top-level fields', () => {
    const components = new Map<string, CollectedFile[]>([['button', [makeCollectedFile()]]])
    const resolvedDeps = new Map([
      ['button', makeResolvedDeps({ dependencies: new Set(['reka-ui']) })],
    ])
    const result = emitRegistry(components, [], resolvedDeps, cfg)

    const parsed = JSON.parse(result[0].content)
    expect(parsed.name).toBe('button')
    expect(parsed.type).toBe('registry:ui')
    expect(parsed.title).toBe('Button')
    expect(parsed.$schema).toContain('shadcn-vue')
    expect(parsed.dependencies).toContain('reka-ui')
    expect(Array.isArray(parsed.files)).toBe(true)
    expect(parsed.files.length).toBe(1)
    expect(parsed.files[0].content).toBeDefined()
  })

  it('derives title via toTitle (kebab to title case)', () => {
    const components = new Map<string, CollectedFile[]>([
      [
        'phone-input',
        [
          makeCollectedFile({
            slug: 'phone-input',
            path: 'phone-input/PhoneInput.vue',
            type: 'registry:component',
          }),
        ],
      ],
    ])
    const resolvedDeps = new Map([['phone-input', makeResolvedDeps()]])
    const result = emitRegistry(components, [], resolvedDeps, cfg)
    const parsed = JSON.parse(result[0].content)
    expect(parsed.title).toBe('Phone Input')
  })

  it('prefers registry:ui type over registry:hook over registry:component', () => {
    const components = new Map<string, CollectedFile[]>([
      [
        'mixed',
        [
          makeCollectedFile({ slug: 'mixed', path: 'mixed/a.ts', type: 'registry:component' }),
          makeCollectedFile({ slug: 'mixed', path: 'mixed/b.ts', type: 'registry:ui' }),
        ],
      ],
    ])
    const resolvedDeps = new Map([['mixed', makeResolvedDeps()]])
    const result = emitRegistry(components, [], resolvedDeps, cfg)
    const parsed = JSON.parse(result[0].content)
    expect(parsed.type).toBe('registry:ui')
  })
})

// ---------------------------------------------------------------------------
// emitRegistry — hook bundling
// ---------------------------------------------------------------------------

describe('emitRegistry — hook bundling', () => {
  it('inlines hook files into consuming component and removes from registryDependencies', () => {
    const hookFile = makeCollectedFile({
      slug: 'use-counter',
      path: 'use-counter.ts',
      type: 'registry:hook',
      srcDir: 'hooks',
    })
    const buttonFile = makeCollectedFile()

    const components = new Map<string, CollectedFile[]>([
      ['button', [buttonFile]],
      ['use-counter', [hookFile]],
    ])

    const resolvedDeps = new Map<string, ResolvedComponentDeps>([
      ['button', makeResolvedDeps({ registryDependencies: new Set(['use-counter']) })],
      ['use-counter', makeResolvedDeps()],
    ])

    const result = emitRegistry(components, [], resolvedDeps, cfg)
    const buttonItem = result.find(r => r.path === 'button.json')!
    const parsed = JSON.parse(buttonItem.content)

    // Hook file is inlined
    expect(parsed.files.some((f: { path: string }) => f.path === 'use-counter.ts')).toBe(true)
    // Hook is NOT in registryDependencies
    expect(parsed.registryDependencies).not.toContain('use-counter')
  })

  it('keeps non-hook registry dependencies in registryDependencies', () => {
    const cardFile = makeCollectedFile({ slug: 'card', path: 'card/Card.vue', type: 'registry:ui' })
    const buttonFile = makeCollectedFile()

    const components = new Map<string, CollectedFile[]>([
      ['button', [buttonFile]],
      ['card', [cardFile]],
    ])

    const resolvedDeps = new Map<string, ResolvedComponentDeps>([
      ['button', makeResolvedDeps({ registryDependencies: new Set(['card']) })],
      ['card', makeResolvedDeps()],
    ])

    const result = emitRegistry(components, [], resolvedDeps, cfg)
    const buttonItem = result.find(r => r.path === 'button.json')!
    const parsed = JSON.parse(buttonItem.content)
    expect(parsed.registryDependencies).toContain('card')
  })
})

// ---------------------------------------------------------------------------
// emitRegistry — example items
// ---------------------------------------------------------------------------

describe('emitRegistry — example items', () => {
  it('emits one item per example under examples/ path', () => {
    const example = makeExampleFile()
    const resolvedDeps = new Map([['example-ButtonDemo', makeResolvedDeps()]])
    const result = emitRegistry(new Map(), [example], resolvedDeps, cfg)
    expect(result).toHaveLength(1)
    expect(result[0].path).toBe('examples/ButtonDemo.json')
  })

  it('emitted example has registry:block type', () => {
    const example = makeExampleFile()
    const resolvedDeps = new Map([['example-ButtonDemo', makeResolvedDeps()]])
    const result = emitRegistry(new Map(), [example], resolvedDeps, cfg)
    const parsed = JSON.parse(result[0].content)
    expect(parsed.type).toBe('registry:block')
    expect(parsed.name).toBe('example-ButtonDemo')
  })
})

// ---------------------------------------------------------------------------
// bundleAll
// ---------------------------------------------------------------------------

describe('bundleAll', () => {
  it('produces all.json with merged files from component items', () => {
    const buttonJson = {
      name: 'button',
      type: 'registry:ui',
      title: 'Button',
      description: '',
      $schema: 'https://shadcn-vue.com/schema/registry-item.json',
      files: [{ path: 'button/Button.vue', type: 'registry:ui', content: '<template />' }],
      dependencies: ['reka-ui'],
      devDependencies: [],
      registryDependencies: [],
    }
    const componentItems = [{ path: 'button.json', content: JSON.stringify(buttonJson) }]
    const allDeps = {
      dependencies: new Set(['reka-ui']),
      devDependencies: new Set<string>(),
      registryDependencies: new Set<string>(),
    }

    const result = bundleAll(componentItems, allDeps, cfg)
    expect(result).not.toBeNull()
    expect(result!.path).toBe('all.json')

    const parsed = JSON.parse(result!.content)
    expect(parsed.name).toBe('all')
    expect(parsed.type).toBe('registry:ui')
    expect(parsed.dependencies).toContain('reka-ui')
    expect(parsed.files.some((f: { path: string }) => f.path === 'button/Button.vue')).toBe(true)
  })

  it('deduplicates files that appear in multiple component items', () => {
    const sharedFile = { path: 'shared/Shared.vue', type: 'registry:ui', content: '' }
    const makeItem = (name: string) => ({
      name,
      type: 'registry:ui',
      title: name,
      description: '',
      $schema: 'https://shadcn-vue.com/schema/registry-item.json',
      files: [sharedFile],
      dependencies: [],
      devDependencies: [],
      registryDependencies: [],
    })

    const componentItems = [
      { path: 'a.json', content: JSON.stringify(makeItem('a')) },
      { path: 'b.json', content: JSON.stringify(makeItem('b')) },
    ]
    const allDeps = {
      dependencies: new Set<string>(),
      devDependencies: new Set<string>(),
      registryDependencies: new Set<string>(),
    }
    const result = bundleAll(componentItems, allDeps, cfg)!
    const parsed = JSON.parse(result.content)
    const sharedFiles = parsed.files.filter((f: { path: string }) => f.path === 'shared/Shared.vue')
    expect(sharedFiles.length).toBe(1)
  })

  it('sets registryDependencies to empty array (all slugs are in-bundle)', () => {
    const buttonJson = {
      name: 'button',
      type: 'registry:ui',
      title: 'Button',
      description: '',
      $schema: 'https://shadcn-vue.com/schema/registry-item.json',
      files: [{ path: 'button/Button.vue', type: 'registry:ui', content: '' }],
      dependencies: [],
      devDependencies: [],
      registryDependencies: ['card'],
    }
    const componentItems = [{ path: 'button.json', content: JSON.stringify(buttonJson) }]
    const allDeps = {
      dependencies: new Set<string>(),
      devDependencies: new Set<string>(),
      registryDependencies: new Set<string>(),
    }
    const result = bundleAll(componentItems, allDeps, cfg)!
    const parsed = JSON.parse(result.content)
    // When no external registryDeps are present, the array is empty.
    expect(parsed.registryDependencies).toEqual([])
  })
})

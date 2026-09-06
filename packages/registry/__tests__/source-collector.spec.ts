import { describe, it, expect } from 'vitest'
import { resolve } from 'node:path'
import { collectSources } from '../src/source-collector'
import type { SourceCollectorConfig } from '../src/source-collector'

const FIXTURES_DIR = resolve(__dirname, 'fixtures')

const baseConfig: SourceCollectorConfig = {
  srcDirs: ['components', 'hooks'],
  replacements: [],
}

describe('collectSources', () => {
  describe('component grouping', () => {
    it('groups files under the same slug', async () => {
      const { components } = await collectSources(FIXTURES_DIR, baseConfig)
      expect(components.has('button')).toBe(true)
      const files = components.get('button')!
      expect(files.length).toBeGreaterThanOrEqual(1)
      expect(files.every(f => f.slug === 'button')).toBe(true)
    })

    it('assigns registry:ui type for files in components/ dir', async () => {
      const { components } = await collectSources(FIXTURES_DIR, baseConfig)
      const buttonFiles = components.get('button')!
      expect(buttonFiles.every(f => f.type === 'registry:ui')).toBe(true)
    })

    it('assigns registry:hook type for files in hooks/ dir', async () => {
      const { components } = await collectSources(FIXTURES_DIR, baseConfig)
      expect(components.has('use-counter')).toBe(true)
      const hookFiles = components.get('use-counter')!
      expect(hookFiles.every(f => f.type === 'registry:hook')).toBe(true)
    })
  })

  describe('hook path flattening', () => {
    it('flattens single-file hook use-single/index.ts to use-single.ts', async () => {
      const { components } = await collectSources(FIXTURES_DIR, baseConfig)
      const singleFiles = components.get('use-single')!
      expect(singleFiles.some(f => f.path === 'use-single.ts')).toBe(true)
    })

    it('preserves directory structure for multi-file hook use-counter', async () => {
      const { components } = await collectSources(FIXTURES_DIR, baseConfig)
      const hookFiles = components.get('use-counter')!
      expect(hookFiles.some(f => f.path === 'use-counter/index.ts')).toBe(true)
      expect(hookFiles.some(f => f.path === 'use-counter/utils.ts')).toBe(true)
    })
  })

  describe('alias replacements', () => {
    it('applies regex replacements to file content', async () => {
      const config: SourceCollectorConfig = {
        srcDirs: ['components'],
        replacements: [{ from: /reka-ui/g, to: '@REPLACED' }],
      }
      const { components } = await collectSources(FIXTURES_DIR, config)
      const buttonFiles = components.get('button')!
      const mainFile = buttonFiles.find(f => f.path.endsWith('.vue'))!
      expect(mainFile.content).toContain('@REPLACED')
      expect(mainFile.content).not.toContain('reka-ui')
    })

    it('replaces every occurrence when from is a string', async () => {
      const config: SourceCollectorConfig = {
        srcDirs: ['components'],
        replacements: [{ from: 'default', to: '@REPLACED' }],
      }
      const { components } = await collectSources(FIXTURES_DIR, config)
      const buttonFiles = components.get('button')!
      const mainFile = buttonFiles.find(f => f.path.endsWith('.vue'))!
      expect(mainFile.content).not.toContain('default')
      const occurrences = (mainFile.content.match(/@REPLACED/g) || []).length
      expect(occurrences).toBeGreaterThanOrEqual(2)
    })

    it('does not mutate content when no replacements match', async () => {
      const config: SourceCollectorConfig = {
        srcDirs: ['components'],
        replacements: [{ from: /NOMATCH/g, to: 'REPLACED' }],
      }
      const { components } = await collectSources(FIXTURES_DIR, config)
      const buttonFiles = components.get('button')!
      const mainFile = buttonFiles.find(f => f.path.endsWith('.vue'))!
      expect(mainFile.content).not.toContain('REPLACED')
    })
  })

  describe('examples collection', () => {
    it('collects .vue files from examples/ directory', async () => {
      const { examples } = await collectSources(FIXTURES_DIR, baseConfig)
      expect(examples.length).toBeGreaterThanOrEqual(1)
      expect(examples.some(e => e.path === 'examples/CardDemo.vue')).toBe(true)
    })

    it('assigns registry:block type to example files', async () => {
      const { examples } = await collectSources(FIXTURES_DIR, baseConfig)
      expect(examples.every(e => e.type === 'registry:block')).toBe(true)
    })
  })

  describe('missing directories', () => {
    it('returns empty components map when srcDir does not exist', async () => {
      const config: SourceCollectorConfig = {
        srcDirs: ['nonexistent-dir'],
        replacements: [],
      }
      const { components } = await collectSources(FIXTURES_DIR, config)
      // components should be empty; examples are always collected from rootDir/examples/
      // regardless of srcDirs, so we only assert on components here.
      expect(components.size).toBe(0)
    })
  })

  describe('CollectedFile metadata', () => {
    it('carries correct srcDir value', async () => {
      const { components } = await collectSources(FIXTURES_DIR, baseConfig)
      const buttonFiles = components.get('button')!
      expect(buttonFiles.every(f => f.srcDir === 'components')).toBe(true)
      const hookFiles = components.get('use-counter')!
      expect(hookFiles.every(f => f.srcDir === 'hooks')).toBe(true)
    })

    it('stores file content as a non-empty string', async () => {
      const { components } = await collectSources(FIXTURES_DIR, baseConfig)
      const buttonFiles = components.get('button')!
      expect(buttonFiles.every(f => f.content.length > 0)).toBe(true)
    })
  })
})

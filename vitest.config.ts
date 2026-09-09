import { defineConfig } from 'vitest/config'

export default defineConfig({
  cacheDir: 'node_modules/.cache/vitest',
  test: {
    globals: true,
    pool: 'threads',
    projects: ['packages/*', 'scripts'],
    reporters: ['default'],
    experimental: {
      fsModuleCache: true,
    },
  },
})

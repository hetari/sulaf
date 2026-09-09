import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'cli',
    environment: 'node',
    globals: true,
    isolate: false,
  },
})

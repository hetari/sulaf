import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    dedupe: ['vue', 'reka-ui', '@vueuse/core'],
    alias: [
      {
        find: '@sulaf/ui/components/ui',
        replacement: resolve(import.meta.dirname, '../ui/src/components/ui'),
      },
      { find: '@/hooks', replacement: resolve(import.meta.dirname, './hooks') },
      {
        find: '@sulaf/ui/components',
        replacement: resolve(import.meta.dirname, '../ui/src/components/ui'),
      },
      { find: '@sulaf/ui/lib', replacement: resolve(import.meta.dirname, '../ui/src/lib') },
      { find: '@sulaf/ui', replacement: resolve(import.meta.dirname, '../ui/src') },
      { find: '@', replacement: resolve(import.meta.dirname, '../ui/src') },
    ],
  },
  test: {
    name: 'registry',
    environment: 'happy-dom',
    globals: true,
  },
})

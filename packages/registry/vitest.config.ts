import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@sulaf/ui/components/ui',
        replacement: resolve(__dirname, '../ui/src/components/ui'),
      },
      { find: '@/hooks', replacement: resolve(__dirname, './hooks') },
      { find: '@sulaf/ui/components', replacement: resolve(__dirname, '../ui/src/components/ui') },
      { find: '@sulaf/ui/lib', replacement: resolve(__dirname, '../ui/src/lib') },
      { find: '@sulaf/ui', replacement: resolve(__dirname, '../ui/src') },
      { find: '@', replacement: resolve(__dirname, '../ui/src') },
    ],
  },
  test: {
    name: 'registry',
    environment: 'happy-dom',
    globals: true,
  },
})

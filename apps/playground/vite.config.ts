import tailwindcss from '@tailwindcss/vite'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'node:path'
import VueRouter from 'vue-router/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [VueRouter(), vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@/lib/utils': path.resolve(__dirname, '../../packages/ui/src/lib/utils.ts'),
      '@/components/ui': path.resolve(__dirname, '../../packages/ui/src/components/ui'),
      '@': path.resolve(__dirname, './src'),
    },
  },
})

import { defineConfig, type Plugin } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  // plugin-vue resolves vite 8 (nuxt) types; vitest 2 runs on vite 5 — same runtime API, cast for typecheck
  plugins: [vue() as Plugin],
  test: {
    environment: 'happy-dom'
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '@': fileURLToPath(new URL('./', import.meta.url))
    }
  }
})

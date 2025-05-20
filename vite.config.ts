/// <reference types="vitest/config" />

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'pathe'

export default defineConfig({
  plugins: [
    vue({
      isProduction: false,
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('Plot'),
        },
      },
    }),
    dts({
      insertTypesEntry: true,
    }),
  ],
  // @ts-ignore
  test: {
    environment: 'happy-dom',
    reporters: ['verbose'],
    globals: true,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'vue-plot',
      fileName: 'vue-plot',
    },
    watch: {
      include: [resolve(__dirname, 'src')],
    },
    copyPublicDir: false,
    rollupOptions: {
      external: ['vue', '@observablehq/plot'],
      output: {
        exports: 'named',
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          'vue': 'Vue',
          '@observablehq/plot': 'Plot',
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['vue', '@observablehq/plot'],
  },
})
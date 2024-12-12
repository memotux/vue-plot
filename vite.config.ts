/// <reference types="vitest/config" />

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { plotCustomElement } from "./src/core";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    ...plotCustomElement
  })],
  test: {
    environment: 'happy-dom'
  }
})

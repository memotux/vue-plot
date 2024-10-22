import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  // 'tests/*/vitest.config.{e2e,dom}.ts',
  {
    extends: './vite.config.ts',
    test: {
      include: ['tests/*.dom.test.ts'],
      name: 'dom',
      environment: 'happy-dom'
    },
  },
  {
    extends: './vite.config.ts',
    test: {
      include: ['tests/*.e2e.test.ts'],
      name: 'e2e',
      browser: {
        enabled: true,
        name: 'firefox',
        provider: 'playwright',
      },
    },
    server: {
      fs: {
        strict: false,
      },
    },
  }
])
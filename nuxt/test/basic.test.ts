import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { resolve } from 'pathe'

describe('ssr', async () => {
  await setup({
    rootDir: resolve(__dirname, './fixtures/basic'),
  })

  it('renders the index page with VPlot', async () => {
    const html = await $fetch('/')
    expect(html).toContain('data-plot-id')
    expect(html).toContain('PlotBarY')
  })
})

import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { resolve } from 'pathe'

describe('ssr', async () => {
  await setup({
    rootDir: resolve(__dirname, './fixtures/basic'),
  })

  it('renders the index page with VPlot', async () => {
    const html = await $fetch('/')
    // SSR wrapper div has data-plot-id attribute with a value
    expect(html).toMatch(/<div[^>]*data-plot-id="[^"]*"/)
    // PlotBarY custom element tag is present
    expect(html).toMatch(/<PlotBarY[^>]*>/)
    // Props rendered as attributes on the custom element
    expect(html).toContain('x="name"')
    expect(html).toContain('y="value"')
  })
})

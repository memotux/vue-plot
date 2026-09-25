import { describe, it, expect } from 'vitest'
import { setup, createPage } from '@nuxt/test-utils/e2e'
import { resolve } from 'pathe'

// Client half of the `<ClientOnly>` contract for VPlot.
//
// The server half lives in clientonly.test.ts (`$fetch` only sees the SSR
// payload: the placeholder span, no chart markup). Here a real browser loads
// the page, hydrates, and the ClientOnly placeholder is swapped for the slot,
// after which the custom renderer mounts the plot as an SVG. There is one
// `setup()` per test file, hence the dedicated fixture reuse.
describe('ssr client-only (browser)', async () => {
  await setup({
    rootDir: resolve(__dirname, './fixtures/clientonly'),
    browser: true,
  })

  it('renders the chart inside ClientOnly after hydration', async () => {
    // createPage navigates and waits for Nuxt hydration to finish.
    const page = await createPage('/')

    // The page itself rendered.
    expect(await page.locator('#page-marker').count()).toBe(1)

    // The ClientOnly placeholder was swapped for the slot: the VPlot
    // container is mounted and Observable Plot rendered its SVG.
    expect(await page.locator('[data-plot-id]').count()).toBe(1)
    expect(await page.locator('svg').count()).toBeGreaterThan(0)
  })
})

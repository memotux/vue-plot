import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { resolve } from 'pathe'

// Server half of the `<ClientOnly>` contract for VPlot.
//
// `$fetch('/')` only ever sees the SSR payload, so the observable behaviour here
// is Nuxt's server placeholder for the ClientOnly boundary: an empty `<span>`,
// with no plot wrapper and no Plot mark custom element inside it. Hydration is
// out of scope: once the client mounts, Nuxt swaps the placeholder for the
// slot and the chart renders, which needs a browser environment this file does
// not provide. There is one `setup()` per test file, hence the dedicated
// fixture.
describe('ssr client-only', async () => {
  await setup({
    rootDir: resolve(__dirname, './fixtures/clientonly'),
  })

  it('emits no chart markup on the server inside ClientOnly', async () => {
    const html = await $fetch('/')

    // The page itself rendered. Without this the negative assertions below
    // would pass even if the app failed to render anything at all.
    expect(html).toContain('<p id="page-marker">')

    // ClientOnly keeps its slot out of the server payload.
    expect(html).not.toContain('data-plot-id')
    expect(html).not.toMatch(/<PlotBarY[\s>]/)
  })
})

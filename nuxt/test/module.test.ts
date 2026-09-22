import type { Nuxt } from '@nuxt/schema'
import { runWithNuxtContext } from '@nuxt/kit'
import { plotCustomElement } from '@memotux/vue-plot'
import { describe, expect, it } from 'vitest'
import mod from '../src/module'

type CustomElementMatcher = (tag: string) => boolean | undefined

interface FakeNuxtOptions {
  isCustomElement?: CustomElementMatcher
  vite?: { optimizeDeps?: { include?: string[] } }
}

interface FakeNuxt {
  /** The fake instance handed to the module as its `nuxt` argument. */
  nuxt: Nuxt
  /** The same object, typed so tests can inspect the mutated options. */
  options: {
    vue: { compilerOptions: { isCustomElement?: CustomElementMatcher } }
    vite: { optimizeDeps?: { include?: string[] } }
    components: unknown[]
    _requiredModules: Record<string, boolean>
  }
  /** Hooks registered by the module through `nuxt.hook`. */
  hooks: Map<string, ((...args: unknown[]) => void)[]>
}

function createFakeNuxt({ isCustomElement, vite = {} }: FakeNuxtOptions = {}): FakeNuxt {
  const hooks = new Map<string, ((...args: unknown[]) => void)[]>()
  const options = {
    vue: { compilerOptions: { isCustomElement } },
    vite,
    components: [] as unknown[],
    _requiredModules: {} as Record<string, boolean>,
  }
  const nuxt = {
    options,
    hook: (name: string, handler: (...args: unknown[]) => void) => {
      const handlers = hooks.get(name) ?? []
      handlers.push(handler)
      hooks.set(name, handlers)
    },
  }

  // The module only touches `options` and `hook`; the cast keeps the fake minimal.
  return { nuxt: nuxt as unknown as Nuxt, options, hooks }
}

/**
 * Invoke the module the way Nuxt does. `defineNuxtModule` returns a callable
 * normalized module (there is no public `.setup`), and `addComponent` requires
 * an active Nuxt context, hence `runWithNuxtContext`.
 */
async function runSetup(fakeNuxt: FakeNuxt): Promise<unknown> {
  return await runWithNuxtContext(fakeNuxt.nuxt, () => mod({}, fakeNuxt.nuxt))
}

function collectComponents(fakeNuxt: FakeNuxt): Record<string, unknown>[] {
  const components: Record<string, unknown>[] = []
  for (const handler of fakeNuxt.hooks.get('components:extend') ?? []) {
    handler(components)
  }
  return components
}

describe('module meta', () => {
  it('exposes the expected module meta', async () => {
    await expect(mod.getMeta?.()).resolves.toMatchObject({
      name: '@memotux/nuxt-vue-plot',
      // @nuxt/kit defaults configKey to the module name (`module.meta.configKey ||= module.meta.name`).
      configKey: '@memotux/nuxt-vue-plot',
    })
  })
})

describe('isCustomElement', () => {
  it('treats Plot tags as custom elements and other tags as regular elements', async () => {
    const fakeNuxt = createFakeNuxt()
    await runSetup(fakeNuxt)

    const isCustomElement = fakeNuxt.options.vue.compilerOptions.isCustomElement
    const plotMatcher = plotCustomElement.template.compilerOptions.isCustomElement

    expect(typeof isCustomElement).toBe('function')
    expect(isCustomElement?.('PlotBarY')).toBe(true)
    expect(isCustomElement?.('div')).toBe(false)
    // Semantics come from the library's plot custom element matcher.
    expect(isCustomElement?.('PlotBarY')).toBe(plotMatcher('PlotBarY'))
    expect(isCustomElement?.('div')).toBe(plotMatcher('div'))
  })

  it('preserves and chains a previously configured isCustomElement hook', async () => {
    const consulted: string[] = []
    const previous = (tag: string) => {
      consulted.push(tag)
      // `undefined` means "not mine", so the Plot matcher still gets a say.
      return tag === 'MyWidget' ? true : undefined
    }
    const fakeNuxt = createFakeNuxt({ isCustomElement: previous })
    await runSetup(fakeNuxt)

    const isCustomElement = fakeNuxt.options.vue.compilerOptions.isCustomElement

    expect(isCustomElement).not.toBe(previous)
    // Previous hook verdict wins for tags it recognises.
    expect(isCustomElement?.('MyWidget')).toBe(true)
    // The composed hook still delegates to the Plot matcher.
    expect(isCustomElement?.('PlotBarY')).toBe(true)
    expect(isCustomElement?.('div')).toBe(false)
    expect(consulted).toEqual(['MyWidget', 'PlotBarY', 'div'])
  })

  it('lets a previous hook veto a Plot tag', async () => {
    const fakeNuxt = createFakeNuxt({ isCustomElement: () => false })
    await runSetup(fakeNuxt)

    const isCustomElement = fakeNuxt.options.vue.compilerOptions.isCustomElement

    expect(isCustomElement?.('PlotBarY')).toBe(false)
  })

  it('falls back to the Plot matcher when no hook was configured', async () => {
    const fakeNuxt = createFakeNuxt()
    expect(fakeNuxt.options.vue.compilerOptions.isCustomElement).toBeUndefined()

    await runSetup(fakeNuxt)

    expect(fakeNuxt.options.vue.compilerOptions.isCustomElement?.('PlotBarY')).toBe(true)
  })
})

describe('optimizeDeps', () => {
  it('initializes vite.optimizeDeps and its include when they are undefined', async () => {
    const fakeNuxt = createFakeNuxt({ vite: {} })
    await runSetup(fakeNuxt)

    expect(fakeNuxt.options.vite.optimizeDeps?.include).toEqual(['@observablehq/plot'])
  })

  it('initializes the include list when optimizeDeps exists without include', async () => {
    const fakeNuxt = createFakeNuxt({ vite: { optimizeDeps: {} } })
    await runSetup(fakeNuxt)

    expect(fakeNuxt.options.vite.optimizeDeps?.include).toEqual(['@observablehq/plot'])
  })

  it('keeps existing include entries', async () => {
    const fakeNuxt = createFakeNuxt({ vite: { optimizeDeps: { include: ['vue'] } } })
    await runSetup(fakeNuxt)

    expect(fakeNuxt.options.vite.optimizeDeps?.include).toEqual(['vue', '@observablehq/plot'])
  })

  it('does not push a duplicate when installed twice on the same nuxt object', async () => {
    const fakeNuxt = createFakeNuxt()
    await runSetup(fakeNuxt)

    // defineNuxtModule guards repeated installs through `_requiredModules` and
    // reports the skipped second install, so setup() is not entered again.
    const secondInstall = await runSetup(fakeNuxt)

    expect(secondInstall).toBe(false)
    expect(fakeNuxt.options.vite.optimizeDeps?.include).toEqual(['@observablehq/plot'])
  })
})

describe('components', () => {
  it('registers the VPlot component', async () => {
    const fakeNuxt = createFakeNuxt()
    await runSetup(fakeNuxt)

    expect(collectComponents(fakeNuxt)).toContainEqual(
      expect.objectContaining({
        name: 'VPlot',
        export: 'VPlot',
        filePath: '@memotux/vue-plot',
      }),
    )
  })
})

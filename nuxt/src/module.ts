import { defineNuxtModule, addComponent } from '@nuxt/kit'
import { plotCustomElement } from '@memotux/vue-plot'

export default defineNuxtModule({
  meta: {
    name: '@memotux/nuxt-vue-plot',
  },
  setup(_, nuxt) {
    const prevCustomElement = nuxt.options.vue.compilerOptions.isCustomElement
    const isPlotCustomElement
      = plotCustomElement.template.compilerOptions.isCustomElement
    // A previous hook can only *add* custom elements (its `true` wins);
    // a strict `false` must not veto this module's Plot tags, hence `||`
    // instead of `??` (which let a strict-false hook silently disable them).
    nuxt.options.vue.compilerOptions.isCustomElement = (tag: string) =>
      prevCustomElement?.(tag) || isPlotCustomElement(tag)

    nuxt.options.vite.optimizeDeps ??= {}
    nuxt.options.vite.optimizeDeps.include ??= []
    // Idempotent even if setup() is entered twice (defineNuxtModule's
    // _requiredModules boundary guard is the only protection otherwise).
    if (!nuxt.options.vite.optimizeDeps.include.includes('@observablehq/plot')) {
      nuxt.options.vite.optimizeDeps.include.push('@observablehq/plot')
    }

    addComponent({
      name: 'VPlot',
      export: 'VPlot',
      filePath: '@memotux/vue-plot',
    })
  },
})

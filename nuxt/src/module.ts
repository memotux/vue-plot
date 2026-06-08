import { defineNuxtModule, addComponent } from '@nuxt/kit'
import { plotCustomElement } from '@memotux/vue-plot'

export default defineNuxtModule({
  meta: {
    name: '@memotux/vue-plot-nuxt',
    configKey: 'plot',
  },
  defaults: {},
  setup(_, nuxt) {
    const prevCustomElement = nuxt.options.vue.compilerOptions.isCustomElement
    const isPlotCustomElement = plotCustomElement.template.compilerOptions.isCustomElement
    nuxt.options.vue.compilerOptions.isCustomElement = (tag: string) =>
      prevCustomElement?.(tag) || isPlotCustomElement(tag)

    nuxt.options.vite.optimizeDeps?.include?.push('@observablehq/plot')

    addComponent({
      name: 'VPlot',
      export: 'VPlot',
      filePath: '@memotux/vue-plot',
    })
  },
})

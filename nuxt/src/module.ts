import { defineNuxtModule, addComponent } from '@nuxt/kit'
import { plotCustomElement } from '@memotux/vue-plot'

export default defineNuxtModule({
  meta: {
    name: 'nuxt-vue-plot',
    configKey: 'plot',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_, nuxt) {
    nuxt.options.vue.compilerOptions.isCustomElement = plotCustomElement.template.compilerOptions.isCustomElement

    nuxt.options.vite.optimizeDeps?.include?.push(
      '@observablehq/plot',
      // '@memotux/vue-plot',
    )

    addComponent({
      name: 'VPlot',
      export: 'VPlot',
      filePath: '@memotux/vue-plot',
    })
  },
})

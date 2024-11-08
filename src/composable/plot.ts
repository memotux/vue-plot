import { plot, type PlotOptions } from '@observablehq/plot'
import { type Ref, onMounted, onUpdated, useTemplateRef } from 'vue'

/**
 * 
 * @param options { Ref<PlotOptions> } Vue ref PlotOptions
 * @param key { string } Template Ref key
 */
export function usePlot<E extends HTMLElement>(options: Ref<PlotOptions>, key: string) {

  const el = useTemplateRef<E>(key)

  const replace = () => {
    if (!el.value) return

    el.value.replaceChildren(plot(options.value))
  }

  onMounted(replace)
  onUpdated(replace)
}
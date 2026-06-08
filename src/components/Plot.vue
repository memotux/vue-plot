<script setup lang="ts">
import { h, onMounted, useSlots, useTemplateRef, useId, onUnmounted, ref, defineComponent, onBeforeUnmount } from 'vue'
import { getPlotApp } from '../core'
import type { PlotOptions } from '@observablehq/plot'

const props = withDefaults(defineProps<PlotOptions>(), {
  aspectRatio: null,
  figure: undefined,
  clip: undefined,
  clamp: undefined,
  nice: undefined,
  zero: undefined,
  round: undefined,
  axis: undefined,
  grid: undefined,
  labelArrow: undefined,
})
const slots = useSlots()
const id = useId()
const plotId = `__plot-${id}`

const plotContainer = useTemplateRef('plot-container')
const { render, addPlot, removePlot, pushActivePlotId, popActivePlotId } = getPlotApp()

/**
 * Reactive tick counter for Vite HMR support.
 *
 * The PlotInternal render function reads hmrTick.value, creating a reactive
 * dependency. When Vite fires vite:afterUpdate, the handler bumps hmrTick,
 * which forces the render function to re-evaluate with fresh slot content.
 */
const hmrTick = ref(0)

/**
 * Internal component for the custom renderer.
 *
 * Wrapped in defineComponent so Vue tracks reactive dependencies (hmrTick).
 * On HMR, hmrTick.value changes, the render function re-runs, and Vue diffs
 * the new VNode tree against the existing one — updating marks in place.
 */
const PlotInternal = defineComponent({
  setup() {
    return () => {
      // Reactive dep: forces re-render on vite:afterUpdate (HMR)
      // eslint-disable-next-line ts/no-unused-expressions
      hmrTick.value

      if (!slots.default && !Boolean(props.marks)) {
        console.warn('Please add Plot Marks in props or as children')
        return h('PlotRoot', null, [
          h('PlotFrame'),
          h('PlotText', {
            data: ['Please add Plot Marks in props or as children'],
            frameAnchor: 'middle',
          }),
        ])
      }

      return h('PlotRoot', props, slots)
    }
  },
})

onMounted(() => {
  if (plotContainer.value) {
    addPlot(plotContainer, plotId)
    pushActivePlotId(plotId)
    try {
      render(h(PlotInternal), plotContainer.value)
    } finally {
      popActivePlotId()
    }
  }
})

onUnmounted(() => {
  removePlot(plotId)
})

// HMR support: bump hmrTick on vite:afterUpdate to force re-render
if (import.meta.hot) {
  const handleHMR = () => { hmrTick.value++ }
  import.meta.hot.on('vite:afterUpdate', handleHMR)
  onBeforeUnmount(() => {
    import.meta.hot?.off?.('vite:afterUpdate', handleHMR)
  })
}
</script>

<template>
  <div
    ref="plot-container"
    :data-plot-id="plotId"
  >
    <slot> </slot>
  </div>
</template>

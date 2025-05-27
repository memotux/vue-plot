<script setup lang="ts">
import { h, onMounted, useSlots, useTemplateRef, createRenderer, useId } from 'vue'
import { nodeOps, createPlotContext } from '../core'
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

const plotContainer = useTemplateRef('plot-container')

const PlotInternal = () => {
  /**
   * [Vue warn]: Slot "default" invoked outside of the render function: this will not
   * track dependencies used in the slot. Invoke the slot function inside the render
   * function instead.
   */
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
  return h('PlotRoot', props, slots.default?.())
}

onMounted(() => {
  const ctx = createPlotContext(plotContainer.value)
  const { render } = createRenderer(nodeOps(ctx))
  render(h(PlotInternal), plotContainer.value)
})
</script>

<template>
  <div
    ref="plot-container"
    :id="`__plot-${id}`"
  >
    <slot> </slot>
  </div>
</template>

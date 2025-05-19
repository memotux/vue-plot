<script setup lang="ts">
import {
  h,
  onMounted,
  useSlots,
  useTemplateRef,
  createRenderer,
  defineComponent,
} from 'vue'
import { nodeOps } from '../core'
import type { PlotOptions } from '@observablehq/plot'
import { createPlotContext } from '../core/context'

const props = withDefaults(defineProps<PlotOptions>(), {
  aspectRatio: null,
})
const slots = useSlots()

const InternalComponent = defineComponent({
  setup() {
    const marks = slots.default?.()

    if (!marks && !Boolean(props.marks)) {
      console.warn('Please add Plot Marks in props or as children')
      return () =>
        h('PlotRoot', null, [
          h('PlotFrame'),
          h('PlotText', {
            data: ['Please add Plot Marks in props or as children'],
            frameAnchor: 'middle',
          }),
        ])
    }
    return () => h('PlotRoot', props, marks)
  },
})

const plotContainer = useTemplateRef('plot-container')

onMounted(() => {
  const ctx = createPlotContext(plotContainer.value)
  const { render } = createRenderer(nodeOps(ctx))
  render(h(InternalComponent), plotContainer.value)
})
</script>

<template>
  <div
    ref="plot-container"
    id="__plot"
  >
    <slot> </slot>
  </div>
</template>

<script setup lang="ts">
import {
  h,
  onMounted,
  useSlots,
  useTemplateRef,
  createRenderer,
  defineComponent,
} from 'vue'
import { nodeOps, createPlotContext } from '../core'
import type { PlotOptions } from '@observablehq/plot'

const props = withDefaults(defineProps<PlotOptions>(), {
  aspectRatio: null,
  figure: undefined,
})
const slots = useSlots()

const InternalComponent = defineComponent({
  setup() {
    /**
     * [Vue warn]: Slot "default" invoked outside of the render function: this will not
     * track dependencies used in the slot. Invoke the slot function inside the render
     * function instead.
     */
    if (!slots.default && !Boolean(props.marks)) {
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
    return () => h('PlotRoot', props, slots.default?.())
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

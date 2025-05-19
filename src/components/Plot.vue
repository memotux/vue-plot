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

const plotRoot = useTemplateRef('plot-root')
const { render } = createRenderer(nodeOps)

onMounted(() => {
  render(h(InternalComponent), plotRoot.value)
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

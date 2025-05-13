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
  <div ref="plot-root">
    <slot>
      <PlotFrame />
      <PlotText
        :data="['Please add Plot Marks in props or as children']"
        :options="{ frameAnchor: 'middle' }"
      />
    </slot>
  </div>
</template>

<script lang="ts" setup>
import {
  createRenderer,
  defineComponent,
  Fragment,
  h,
  onMounted,
  useTemplateRef,
} from 'vue'
import { nodeOps } from '../core'
import type { RendererElement } from 'vue'
import type { PlotOptions } from '@observablehq/plot'

const props = withDefaults(defineProps<PlotOptions>(), {
  aspectRatio: null,
})
const slots = defineSlots<{
  default: () => any
}>()
defineOptions({
  inheritAttrs: false,
})

const InternalComponent = defineComponent({
  setup() {
    return () => h(Fragment, null, slots.default?.() || h('PlotPlot', { ...props }))
  },
})

const plotRoot = useTemplateRef('plot-root')
onMounted(() => {
  const { render } = createRenderer(nodeOps)
  render(h(InternalComponent), plotRoot.value as RendererElement)
})
</script>

<template>
  <div ref="plot-root"></div>
</template>

<script lang="ts" setup>
import {
  createRenderer,
  defineComponent,
  Fragment,
  h,
  onMounted,
  useAttrs,
  useTemplateRef,
} from 'vue'
import { nodeOps } from '../core'
import type { RendererElement } from 'vue'

const slots = defineSlots<{
  default: () => any
}>()
defineOptions({
  inheritAttrs: false,
})
const attrs = useAttrs()

const InternalComponent = defineComponent({
  setup() {
    console.log({ attrs })

    return () => h(Fragment, null, slots.default?.() || h('PlotPlot', { ...attrs }))
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

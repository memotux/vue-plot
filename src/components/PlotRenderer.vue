<script lang="ts" setup>
import {
  createRenderer,
  defineComponent,
  Fragment,
  h,
  onMounted,
  useTemplateRef,
} from 'vue'
import type { RendererElement } from 'vue'
import { nodeOps } from '../core'

const plotRoot = useTemplateRef('plot-root')
const slots = defineSlots<{
  default: () => any
}>()

const InternalComponent = defineComponent({
  setup() {
    return () => h(Fragment, null, slots.default?.() || [])
  },
})

onMounted(() => {
  const { render } = createRenderer(nodeOps)
  render(h(InternalComponent), plotRoot.value as RendererElement)
})
</script>

<template>
  <div
    ref="plot-root"
    id="plot-root"
  ></div>
</template>

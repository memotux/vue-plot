<script lang="ts" setup>
import { h, onMounted, useTemplateRef, createRenderer } from 'vue'
import { nodeOps } from '../core'
import type { PlotOptions } from '@observablehq/plot'
import type { VNode } from 'vue'

const props = withDefaults(defineProps<PlotOptions>(), {
  aspectRatio: null,
})
const slots = defineSlots<{
  default?: () => VNode
}>()
defineOptions({
  inheritAttrs: false,
})

const InternalComponent = () => h('PlotRoot', { ...props }, () => slots.default?.() || [])

const plotRoot = useTemplateRef('plot-root')
const { render } = createRenderer(nodeOps)

onMounted(() => {
  render(h(InternalComponent), plotRoot.value)
})
</script>

<template>
  <div ref="plot-root"></div>
</template>

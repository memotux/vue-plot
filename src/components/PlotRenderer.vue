<script lang="ts" setup>
import {
  h,
  onMounted,
  useTemplateRef,
  createRenderer,
  defineComponent
} from 'vue'
import { nodeOps } from '../core'
import type { PlotOptions } from '@observablehq/plot'

const props = withDefaults(defineProps<PlotOptions>(), {
  aspectRatio: null,
})
const slots = defineSlots<{
  default?: () => any
}>()
defineOptions({
  inheritAttrs: false,
})

const InternalComponent = defineComponent({
  setup: () => () => h('PlotRoot', {...props}, slots.default?.() || []),
})

const plotRoot = useTemplateRef('plot-root')
const { render } = createRenderer(nodeOps)

onMounted(() => {
  render(h(InternalComponent), plotRoot.value)
})
</script>

<template>
  <div ref="plot-root"></div>
</template>

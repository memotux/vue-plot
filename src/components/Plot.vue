<script setup lang="ts">
import type { PlotOptions } from '@observablehq/plot'
import { type ComputedRef, computed } from 'vue'
import PlotRenderer from './PlotRenderer.vue'

const { marks = [], options = {} } = defineProps<{
  options?: Omit<PlotOptions, 'marks'>
  marks?: PlotOptions['marks']
}>()

const opts: ComputedRef<PlotOptions> = computed(() => ({
  marks: marks.length === 0 ? [] : [marks],
  width: 688,
  className: 'plot',
  ...options,
}))
</script>

<template>
  <PlotRenderer>
    <Plot v-bind="opts" />
  </PlotRenderer>
</template>

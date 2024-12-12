<script setup lang="ts">
import type { PlotOptions } from '@observablehq/plot'
import { type ComputedRef, computed } from 'vue'
import PlotRenderer from './PlotRenderer.vue'

const { marks = [], options = {} } = defineProps<{
  options?: Omit<PlotOptions, 'marks'>
  marks?: PlotOptions['marks']
}>()

const opts: ComputedRef<PlotOptions> = computed(() => ({
  marks: marks && [marks],
  width: 688,
  className: 'plot',
  ...options,
}))
</script>

<template>
  <PlotRenderer v-bind="opts" />
</template>

<script setup lang="ts">
import type { PlotOptions, Markish } from '@observablehq/plot'
import { type ComputedRef, computed } from 'vue'
import { usePlot } from '../composable/plot'

const { marks = [], options = {} } = defineProps<{
  options?: Omit<PlotOptions, 'marks'>
  marks?: Markish[]
}>()

const opts: ComputedRef<PlotOptions> = computed(() => ({
  marks: marks.length === 0 ? [] : [marks],
  width: 688,
  className: 'plot',
  ...options,
}))

usePlot<HTMLDivElement>(opts, 'container')
</script>

<template>
  <div
    class="plot-container"
    ref="container"
  >
    <slot>
      <div>Loading Plot...</div>
    </slot>
  </div>
</template>

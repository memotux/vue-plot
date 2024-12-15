<script setup lang="ts">
import { computed } from 'vue'
import PlotRenderer from './PlotRenderer.vue'
import type { PlotOptions } from '@observablehq/plot'
import type { ComputedRef } from 'vue'

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
  <PlotRenderer v-bind="opts">
    <slot>
      <PlotFrame />
      <PlotText :data="['Please add Plot Marks in props or as children']" frame-anchor="middle" />
    </slot>
  </PlotRenderer>
</template>

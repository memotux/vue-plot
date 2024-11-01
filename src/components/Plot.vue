<script setup lang="ts">
import { plot, type PlotOptions, type Markish } from '@observablehq/plot'
import { type ComputedRef, computed, onMounted, onUpdated, useTemplateRef } from 'vue'

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

const el = useTemplateRef<HTMLDivElement>('container')

const replace = () => {
  if (!el.value) return

  el.value.replaceChildren(plot(opts.value))
}

onMounted(replace)
onUpdated(replace)
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

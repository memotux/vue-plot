<script setup lang="ts">
import { plot, type PlotOptions, type Markish } from '@observablehq/plot'
import { computed, type ComputedRef, onMounted, onUpdated, useTemplateRef } from 'vue'

const props = defineProps<{
  options?: Omit<PlotOptions, 'marks'>
  marks?: Markish[]
}>()

const options: ComputedRef<PlotOptions> = computed(() => ({
  marks: props.marks == null ? [] : [props.marks],
  width: 688, // better default for VitePress
  className: 'plot',
  ...props.options,
}))

const el = useTemplateRef<HTMLDivElement>('container')

const replace = () => {
  if (!el.value) return

  el.value.replaceChildren(plot(options.value))
}

onMounted(replace)
onUpdated(replace)
</script>

<template>
  <div
    class="plot-container"
    ref="container"
  >
    <h1>Plot</h1>
  </div>
</template>

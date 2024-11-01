<script setup lang="ts">
import { plot, type PlotOptions, type Markish } from '@observablehq/plot'
import {
  type ComputedRef,
  computed,
  onMounted,
  onUpdated,
  useTemplateRef,
  withDefaults,
} from 'vue'

const props = withDefaults(
  defineProps<{
    options?: Omit<PlotOptions, 'marks'>
    marks?: Markish[]
  }>(),
  {
    options: () => ({}),
    marks: () => [],
  }
)

const options: ComputedRef<PlotOptions> = computed(() => ({
  marks: props.marks.length === 0 ? [] : [props.marks],
  width: 688,
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
    <slot>
      <div>Loading Plot...</div>
    </slot>
  </div>
</template>

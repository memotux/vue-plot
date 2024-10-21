<script setup lang="ts">
import { plot, type PlotOptions, type Markish } from '@observablehq/plot'
import { computed, type ComputedRef, onMounted, onUpdated, useTemplateRef } from 'vue'

const props = defineProps<{
  options?: Omit<PlotOptions, 'marks'>
  marks?: Markish[]
  defer?: Boolean
}>()

const options: ComputedRef<PlotOptions> = computed(() => ({
  marks: props.marks == null ? [] : [props.marks],
  width: 688, // better default for VitePress
  className: 'plot',
  ...props.options,
}))

const deferStyle = {
  maxWidth: '100%',
  width: '688px',
  aspectRatio: `688 / ${props.options?.height || 400}`,
}

const el = useTemplateRef<HTMLDivElement>('container')
let _observer: IntersectionObserver | null = null
let _idling: number | null = null

const disconnect = () => {
  if (_observer !== null) {
    _observer.disconnect()
    _observer = null
  }
  if (_idling !== null) {
    cancelIdleCallback(_idling)
    _idling = null
  }
}

const updatePlot = () => {
  if (!el.value) return

  disconnect()
  el.value.replaceChildren(plot(options.value))
}

const replace = () => {
  if (!el.value) return

  if (props.defer) {
    const rect = el.value.getBoundingClientRect()
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      updatePlot()
    } else {
      _observer = new IntersectionObserver(
        ([entry]) => {
          if (!el.value) return

          if (entry.isIntersecting) updatePlot()
        },
        { rootMargin: '100px' }
      )
      _observer.observe(el.value)
      if (typeof requestIdleCallback === 'function') {
        _idling = requestIdleCallback(updatePlot)
      }
    }
    return
  }

  updatePlot()
}

onMounted(replace)
onUpdated(replace)
</script>

<template>
  <div
    class="plot-container"
    :style="props.defer ? deferStyle : undefined"
    ref="container"
  >
    <h1>Plot</h1>
  </div>
</template>

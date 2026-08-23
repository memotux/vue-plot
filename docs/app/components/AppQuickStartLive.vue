<script setup lang="ts">
// VPlot is auto-imported by @memotux/nuxt-vue-plot.

const data = [
  { name: 'A', value: 10 },
  { name: 'B', value: 20 },
  { name: 'C', value: 15 },
]
</script>

<template>
  <ClientOnly>
    <VPlot :width="680" class="max-w-full">
      <PlotBarY
        :data="data"
        x="name"
        y="value"
        fill="var(--ui-secondary)"
        :tip="true"
      />
    </VPlot>
    <template #fallback>
      <div class="h-48 w-full animate-pulse rounded-lg bg-elevated/50" />
    </template>
  </ClientOnly>
</template>

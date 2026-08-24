<script setup lang="ts">
// VPlot is auto-imported by @memotux/nuxt-vue-plot.
// markFamilies is auto-imported from app/data/.
</script>

<template>
  <ClientOnly>
    <VPlot :width="680" :margin-left="120" class="max-w-full">
      <PlotBarX :data="markFamilies" y="family" x="count" fill="var(--ui-primary)" :tip="true" />
    </VPlot>
    <template #fallback>
      <div class="h-64 w-full animate-pulse rounded-lg bg-elevated/50" />
    </template>
  </ClientOnly>
</template>

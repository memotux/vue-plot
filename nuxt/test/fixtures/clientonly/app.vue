<template>
  <div>
    <p id="page-marker">
      client-only fixture
    </p>
    <ClientOnly>
      <VPlot :width="680">
        <PlotBarY
          :data="data"
          x="name"
          y="value"
        />
      </VPlot>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const data = [
  { name: 'A', value: 10 },
  { name: 'B', value: 20 },
  { name: 'C', value: 15 },
]
</script>

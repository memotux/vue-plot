<template>
  <div>
    <VPlot :width="680">
      <PlotBarY
        :data="data"
        x="name"
        y="value"
      />
    </VPlot>
  </div>
</template>

<script setup>
const data = [
  { name: 'A', value: 10 },
  { name: 'B', value: 20 },
  { name: 'C', value: 15 },
]
</script>

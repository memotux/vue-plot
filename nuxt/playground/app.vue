<template>
  <div>
    <h1>Vue Plot — Nuxt Playground</h1>

    <h2>Bar Chart</h2>
    <VPlot :width="680">
      <PlotBarY
        :data="barData"
        x="name"
        y="value"
      />
    </VPlot>

    <h2>Line Chart</h2>
    <VPlot :width="680">
      <PlotLineY
        :data="lineData"
        x="date"
        y="value"
      />
    </VPlot>

    <h2>Dot Plot</h2>
    <VPlot :width="680">
      <PlotDot
        :data="dotData"
        x="x"
        y="y"
      />
    </VPlot>
  </div>
</template>

<script setup>
const barData = [
  { name: 'A', value: 10 },
  { name: 'B', value: 20 },
  { name: 'C', value: 15 },
  { name: 'D', value: 25 },
  { name: 'E', value: 18 },
]

const lineData = [
  { date: '2024-01', value: 10 },
  { date: '2024-02', value: 15 },
  { date: '2024-03', value: 12 },
  { date: '2024-04', value: 20 },
  { date: '2024-05', value: 18 },
]

const dotData = [
  { x: 1, y: 2 },
  { x: 2, y: 4 },
  { x: 3, y: 1 },
  { x: 4, y: 6 },
  { x: 5, y: 3 },
]
</script>

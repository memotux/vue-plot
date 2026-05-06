# Vue Plot

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

Vue components for building data visualizations with [`@observablehq/plot`](https://github.com/observablehq/plot).

> [!NOTE]
> This project is a **work in progress**. APIs may change between minor versions.

## Quick Start

```bash
pnpm add @memotux/vue-plot @observablehq/plot
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { plotCustomElement } from '@memotux/vue-plot'

export default defineConfig({
  plugins: [
    vue({
      template: plotCustomElement.template,
    }),
  ],
})
```

```vue
<!-- App.vue -->
<script setup>
import { VPlot } from '@memotux/vue-plot'

const data = [
  { name: 'A', value: 10 },
  { name: 'B', value: 20 },
  { name: 'C', value: 15 },
]
</script>

<template>
  <VPlot :width="680">
    <PlotBarY :data="data" x="name" y="value" />
  </VPlot>
</template>
```

## Installation

```bash
pnpm add @memotux/vue-plot @observablehq/plot
# or
npm install @memotux/vue-plot @observablehq/plot
# or
yarn add @memotux/vue-plot @observablehq/plot
```

> [!IMPORTANT]
> `@observablehq/plot` is a **required peer dependency**. It is NOT bundled with this package — you must install it separately.

## Setup

### Vite Plugin Configuration

Configure the Vite plugin so Vue recognizes `<Plot*>` tags as custom elements:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { plotCustomElement } from '@memotux/vue-plot'

export default defineConfig({
  plugins: [
    vue({
      template: plotCustomElement.template,
    }),
  ],
})
```

> [!NOTE]
> This step is only required when using mark components as children. If you prefer to pass marks via the `marks` prop, you can skip this configuration.

### Component Registration

Choose one of the following methods to use `<VPlot>` in your components.

#### Global Registration (Vue Plugin)

Registers `<VPlot>` globally across your application.

```ts
// main.ts
import { createApp } from 'vue'
import { VuePlot } from '@memotux/vue-plot'
import App from './App.vue'

const app = createApp(App)
app.use(VuePlot)
app.mount('#app')
```

#### Local Registration

Import `<VPlot>` directly in individual components without global registration.

```vue
<!-- MyChart.vue -->
<script setup>
import { VPlot } from '@memotux/vue-plot'
</script>

<template>
  <VPlot :width="680" :marks="[]" />
</template>
```

## Usage

### Marks as Children

Use `<Plot*>` components directly in your template. Each mark from `@observablehq/plot` maps to a `Plot{MarkName}` component with PascalCase naming.

```vue
<script setup>
import { VPlot } from '@memotux/vue-plot'

const data = [
  { name: 'A', value: 10 },
  { name: 'B', value: 20 },
  { name: 'C', value: 15 },
]
</script>

<template>
  <VPlot :width="680">
    <PlotBarY :data="data" x="name" y="value" />
  </VPlot>
</template>
```

> [!NOTE]
> This pattern requires the [Vite Plugin Configuration](#vite-plugin-configuration) setup step.

### Marks as Props

Pass marks from `@observablehq/plot` through the `marks` prop. This pattern does not require the Vite plugin.

```vue
<script setup>
import { VPlot } from '@memotux/vue-plot'
import { barY } from '@observablehq/plot'

const data = [
  { name: 'A', value: 10 },
  { name: 'B', value: 20 },
  { name: 'C', value: 15 },
]

const options = {
  width: 680,
  marks: [barY(data, { x: 'name', y: 'value' })],
}
</script>

<template>
  <VPlot v-bind="options" />
</template>
```

### Reactive Data

Bind reactive data to update plots when data changes.

```vue
<script setup>
import { ref } from 'vue'
import { VPlot } from '@memotux/vue-plot'

const data = ref([
  { x: 1, y: 2 },
  { x: 2, y: 4 },
  { x: 3, y: 1 },
])

function addPoint() {
  data.value.push({
    x: data.value.length + 1,
    y: Math.random() * 10,
  })
}
</script>

<template>
  <VPlot :width="680">
    <PlotDot :data="data" x="x" y="y" />
  </VPlot>
  <button @click="addPoint">Add Point</button>
</template>
```

### Marks Priority

If marks are provided both as props **and** as children, **only child marks are rendered**.

```vue
<!-- Only PlotBarY renders — the marks prop is ignored -->
<VPlot :marks="[frame()]">
  <PlotBarY :data="data" x="name" y="value" />
</VPlot>
```

## API Reference

### VPlot

The main chart component. Accepts plot configuration via props.

| Prop | Type | Description |
|------|------|-------------|
| All `PlotOptions` fields | — | Spread any [`PlotOptions`](https://observablehq.com/plot/) property (`width`, `height`, `style`, etc.) |
| `marks` | `RenderableMark[]` | Array of mark functions from `@observablehq/plot` |

**Usage pattern**: Spread a plot options object with `v-bind`:

```vue
<VPlot v-bind="{ width: 680, marks: [...] }" />
```

### Mark Components

Every mark from `@observablehq/plot` is available as a `<Plot*>` child component.

| Mark Function | Component Tag | Options Type |
|---------------|---------------|--------------|
| `area` | `<PlotArea>` | `AreaOptions` |
| `areaX` | `<PlotAreaX>` | `AreaXOptions` |
| `areaY` | `<PlotAreaY>` | `AreaYOptions` |
| `barX` | `<PlotBarX>` | `BarXOptions` |
| `barY` | `<PlotBarY>` | `BarYOptions` |
| `dot` | `<PlotDot>` | `DotOptions` |
| `dotX` | `<PlotDotX>` | `DotXOptions` |
| `dotY` | `<PlotDotY>` | `DotYOptions` |
| `frame` | `<PlotFrame>` | `FrameOptions` |
| `line` | `<PlotLine>` | `LineOptions` |
| `lineX` | `<PlotLineX>` | `LineXOptions` |
| `lineY` | `<PlotLineY>` | `LineYOptions` |
| `rect` | `<PlotRect>` | `RectOptions` |
| `rectX` | `<PlotRectX>` | `RectXOptions` |
| `rectY` | `<PlotRectY>` | `RectYOptions` |
| `ruleX` | `<PlotRuleX>` | `RuleXOptions` |
| `ruleY` | `<PlotRuleY>` | `RuleYOptions` |
| `text` | `<PlotText>` | `TextOptions` |
| `textX` | `<PlotTextX>` | `TextXOptions` |
| `textY` | `<PlotTextY>` | `TextYOptions` |
| `tickX` | `<PlotTickX>` | `TickXOptions` |
| `tickY` | `<PlotTickY>` | `TickYOptions` |
| `cell` | `<PlotCell>` | `CellOptions` |
| `image` | `<PlotImage>` | `ImageOptions` |
| `arrow` | `<PlotArrow>` | `ArrowOptions` |
| `link` | `<PlotLink>` | `LinkOptions` |
| `vector` | `<PlotVector>` | `VectorOptions` |
| `tree` | `<PlotTree>` | `TreeOptions` |
| `contour` | `<PlotContour>` | `ContourOptions` |
| `hexbin` | `<PlotHexbin>` | `HexbinOptions` |
| `density` | `<PlotDensity>` | `DensityOptions` |
| `tip` | `<PlotTip>` | `TipOptions` |
| `geo` | `<PlotGeo>` | `GeoOptions` |
| `raster` | `<PlotRaster>` | `RasterOptions` |
| `axisX` | `<PlotAxisX>` | `AxisXOptions` |
| `axisY` | `<PlotAxisY>` | `AxisYOptions` |
| `crosshair` | `<PlotCrosshair>` | `CrosshairOptions` |
| `delaunayLink` | `<PlotDelaunayLink>` | `DelaunayOptions` |
| `delaunayMesh` | `<PlotDelaunayMesh>` | `DelaunayOptions` |
| `hexgrid` | `<PlotHexgrid>` | `HexgridOptions` |
| `hexagon` | `<PlotHexagon>` | `Omit<DotOptions, "symbol">` |
| `waffleX` | `<PlotWaffleX>` | `WaffleXOptions` |
| `waffleY` | `<PlotWaffleY>` | `WaffleYOptions` |
| `bollinger` | `<PlotBollinger>` | `BollingerOptions` |
| `boxX` | `<PlotBoxX>` | `BoxXOptions` |
| `boxY` | `<PlotBoxY>` | `BoxYOptions` |
| `linearRegressionX` | `<PlotLinearRegressionX>` | `LinearRegressionXOptions` |
| `linearRegressionY` | `<PlotLinearRegressionY>` | `LinearRegressionYOptions` |
| `differenceX` | `<PlotDifferenceX>` | `DifferenceOptions` |
| `differenceY` | `<PlotDifferenceY>` | `DifferenceOptions` |
| `auto` | `<PlotAuto>` | `AutoOptions` |

Each mark component accepts a `data` prop plus all options from the corresponding `@observablehq/plot` mark function.

### TypeScript Types

Import types from `@memotux/vue-plot/types`:

```ts
import type { PlotProps, PlotMarksProps, Marks, PlotContext, PlotChildrenContext } from '@memotux/vue-plot/types'
```

| Type | Description |
|------|-------------|
| `PlotProps` | Union of `PlotOptions \| PlotMarksProps` — accepted by `VPlot` |
| `PlotMarksProps<M>` | Generic: `{ data?: Data } & MarksOptions[M]` — props for a single mark component |
| `Marks` | Union of all supported mark names (`'area' \| 'barY' \| 'dot' \| ...`) |
| `PlotContext` | Reactive context shared between root plot and child marks |
| `PlotChildrenContext<M>` | Per-mark context with `mark`, `options`, `data`, `inserted`, and `id` |

**`PlotMarksProps` generic example**:

```ts
import type { PlotMarksProps } from '@memotux/vue-plot/types'

// Props for a barY mark component
type BarYProps = PlotMarksProps<'barY'>
// → { data?: Data } & BarYOptions
```

## Credits

This library is inspired by:

- [Observable Plot](https://github.com/observablehq/plot) — the underlying visualization engine
- [TresJS](https://github.com/Tresjs/tres) — the Vue custom element pattern for Three.js

## Contributing

Contributions are welcome! Please open an [issue](https://github.com/memotux/vue-plot/issues) or submit a [pull request](https://github.com/memotux/vue-plot/pulls).

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## Links

- [npm](https://npmjs.com/package/@memotux/vue-plot)
- [GitHub](https://github.com/memotux/vue-plot)
- [Observable Plot Documentation](https://observablehq.com/plot/)

[npm-version-src]: https://img.shields.io/npm/v/@memotux/vue-plot/latest.svg?style=flat&colorA=34495e&colorB=41b883
[npm-version-href]: https://npmjs.com/package/@memotux/vue-plot
[npm-downloads-src]: https://img.shields.io/npm/dm/@memotux/vue-plot.svg?style=flat&colorA=34495e&colorB=41b883
[npm-downloads-href]: https://npm.chart.dev/@memotux/vue-plot
[license-src]: https://img.shields.io/github/license/memotux/vue-plot.svg?style=flat&colorA=34495e&colorB=41b883
[license-href]: https://github.com/memotux/vue-plot/blob/main/LICENSE

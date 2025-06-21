# Vue Plot

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

Vue.js UI Components for visualizing tabular data using [`@observablehq/plot` library](https://github.com/observablehq/plot).

> [!CAUTION]
> Beta release

## Usage

Install `@memotux/vue-plot` package:

> [!IMPORTANT]
> Package is in Beta release

```bash
pnpm add @memotux/vue-plot @observablehq/plot
```

Add `plotCustomElement` to `vite.config.plugins.vue` to register `PlotMarks` as Vue Custom Component.

```ts vite.config
import { plotCustomElement } from '@memotux/vue-plot'

export default defineConfig({
  // ...
  plugins: [
    vue({
      ...plotCustomElement,
    }),
  ],
  // ...
})
```

### Plugin

Import plugin install function `VuePlot` and `use` it on your `Vue.app`:

```ts
import { createApp } from 'vue'
import { VuePlot } from '@memotux/vue-plot'

const app = createApp({})

// ...

app.use(VuePlot)

// ...
```

This will install `VPlot` component globally on your App.

### Component Local Registration

Also you can use `VPlot` component in local registration:

```vue
<script setup>
import { VPlot } from '@memotux/vue-plot'

defineProps(['options', 'marks'])
</script>

<template>
  <VPlot
    v-bind="options"
    :marks="marks"
  />
</template>
```

### Using VPlot

```vue
<script setup>
import { reactive, computed } from 'vue'
import { VPlot } from '@memotux/vue-plot'
import { frame, text } from '@observablehq/plot'

const hello = reactive(['Hello World!'])
const helloOptions = reactive({
  frameAnchor: 'middle',
})

const plot = computed(() => ({
  width: 688,
  className: 'plot',
  marks: [frame(), text(hello, helloOptions)],
}))
</script>

<template>
  <!-- Plot Marks in props -->
  <VPlot v-bind="plot" />
  <!-- Plot Marks as children -->
  <VPlot v-bind="{ ...plot, marks: undefined }">
    <PlotFrame />
    <PlotText v-bind="{ ...helloOptions, data: hello }" />
  </VPlot>
</template>
```

```ts
interface PlotProps extends PlotOptions {}

// PlotMarksOptions are different for each mark
interface PlotMarkProps extends MarksOptions {
  data?: Plot.Data
}
```

### Marks

Plot Marks **must** be present as `props` or as `children`.

Marks as `props` must be imported from `@observablehq/plot` and passed as `marks` property to `VPlot` component.

Marks as `children` are defined as any other Vue.js Component, wich name **must** start with `Plot` followed by Mark name.

```vue
<template>
  <VPlot>
    <PlotArea v-bind="props" />
    <PlotBarY v-bind="props" />
  </VPlot>
</template>
```

This Custom Components recive as `props` same mark arguments types. Example:

```vue
<script lang="js">
import { areaY } from '@observablehq/plot'
//                 data    Mark options
const mark = areaY(aapl, {x: "Date", y: "Close"})
</script>
<!-- equivalent to -->
<template>
  <VPlot>
    <PlotAreaY
      :data="aapl"
      x="Date"
      y="Close"
    />
  </VPlot>
</template>
```

Note how `data` and `options` are equivalent from `parameters` to `props`.

```vue
<script setup lang="ts">
import { VPlot } from '@memotux/vue-plot'
import { aapl } from 'data'
import type { PlotOptions, AreaYOptions } from '@observablehq/plot'

// This are global plot options
const plotOptions: PlotOptions = {
  width: 688,
  className: 'plot',
}

// This are specific mark options
const options: AreaYOptions = {
  x: 'Date',
  y: 'Close',
}
</script>

<template>
  <VPlot
    :width="688"
    className="plot"
  >
    <PlotAreaY
      :data="aapl"
      x="Date"
      y="Close"
    />
  </VPlot>
</template>
```

If you define marks as `props` **AND** as `children`, **only** marks as `children` will be rendered.

## Credits

This project was inspired by:

- [Plot](https://github.com/observablehq/plot)
- [TresJS](https://github.com/Tresjs/tres)

[npm-version-src]: https://img.shields.io/npm/v/@memotux/vue-plot/latest.svg?style=flat&colorA=34495e&colorB=41b883
[npm-version-href]: https://npmjs.com/package/@memotux/vue-plot
[npm-downloads-src]: https://img.shields.io/npm/dm/@memotux/vue-plot.svg?style=flat&colorA=34495e&colorB=41b883
[npm-downloads-href]: https://npm.chart.dev/@memotux/vue-plot
[license-src]: https://img.shields.io/github/license/memotux/vue-plot.svg?style=flat&colorA=34495e&colorB=41b883
[license-href]: https://github.com/memotux/vue-plot/blob/main/LICENSE

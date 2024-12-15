# Vue Plot

Vue.js UI Components for visualizing tabular data using [`@observablehq/plot` library](https://github.com/observablehq/plot).

> [!CAUTION]
> WIP REPOSITORY

## Usage

> [!IMPORTANT]
> Package not public available. This is a WIP REPOSITORY

Install `@memotux/vue-plot` package:

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
      ...plotCustomElement
    })
  ]
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

This will install `Plot` component globally on your App.

### Component Local Registration

You can use `Plot` component in local registration:

```vue
<script setup>
import { Plot } from '@memotux/vue-plot'
</script>

<template>
  <!-- Plot Marks in props -->
  <Plot :options="plot.options" :marks="plot.marks" />
  <!-- Plot Marks as children -->
  <Plot :options="plot.options">
    <PlotText :data="['Hello World!']" frame-anchor="middle" />
  </Plot>
</template>
```

```ts
interface PlotProps {
  options?: Omit<PlotOptions, 'marks'>
  marks?: PlotOptions['marks']
}
```

### Marks

Plot Marks **must** be present as `props` or as children.

Marks as `props` must be imported from `@observablehq/plot` and passed as `marks` property to `Plot` component.

Marks as `children` are defined as any other Vue.js Component, wich name must start with `Plot` followed by Mark name. Example: `<PlotArea /> | <PlotBarY />`. This Custom Component recive as `props` same mark arguments. Example: `Plot.areaY(aapl, {x: "Date", y: "Close"})` can be translated as `<PlotAreaY :data="aapl" x="Date" y="Close" />`

If you define marks as `props` and as `children`, only marks as `props` will be rendered.
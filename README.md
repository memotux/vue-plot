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

This will install `Plot` component globally on your App.

### Component Local Registration

You can use `Plot` component in local registration:

```vue
<script setup>
import { Plot } from '@memotux/vue-plot'

defineProps(['options', 'marks'])
</script>

<template>
  <Plot
    v-bind="options"
    :marks="marks"
  />
</template>
```

### Using Plot

```vue
<script setup>
import { reactive, computed } from 'vue'
import { Plot } from '@memotux/vue-plot'
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
  <Plot v-bind="plot" />
  <!-- Plot Marks as children -->
  <Plot v-bind="{ ...plot, marks: undefined }">
    <PlotFrame />
    <PlotText v-bind="{ ...helloOptions, data: hello }" />
  </Plot>
</template>
```

```ts
interface PlotProps extends PlotOptions {}

// PlotMarksOptions are different for each mark
interface PlotMarkProps extends PlotMarksOptions {
  data?: Plot.Data
}
```

### Marks

Plot Marks **must** be present as `props` or as `children`.

Marks as `props` must be imported from `@observablehq/plot` and passed as `marks` property to `Plot` component.

Marks as `children` are defined as any other Vue.js Component, wich name **must** start with `Plot` followed by Mark name.

```vue
<template>
  <Plot>
    <PlotArea />
    <PlotBarY />
  </Plot>
</template>
```

This Custom Component recive as `props` same mark arguments types. Example: `Plot.areaY(aapl, {x: "Date", y: "Close"})` can be translated as `<PlotAreaY :data="aapl" x="Date" y="Close" />`

```vue
<script setup lang="ts">
import { Plot } from '@memotux/vue-plot'
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
  <Plot
    :width="688"
    className="plot"
  >
    <PlotAreaY
      :data="aapl"
      x="Date"
      y="Close"
    />
  </Plot>
</template>
```

If you define marks as `props` and as `children`, only marks as `props` will be rendered.

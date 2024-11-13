# Vue Plot

Vue.js UI Components for visualizing tabular data using [`@observablehq/plot` library](https://github.com/observablehq/plot).

> [!CAUTION]
> WIP REPOSITORY

## Usage

> [!IMPORTANT]
> Package not public available. This is a WIP REPOSITORY

Install `@memotux/vue-plot` package:

```bash
pnpm add @memotux/vue-plot
```

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

But you can use `Plot` component in local registration:

```vue
<script setup>
import { Plot } from '@memotux/vue-plot'
</script>

<template>
  <Plot v-bind="props" />
</template>
```

```ts
interface PlotProps {
  options?: Omit<PlotOptions, 'marks'>
  marks?: PlotOptions['marks']
}
```

### Composable

This package export Vue Composable `usePlot` that it is use in `Plot` component.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { dot } from '@observablehq/plot'
import { usePlot } from '@memotux/vue-plot'

// add marks imported from @observablehq/plot
const marks = [dot(penguins, { x: 'culmen_length_mm', y: 'culmen_depth_mm' })]

const opts = ref({
  marks,
  width: 688,
  className: 'plot',
  ...options,
})

usePlot<HTMLDivElement>(opts, 'container')
</script>

<template>
  <div
    class="plot-container"
    ref="container"
  >
    <slot>
      <div>Loading Plot...</div>
    </slot>
  </div>
</template>
```

```ts
type usePlot = <HTMLElement>(opts: Ref<PlotOptions>, key: string): void
```

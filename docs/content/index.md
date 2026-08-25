---
title: Data Visualizations for Vue
description: >
  Build reactive, type-safe data visualizations with Vue 3 components that wrap
  Observable Plot's grammar of graphics. Works with Nuxt.
seo:
  title: Vue Plot — Declarative Data Visualization for Vue & Nuxt
  description: >
    Vue Plot wraps Observable Plot's grammar of graphics in idiomatic Vue 3
    components — declarative, reactive, and fully type-safe.
---

<!-- markdownlint-disable MD034 MD003 MD025 MD024 -->
<!-- prettier-ignore -->
::u-page-hero
#title
::app-icon{.h-98 .mx-auto}
::

[Vue]{.text-primary} [Plot]{.text-secondary}

#description
Vue Plot wraps Observable Plot's grammar of graphics into idiomatic Vue components. Build charts, plots, and data visualizations using Vue templates, reactive data, and composables.

#headline
Vue components for building data visualizations with [`@observablehq/plot`](https://github.com/observablehq/plot).

#links
:::u-button
---
label: Get Started
to: /getting-started/introduction
icon: i-ph-arrow-right
size: lg
---
:::

:::u-button
---
label: View on GitHub
to: https://github.com/memotux/vue-plot
icon: i-ph-github-logo
variant: outline
size: lg
---
:::
::
    
<!-- prettier-ignore -->
::u-page-section
---
title: 62 marks, one component model
description: "Every Observable Plot mark maps to a declarative Vue component — reactive, type-safe, and composable."
orientation: horizontal
---
    
::app-showcase-chart
::
::
    
<!-- prettier-ignore -->
::u-page-section
---
title: Why Vue Plot?
---

#features
:::u-page-feature
---
title: Observable Plot Power
description: Access the full grammar of graphics — 62 mark types from area charts to waffle plots.
icon: i-ph-chart-bar
---
:::

:::u-page-feature
---
title: Vue-Native API
description: Use marks as template components or functional props — whichever fits your style.
icon: i-ph-puzzle-piece
---
:::

:::u-page-feature
---
title: Reactive by Default
description: Bind reactive data and re-render plots automatically.
icon: i-ph-arrows-clockwise
---
:::

:::u-page-feature
---
title: TypeScript First
description: Full type inference for all mark options and plot configuration.
icon: i-ph-file-ts
---
:::

:::u-page-feature
---
title: Nuxt Integration
description: Nuxt module with auto-imports and devtools support.
icon: i-ph-cube
---
:::

:::u-page-feature
---
title: Lightweight
description: No bundled visualization engine — uses Observable Plot as a peer dependency.
icon: i-ph-feather
---
:::
::

<!-- prettier-ignore -->
::u-page-section{:ui='{"body": "grid lg:grid-cols-2 items-center gap-4"}'}
#title
Quick Start

#body
```vue[App.vue]
<script setup lang="ts">
import { VPlot } from "@memotux/vue-plot";

const data = [
  { name: "A", value: 10 },
  { name: "B", value: 20 },
  { name: "C", value: 15 },
];
</script>

<template>
  <VPlot :width="680">
    <PlotBarY :data="data" x="name" y="value" />
  </VPlot>
</template>
```
    
::app-quick-start-live
::
::

::u-page-section
---
title: Ready to start?
---

#links
:::u-button
---
label: Installation Guide
to: /getting-started/installation
icon: i-ph-download
size: lg
---
:::
::
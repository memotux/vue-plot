---
seo:
  title: Vue Plot
  description: Vue Plot wraps Observable Plot's grammar of graphics in idiomatic Vue components — declarative, reactive, and fully type-safe.
---

<!-- markdownlint-disable MD034 -->
<!-- prettier-ignore -->
::u-page-hero
#title
::app-icon{.h-98 .mx-auto}
::

[Vue]{.text-primary} [Plot]{.text-secondary}

#description
Vue Plot wraps Observable Plot's powerful grammar of graphics into idiomatic Vue components. Build charts, plots, and data visualizations using familiar Vue patterns — templates, reactive data, and composables.

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
title: Why Vue Plot?
---

#features
:::u-page-feature
---
title: Observable Plot Power
description: Access the full grammar of graphics — 50+ mark types from area charts to waffle plots.
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
description: Bind reactive data and watch your visualizations update automatically.
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
description: First-class Nuxt module with auto-imports and devtools support.
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
::u-page-section
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

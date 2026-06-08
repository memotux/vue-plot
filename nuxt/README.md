# Nuxt Vue Plot

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Nuxt module for [@memotux/vue-plot](https://github.com/memotux/vue-plot) — declarative data visualization with Observable Plot.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

- ⛰ &nbsp;Auto-imports `VPlot` component
- 🚠 &nbsp;Configures `isCustomElement` for Plot* tags
- 🌲 &nbsp;Optimizes Vite dependencies for `@observablehq/plot`

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxt module add @memotux/vue-plot-nuxt
```

Install `@observablehq/plot` as it is a required peer dependency:

```bash
pnpm add @observablehq/plot
```

That's it! You can now use `VPlot` in your Nuxt app ✨

```vue
<script setup>
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

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@memotux/vue-plot-nuxt/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@memotux/vue-plot-nuxt

[npm-downloads-src]: https://img.shields.io/npm/dm/@memotux/vue-plot-nuxt.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@memotux/vue-plot-nuxt

[license-src]: https://img.shields.io/npm/l/@memotux/vue-plot-nuxt.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@memotux/vue-plot-nuxt

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com

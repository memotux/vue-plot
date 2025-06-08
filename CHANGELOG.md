# Changelog

## v0.4.1-beta.1

[compare changes](https://github.com/memotux/vue-plot/compare/v0.4.0...v0.4.1-beta.1)

### 💅 Refactors

- Context createPlotApp getPlotRender ([96fdad8](https://github.com/memotux/vue-plot/commit/96fdad8))
- NodeOps insert plot ([a50fc1d](https://github.com/memotux/vue-plot/commit/a50fc1d))

### 🏡 Chore

- Upgrade package dependencies ([7cc2148](https://github.com/memotux/vue-plot/commit/7cc2148))
- Add Changelogen ([4072535](https://github.com/memotux/vue-plot/commit/4072535))
- Add package author homepage repository ([2071b0a](https://github.com/memotux/vue-plot/commit/2071b0a))
- Cleanup nodeOps & utils ([cad142f](https://github.com/memotux/vue-plot/commit/cad142f))
- Ts-ignore on slots.default exec ([b7db264](https://github.com/memotux/vue-plot/commit/b7db264))
- Universal context getPlotApp ([4c3f9d0](https://github.com/memotux/vue-plot/commit/4c3f9d0))
- Pass slots object to plot root ([35c615b](https://github.com/memotux/vue-plot/commit/35c615b))
- Rename context setPlotCtx to addPlot ([cf84d01](https://github.com/memotux/vue-plot/commit/cf84d01))
- Better vue plot types ([4b6005e](https://github.com/memotux/vue-plot/commit/4b6005e))
- NodeOps better types ([93bbcd0](https://github.com/memotux/vue-plot/commit/93bbcd0))
- Add github actions ([0109d35](https://github.com/memotux/vue-plot/commit/0109d35))
- Upgrade package dependencies ([6b3422d](https://github.com/memotux/vue-plot/commit/6b3422d))
- Update README file ([2794336](https://github.com/memotux/vue-plot/commit/2794336))
- **package:** Update keywords and scripts ([aa2dca9](https://github.com/memotux/vue-plot/commit/aa2dca9))
- Vite.config remove build watch ([02a2c41](https://github.com/memotux/vue-plot/commit/02a2c41))

### ❤️ Contributors

- MemoTux <romeo@mendezfuentes.net>

## v0.4.0

[compare changes](https://github.com/memotux/vue-plot/compare/aaa64256e16d05a8088cfa1fa5d71f6ce4c4b0c4...v0.4.0)

### 🚀 Enhancements

- Patch child marks props ([af780c9](https://github.com/memotux/vue-plot/commit/af780c9))
- Add PlotContext ([c961223](https://github.com/memotux/vue-plot/commit/c961223))

### 🩹 Fixes

- Plot component override defaults ([048f8ad](https://github.com/memotux/vue-plot/commit/048f8ad))
- PatchProp when nextValue is falsy ([136e549](https://github.com/memotux/vue-plot/commit/136e549))

### 💅 Refactors

- Component export as VPlot ([773b41d](https://github.com/memotux/vue-plot/commit/773b41d))
- PlotChildrenContext target to mark ([0c1f76c](https://github.com/memotux/vue-plot/commit/0c1f76c))
- NodeOps insertStylessChildOnParent ([9f9e311](https://github.com/memotux/vue-plot/commit/9f9e311))
- Plot Internal component ([c824c59](https://github.com/memotux/vue-plot/commit/c824c59))

### 🏡 Chore

- Move plot.svg definition ([ece82c9](https://github.com/memotux/vue-plot/commit/ece82c9))
- Export context from core ([4b68b4d](https://github.com/memotux/vue-plot/commit/4b68b4d))
- Assert props as PlotOptions ([4c3793b](https://github.com/memotux/vue-plot/commit/4c3793b))
- Add Plot option figure default as undefined ([454582c](https://github.com/memotux/vue-plot/commit/454582c))
- **components:** Plot imports cleanup ([71072f9](https://github.com/memotux/vue-plot/commit/71072f9))
- Upgrade 'pm' version ([5d276c1](https://github.com/memotux/vue-plot/commit/5d276c1))
- Add insertStylessChildOnParent ([d53de71](https://github.com/memotux/vue-plot/commit/d53de71))
- Add README credits & update License ([119e49f](https://github.com/memotux/vue-plot/commit/119e49f))
- Mark childs as inserted ([340a851](https://github.com/memotux/vue-plot/commit/340a851))
- Vue custom element start with 'Plot' ([87d4df5](https://github.com/memotux/vue-plot/commit/87d4df5))
- Move context types ([202e7fc](https://github.com/memotux/vue-plot/commit/202e7fc))
- NodeOpts patchProp return if node not in plot context ([f5b1a55](https://github.com/memotux/vue-plot/commit/f5b1a55))
- Plot container unique id ([ed9b39d](https://github.com/memotux/vue-plot/commit/ed9b39d))
- PatchProp insert patched plot in parent ([efdb509](https://github.com/memotux/vue-plot/commit/efdb509))

### ✅ Tests

- Update plot props expect attribute viewBox updated ([5066432](https://github.com/memotux/vue-plot/commit/5066432))
- Refactor & add `as figure` ([2f5f434](https://github.com/memotux/vue-plot/commit/2f5f434))
- Individual files & verbose ([0079af1](https://github.com/memotux/vue-plot/commit/0079af1))

### ❤️ Contributors

- MemoTux <romeo@mendezfuentes.net>

## v0.3.0

[compare changes](https://github.com/memotux/vue-plot/compare/7a8d0d4fdc30038fe56395dd1ef130535495287b...v0.3.0)

### 🚀 Enhancements

- PlotMarks arguments as props ([03b543b](https://github.com/memotux/vue-plot/commit/03b543b))

### 🩹 Fixes

- Type PlotProps options ([c4586f0](https://github.com/memotux/vue-plot/commit/c4586f0))
- PlotMarksProps properties could be undefined ([391b53e](https://github.com/memotux/vue-plot/commit/391b53e))
- Vue warn 'slot invoked outside render function' ([8216661](https://github.com/memotux/vue-plot/commit/8216661))
- Plot not rendering children ([fb111c3](https://github.com/memotux/vue-plot/commit/fb111c3))
- Vue warn 'slot invoked outside render function' ([06ec83f](https://github.com/memotux/vue-plot/commit/06ec83f))
- Parent component non-plot children ([67e181e](https://github.com/memotux/vue-plot/commit/67e181e))

### 💅 Refactors

- Plot default children ([57f505b](https://github.com/memotux/vue-plot/commit/57f505b))

### 🏡 Chore

- Update README ([1c21fb6](https://github.com/memotux/vue-plot/commit/1c21fb6))
- Plot Custom Components types ([e1dabb8](https://github.com/memotux/vue-plot/commit/e1dabb8))
- NodeOpts update types & uncapitalize name ([db49ed5](https://github.com/memotux/vue-plot/commit/db49ed5))
- Update README component use ([d2ffe99](https://github.com/memotux/vue-plot/commit/d2ffe99))
- Update testing ([eabb9d4](https://github.com/memotux/vue-plot/commit/eabb9d4))
- Udpate test logic ([bbe54bf](https://github.com/memotux/vue-plot/commit/bbe54bf))
- Refactor Plot ([59e0241](https://github.com/memotux/vue-plot/commit/59e0241))
- Package keywords ([0891b51](https://github.com/memotux/vue-plot/commit/0891b51))
- Add vite build ([e0e39d3](https://github.com/memotux/vue-plot/commit/e0e39d3))
- Component Plot useSlots composable ([7b504aa](https://github.com/memotux/vue-plot/commit/7b504aa))

### ✅ Tests

- Root component only one children ([ca947c2](https://github.com/memotux/vue-plot/commit/ca947c2))

### ❤️ Contributors

- MemoTux <romeo@mendezfuentes.net>

## v0.2.0

[compare changes](https://github.com/memotux/vue-plot/compare/5a7d90f88ab2fc3e6476e03e31d36332f7d44d88...v0.2.0)

### 🚀 Enhancements

- PlotRenderer accepts binding options attributes ([f5ab3fa](https://github.com/memotux/vue-plot/commit/f5ab3fa))
- PlotRender accepts binding props ([77364af](https://github.com/memotux/vue-plot/commit/77364af))
- Plot can recive marks as props or children ([7b1a028](https://github.com/memotux/vue-plot/commit/7b1a028))

### 🏡 Chore

- NodeOps createElement options & target type ([3b3b0bc](https://github.com/memotux/vue-plot/commit/3b3b0bc))
- Core nodeOps patch style ([ea85d7a](https://github.com/memotux/vue-plot/commit/ea85d7a))
- PlotRenderer clean up ([e9efb34](https://github.com/memotux/vue-plot/commit/e9efb34))
- NodeOps createElement obj better logic ([96900d7](https://github.com/memotux/vue-plot/commit/96900d7))
- Plot import organize ([0eb78a9](https://github.com/memotux/vue-plot/commit/0eb78a9))
- PlotRenderer slot default type may be undefined ([64cb0a2](https://github.com/memotux/vue-plot/commit/64cb0a2))
- NodeOps PlotRoot context & appendChild ([d6a401c](https://github.com/memotux/vue-plot/commit/d6a401c))
- Src index export renderer ([0c0047e](https://github.com/memotux/vue-plot/commit/0c0047e))
- Add Render.test ([10e9dd8](https://github.com/memotux/vue-plot/commit/10e9dd8))

### ❤️ Contributors

- MemoTux <romeo@mendezfuentes.net>

## v0.1.0

[compare changes](https://github.com/memotux/vue-plot/compare/006ae9d63c7d402a4fa0a0b52b4da65c916bb3eb...3062607403a736aa84c21ae4f513e8674cc8c94f)

### 🚀 Enhancements

- **components:** Plot ([4728d3b](https://github.com/memotux/vue-plot/commit/4728d3b))
- Vite build config ([66f83cf](https://github.com/memotux/vue-plot/commit/66f83cf))
- Add vitest & Plot.test ([e77708a](https://github.com/memotux/vue-plot/commit/e77708a))
- Component Plot defer render ([9f260b2](https://github.com/memotux/vue-plot/commit/9f260b2))
- Plot default slot ([994e498](https://github.com/memotux/vue-plot/commit/994e498))
- Composable usePlot ([58b8cde](https://github.com/memotux/vue-plot/commit/58b8cde))

### 🏡 Chore

- Install packages ([4483843](https://github.com/memotux/vue-plot/commit/4483843))
- Project clean up ([143dc09](https://github.com/memotux/vue-plot/commit/143dc09))
- Move Plot library to build external ([9f07945](https://github.com/memotux/vue-plot/commit/9f07945))
- Plot omit optinos marks ([909317d](https://github.com/memotux/vue-plot/commit/909317d))
- Add vitest workspace 'dom' & 'e2e' ([8042dee](https://github.com/memotux/vue-plot/commit/8042dee))
- Plot remove defer for single responsability ([25c2368](https://github.com/memotux/vue-plot/commit/25c2368))
- Plot props with defaults ([07a66be](https://github.com/memotux/vue-plot/commit/07a66be))
- Plot destructured props with default value ([00a3b44](https://github.com/memotux/vue-plot/commit/00a3b44))
- Add LICENSE MIT ([48ad7e8](https://github.com/memotux/vue-plot/commit/48ad7e8))
- Add README ([5b3506f](https://github.com/memotux/vue-plot/commit/5b3506f))
- Use unbuild package to prepack ([936398a](https://github.com/memotux/vue-plot/commit/936398a))
- Add vue plugin install function ([90e238f](https://github.com/memotux/vue-plot/commit/90e238f))
- README component local registration & typings ([c32e746](https://github.com/memotux/vue-plot/commit/c32e746))
- Composable plot docs ([ac113fb](https://github.com/memotux/vue-plot/commit/ac113fb))
- Update package name & version ([a9a5b4d](https://github.com/memotux/vue-plot/commit/a9a5b4d))
- Clean up tsconfig ([7628fb2](https://github.com/memotux/vue-plot/commit/7628fb2))
- Update README with WIP ([9f9a6b0](https://github.com/memotux/vue-plot/commit/9f9a6b0))
- Rename `main` to `index` ([659f278](https://github.com/memotux/vue-plot/commit/659f278))
- Update build options ([4c07b87](https://github.com/memotux/vue-plot/commit/4c07b87))
- Update build.config ([a48da57](https://github.com/memotux/vue-plot/commit/a48da57))
- Update README types ([b1153ee](https://github.com/memotux/vue-plot/commit/b1153ee))
- Update test import Plot path ([6a27964](https://github.com/memotux/vue-plot/commit/6a27964))
- Update Plot props types ([8940b6e](https://github.com/memotux/vue-plot/commit/8940b6e))
- Update Plot props types ([0503e08](https://github.com/memotux/vue-plot/commit/0503e08))
- Add tsconfig lib DOM ([3062607](https://github.com/memotux/vue-plot/commit/3062607))

### ❤️ Contributors

- MemoTux <romeo@mendezfuentes.net>

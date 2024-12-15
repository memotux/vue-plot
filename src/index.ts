import type { App } from "vue";
import Plot from "./components/Plot.vue";
import PlotRenderer from "./components/PlotRenderer.vue";
import { plotCustomElement } from "./core";

/**
 * Vue Plugin install function
 * @param app { App } Vue App context
 */
function VuePlot(app: App) {
  app.component('Plot', Plot)
  app.component('PlotRenderer', PlotRenderer)
}

export { Plot, PlotRenderer, VuePlot, plotCustomElement }
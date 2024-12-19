import type { App } from "vue";
import Plot from "./components/Plot.vue";
import { plotCustomElement } from "./core";

/**
 * Vue Plugin install function
 * @param app { App } Vue App context
 */
function VuePlot(app: App) {
  app.component('Plot', Plot)
}

export { Plot, VuePlot, plotCustomElement }
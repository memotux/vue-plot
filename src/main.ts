import type { App } from "vue";
import Plot from "./components/Plot.vue";
import { usePlot } from "./composable/plot.ts";

/**
 * Vue Plugin install function
 * @param app { App } Vue App context
 */
function VuePlot(app: App) {
  app.component('Plot', Plot)
}

export { Plot, usePlot, VuePlot }
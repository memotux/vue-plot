import type { PlotContext } from "src/types"

export function createPlotContext(parent: PlotContext['parent'] = null): PlotContext {
  return {
    parent,
    root: null,
    marks: []
  }
}
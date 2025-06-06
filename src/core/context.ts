import { createRenderer } from "vue"
import nodeOps from "./nodeOps";
import type { RootRenderFunction } from "vue";
import type { PlotContext } from "../types"

function createPlotApp() {
  let initialized = false
  let render: RootRenderFunction
  const ctx: Map<string, PlotContext> = new Map()
  const addPlot = (parent: PlotContext['parent'], id: string) => {
    ctx.set(id, {
      id,
      parent,
      root: {
        id,
        options: {}
      },
      marks: [],
    })
  }

  const removePlot = (id: string) => {
    ctx.delete(id)
  }

  return () => {
    if (!initialized) {
      render = createRenderer(nodeOps()).render
      initialized = true
    }

    return {
      render,
      ctx,
      addPlot,
      removePlot
    }
  }
}

export const getPlotApp = createPlotApp()
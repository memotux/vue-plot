import { createRenderer } from "vue"
import nodeOps from "./nodeOps";
import type { ShallowRef, RootRenderFunction } from "vue";
import type { PlotContext } from "src/types"

type PlotContextParent = Readonly<ShallowRef<HTMLDivElement | null>>
type PlotAppContext = Map<string, PlotContext>

function createPlotApp() {
  let initialized = false
  let render: RootRenderFunction
  const ctx: PlotAppContext = new Map()
  const setPlotCtx = (parent: PlotContextParent, id: string) => {
    ctx.set(id, {
      id,
      parent,
      root: {
        el: null,
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
      setPlotCtx,
      removePlot
    }
  }
}

export const getPlotApp = createPlotApp()
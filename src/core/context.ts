import { createRenderer, getCurrentInstance } from "vue"
import nodeOps from "./nodeOps";
import type { ShallowRef, RootRenderFunction } from "vue";
import type { PlotAppContext } from "src/types"

function createPlotApp() {
  let initialized = false
  let render: RootRenderFunction

  return (parent: Readonly<ShallowRef<HTMLDivElement | null>>, id: string) => {
    const appCtx = getCurrentInstance()?.appContext as PlotAppContext | undefined

    if (!appCtx) {
      throw new Error("Plot need to be initialized on Vue context.");
    }

    if (!initialized) {
      render = createRenderer(nodeOps()).render
      appCtx.__plot = new Map()
      initialized = true
    }

    appCtx.__plot.set(id, {
      id,
      parent,
      root: {
        el: null,
        options: {}
      },
      marks: [],
    })

    return render
  }
}

export const getPlotRender = createPlotApp()

export const unmountPlot = (id: string) => {
  const instance = getCurrentInstance()
  const plotCtx = (instance?.appContext as PlotAppContext).__plot
  plotCtx.delete(id)
}
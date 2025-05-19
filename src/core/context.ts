import type * as Plot from '@observablehq/plot'
import type { PlotMarksProps } from "src/types"

interface PlotChildrenContext {
  target: any
  obj: any
  options: Omit<PlotMarksProps, 'data'>
  data: PlotMarksProps['data']
}

type PlotRoot = (SVGSVGElement | HTMLElement) & Plot.Plot

export interface PlotContext {
  parent: HTMLElement | null
  root: PlotRoot & { _plotOptions: Plot.PlotOptions } | null
  marks: Array<PlotRoot & { _plot: PlotChildrenContext }>
}

export function createPlotContext(parent: PlotContext['parent'] = null): PlotContext {
  return {
    parent,
    root: null,
    marks: []
  }
}
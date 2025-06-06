import * as Plot from '@observablehq/plot'
import { isHTMLTag, noop } from '../utils'
import { ComponentInternalInstance, getCurrentInstance } from 'vue'
import { getPlotApp } from './context';
import type { ElementNamespace } from "vue";
import type { PlotContext, Marks, PlotProps, PlotTag, PlotMarksProps, PlotChildrenContext } from '../types';

export default function () {
  const createElement = (tag: PlotTag, _?: ElementNamespace, __?: string, props?: PlotProps) => {
    if (tag === 'template' || isHTMLTag(tag)) { return null }

    const instance = getCurrentInstance()
    const { ctx: plotCtx } = getPlotApp()
    const plotId = instance?.vnode.el?.getAttribute('data-plot-id')
    const ctx = plotCtx.get(plotId || '')

    if (!ctx) {
      throw new Error("Plot Context not initialized.");
    }

    if (tag === 'PlotRoot') {
      ctx.root.options = { ...props } as Plot.PlotOptions
      ctx.root._ctx = ctx

      return ctx.root
    }

    let name = (tag.replace('Plot', '') || 'Plot') as Marks
    name = name.replace(name[0], name[0].toLowerCase()) as Marks

    const mark = Plot[name] as PlotChildrenContext<typeof name>['mark']

    if (!mark || name === 'plot' as Marks) {
      throw new Error(
        `${name} is not defined on the PLOT namespace. Use extend to add it to the catalog.`,
      )
    }

    let data: PlotChildrenContext<typeof name>['data']
    let options: PlotChildrenContext<typeof name>['options'] = {}

    if (props) {
      const markProps = props as PlotMarksProps<typeof name>
      data = markProps.data
      delete markProps.data
      options = { ...markProps }
    }

    const plot: PlotChildrenContext<typeof name> = {
      id: plotId,
      mark,
      options,
      data,
      inserted: false,
    }

    ctx.marks.push(plot)

    return plot
  }

  const insert = (child: PlotChildrenContext<'frame'> | PlotContext['root'], parent: PlotContext['root'] | HTMLDivElement, anchor?: Element, _ctx?: PlotContext) => {
    if (!child) return null

    let ctx: PlotContext | undefined
    const instance = getCurrentInstance()

    if (!instance && _ctx) {
      ctx = _ctx
    } else {
      const id = (parent as HTMLDivElement).getAttribute?.('data-plot-id') || (parent as PlotContext['root']).id
      const { ctx: plot } = getPlotApp()
      ctx = plot.get(id || '')
    }

    if (!ctx) {
      console.error("Plot Context not defined.", (parent as HTMLDivElement).getAttribute('data-plot-id'), parent.id);
      throw new Error("Plot Context not defined.");
    }

    if (parent === ctx.root) return

    if (ctx.marks.length > 0) {
      ctx.root.options.marks = []
      for (const child of ctx.marks) {
        ctx.root.options.marks.push(child.mark(child.data, child.options))
      }
    }

    const plot = Plot.plot(ctx.root.options)

    parent = parent as HTMLDivElement

    parent.replaceChildren()

    parent.insertBefore(plot, anchor || null)
  }

  const remove = (child: Element) => {
    const parent = child.parentNode
    if (parent) {
      parent.removeChild(child)
    }
  }

  const patchProp = (node: PlotContext['marks'][0] | PlotContext['root'], prop: PlotProps | string, prevValue: any, nextValue: any, _: any, parent: ComponentInternalInstance) => {
    if (!node || !parent.vnode.el || prevValue === nextValue) return

    let ctx: PlotContext | undefined

    const { id } = node
    const instance = getCurrentInstance()

    if (!instance) {
      ctx = parent.vnode.el?._ctx
    } else {
      const { ctx: plot } = getPlotApp()
      ctx = plot.get(id || '')
    }

    if (!ctx) {
      console.error("Plot Context not exist.", id)

      throw new Error("Plot Context not exist.");
    }

    if (!ctx.parent.value) return

    /**
     * Patch Prop
     */

    const child = node as PlotContext['marks'][0]

    if (ctx.marks.includes(child)) {
      if (prop === 'data') {
        child.data = nextValue
      } else {
        // @ts-ignore
        child.options[prop] = nextValue
      }
    } else if (node === ctx.root) {
      const option = prop as keyof Plot.PlotOptions
      ctx.root.options[option] = nextValue
    } else {
      return
    }

    insert(node, ctx.parent.value)
  }

  const parentNode = (node: Element): ParentNode | null => {
    return node?.parentNode || null
  }

  const nextSibling = (node: Element) => {
    return node?.nextSibling || null
  }

  const createComment = (text: string) => { document.createComment(text) }

  return {
    insert,
    remove,
    createElement,
    patchProp,
    parentNode,
    createText: () => noop('createText'),
    createComment,
    setText: () => noop('setText'),
    setElementText: () => noop('setElementText'),
    nextSibling,
    querySelector: () => noop('querySelector'),
    setScopeId: () => noop('setScopeId'),
    cloneNode: () => noop('cloneNode'),
    insertStaticContent: () => noop('insertStaticContent'),
  }
}
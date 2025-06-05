import * as Plot from '@observablehq/plot'
import { isHTMLTag, noop } from '../utils'
import { ComponentInternalInstance, getCurrentInstance } from 'vue'
import { getPlotApp } from './context';
import type { ElementNamespace } from "vue";
import type { PlotContext, Marks, PlotProps, PlotTag, PlotMarksProps, PlotElement, PlotChildrenContext } from '../types';

type CurrentMark<M extends Marks> = PlotMarksProps<M>

type PlotMark<M extends Marks> = (data: Plot.Data | undefined, options: Omit<PlotMarksProps<M>, 'data'> | undefined) => Plot.RenderableMark

type MarkPlot<M extends Marks> = PlotElement & { __plot: PlotChildrenContext<M> }

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
      const options = { ...props } as Plot.PlotOptions

      const plot = Plot.plot(options)

      ctx.root = {
        el: plot,
        options
      }

      // Add context to PlotRoot for patchProp parent
      Object.assign(plot, { __plot: ctx })

      plot.setAttribute('data-plot-id', ctx.id)

      return ctx.root.el
    }

    let name = (tag.replace('Plot', '') || 'Plot') as Marks
    name = name.replace(name[0], name[0].toLowerCase()) as Marks

    const mark = Plot[name] as PlotMark<typeof name>

    if (!mark || name === 'plot' as Marks) {
      throw new Error(
        `${name} is not defined on the PLOT namespace. Use extend to add it to the catalog.`,
      )
    }

    let data: PlotMarksProps['data']
    let options: Omit<CurrentMark<typeof name>, 'data'> | undefined

    if (props) {
      const markProps = props as CurrentMark<typeof name>
      data = markProps.data
      delete markProps.data
      options = { ...markProps }
    }

    const plot = mark(data, options).plot(ctx.root.options) as MarkPlot<typeof name>

    Object.assign(plot, {
      __plot: {
        mark,
        options,
        data,
        inserted: false
      }
    })

    plot.setAttribute('data-plot-id', ctx.id)

    ctx.marks.push(plot)

    return plot
  }

  const insertStylessChildOnParent = (child: PlotElement, parent: PlotElement, anchor?: Element | null) => {

    const children = Array.from(child.children)

    for (const child of children) {
      if (child.tagName === 'style') continue

      parent.insertBefore(child, anchor || null)
    }
  }

  const insert = (child: PlotElement, parent: PlotElement | HTMLDivElement, anchor?: Element, _ctx?: PlotContext) => {
    if (!child) return null

    let ctx: PlotContext | undefined
    const instance = getCurrentInstance()

    if (!instance && _ctx) {
      ctx = _ctx
    } else {
      const id = parent.getAttribute('data-plot-id')
      const { ctx: plot } = getPlotApp()
      ctx = plot.get(id || '')
    }

    if (!ctx) {
      console.error(parent.getAttribute('data-plot-id'));
      throw new Error("Plot Context not defined.");
    }

    if (parent === ctx.root.el) {
      insertStylessChildOnParent(child, parent)

      // @ts-ignore
      child.__plot.inserted = true

      return
    }

    parent.replaceChildren()

    parent.insertBefore(child, anchor || null)
  }

  const remove = (child: Element) => {
    const parent = child.parentNode
    if (parent) {
      parent.removeChild(child)
    }
  }

  const patchProp = (node: PlotElement, prop: PlotProps | string, prevValue: any, nextValue: any, _: any, parent: ComponentInternalInstance) => {
    if (!node || !parent.vnode.el || prevValue === nextValue) return

    let ctx: PlotContext | undefined
    const id = node?.dataset['plot-id']
    const instance = getCurrentInstance()

    if (!instance) {
      ctx = parent.vnode.el?.__plot
    } else {
      const { ctx: plot } = getPlotApp()
      ctx = plot.get(id || '')
    }

    if (!ctx) {
      console.error(id)

      throw new Error("Plot Context not exist.");
    }

    if (!ctx.root.el || !ctx.parent.value) return

    /**
     * 1. If node is Root, regenerate Root and childrens (if exists)
     *    if marks are pass as props, Root does not have children
     * 2. If node is in childrens, regenerate only children.
     */

    /**
     * Patch Child Prop
     */

    const child = node as PlotContext['marks'][0]

    if (ctx.marks.includes(child) && child.__plot.inserted) {
      if (prop === 'data') {
        child.__plot.data = nextValue
      } else {
        // @ts-ignore
        child.__plot.options[prop] = nextValue
      }
    } else if (node === ctx.root.el) {
      const option = prop as keyof Plot.PlotOptions
      ctx.root.options[option] = nextValue
    } else {
      return
    }

    const patchPlot = Plot.plot(ctx.root.options)

    if (ctx.marks.length > 0) {
      for (const child of ctx.marks) {
        const patchChild = child.__plot.mark(child.__plot.data, child.__plot.options)
          .plot(ctx.root.options) as PlotElement

        insertStylessChildOnParent(patchChild, patchPlot)
      }
    }

    insert(patchPlot, ctx.parent.value, _, ctx)
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
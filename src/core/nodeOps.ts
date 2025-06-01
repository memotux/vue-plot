import * as Plot from '@observablehq/plot'
import { isHTMLTag, noop } from '../utils'
import { ComponentInternalInstance, getCurrentInstance, type ElementNamespace } from 'vue'
import type { PlotContext, Plots, PlotProps, PlotTag, PlotMarksProps, PlotAppContext, PlotElement } from '../types';

export default function () {
  const createElement = (tag: PlotTag, _?: ElementNamespace, __?: string, props?: PlotProps) => {
    if (tag === 'template' || isHTMLTag(tag)) { return null }

    const instance = getCurrentInstance()
    const plotCtx = (instance?.appContext as PlotAppContext)?.__plot
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

    let name = (tag.replace('Plot', '') || 'Plot') as keyof Omit<Plots, 'plot'>
    name = name.replace(name[0], name[0].toLowerCase()) as keyof Omit<Plots, 'plot'>

    const mark = Plot[name]
    if (!mark || name === 'plot' as keyof Plots) {
      throw new Error(
        `${name} is not defined on the PLOT namespace. Use extend to add it to the catalog.`,
      )
    }

    const data = (props as PlotMarksProps)?.data
    delete (props as PlotMarksProps)?.data
    const options = { ...props }

    // @ts-ignore
    const plot: PlotElement & { __plot: PlotChildrenContext; } = mark(data, options).plot(ctx.root.options)

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

  const insertStylessChildOnParent = (child: SVGElement | HTMLElement, parent: SVGElement | HTMLElement, anchor?: Element | null) => {

    const children = Array.from(child.children)

    for (const child of children) {
      if (child.tagName === 'style') continue

      parent.insertBefore(child, anchor || null)
    }
  }

  const insert = (child: SVGElement | HTMLElement, parent: SVGElement | HTMLElement, anchor?: Element, _ctx?: PlotContext) => {
    if (!child) return null

    let ctx: PlotContext | undefined
    const instance = getCurrentInstance()

    if (!instance && _ctx) {
      ctx = _ctx
    } else {
      const id = parent.getAttribute('data-plot-id')
      const plot = (instance?.appContext as PlotAppContext)?.__plot
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

  const patchProp = (node: PlotContext['marks'][0] | PlotContext['root']['el'], prop: PlotProps | string, prevValue: any, nextValue: any, _: any, parent: ComponentInternalInstance) => {
    if (!node || !parent.vnode.el || prevValue === nextValue) return

    let ctx: PlotContext | undefined
    const id = node?.dataset['plot-id']
    const instance = getCurrentInstance()

    if (!instance) {
      ctx = parent.vnode.el?.__plot
    } else {
      const plot = (instance?.appContext as PlotAppContext)?.__plot
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
          .plot(ctx.root.options) as ReturnType<Plots['plot']>

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
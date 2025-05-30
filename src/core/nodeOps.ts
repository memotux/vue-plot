import * as Plot from '@observablehq/plot'
import { isHTMLTag, noop } from '../utils'
import type { ElementNamespace } from 'vue'
import type { PlotContext, Plots, PlotProps, PlotTag, PlotMarksProps } from '../types';

export default function (ctx: PlotContext) {
  const createElement = (tag: PlotTag, _?: ElementNamespace, __?: string, props?: PlotProps) => {
    if (tag === 'template' || isHTMLTag(tag)) { return null }

    if (tag === 'PlotRoot') {
      const _plotOptions = { ...props } as Plot.PlotOptions

      const plot = Plot.plot(_plotOptions)

      ctx.root = Object.assign(plot, { _plotOptions })

      return ctx.root
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
    const plot = mark(data, options).plot(ctx.root!._plotOptions)

    plot._plot = {
      mark,
      options,
      data,
      inserted: false
    }

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

  const insert = (child: SVGElement | HTMLElement, parent: SVGElement | HTMLElement, anchor?: Element) => {
    if (!child) return null

    if (parent === ctx.root) {
      insertStylessChildOnParent(child, parent)

      // @ts-ignore
      child._plot.inserted = true

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

  const patchProp = (node: PlotContext['marks'][0] | PlotContext['root'], prop: PlotProps | string, prevValue: any, nextValue: any) => {
    if (!ctx.root || !ctx.parent || !node || prevValue === nextValue) { return }

    /**
     * 1. If node is Root, regenerate Root and childrens (if exists)
     *    if marks are pass as props, Root does not have children
     * 2. If node is in childrens, regenerate only children.
     */

    /**
     * Patch Child Prop
     */

    const child = node as PlotContext['marks'][0]

    if (ctx.marks.includes(child) && child._plot.inserted) {
      if (prop === 'data') {
        child._plot.data = nextValue
      } else {
        // @ts-ignore
        child._plot.options[prop] = nextValue
      }
    } else if (node === ctx.root) {
      const option = prop as keyof Plot.PlotOptions
      ctx.root._plotOptions[option] = nextValue
    } else {
      return
    }

    const patchPlot = Plot.plot(ctx.root._plotOptions)

    if (ctx.marks.length > 0) {
      for (const child of ctx.marks) {
        const patchChild = child._plot.mark(child._plot.data, child._plot.options)
          .plot(ctx.root._plotOptions) as ReturnType<Plots['plot']>

        insertStylessChildOnParent(patchChild, patchPlot)
      }
    }

    ctx.parent.replaceChildren(patchPlot)
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
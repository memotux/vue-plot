import * as Plot from '@observablehq/plot'
import { isHTMLTag, noop } from '../utils'
import type { ElementNamespace } from 'vue'
import type { Plots, PlotProps, PlotTag, PlotMarksProps } from '../types';
import type { PlotContext } from './context';

export default function (ctx: PlotContext) {
  const createElement = (tag: PlotTag, _?: ElementNamespace, __?: string, props?: PlotProps) => {
    if (tag === 'template' || isHTMLTag(tag)) { return null }
    if (tag === 'PlotRoot') {
      const plot = Plot.plot(props as Plot.PlotOptions)
      ctx.root = Object.assign(plot, { _plotOptions: { ...props } })

      return ctx.root
    }
    let name = (tag.replace('Plot', '') || 'Plot') as keyof Omit<Plots, 'plot'>
    name = name.replace(name[0], name[0].toLowerCase()) as keyof Omit<Plots, 'plot'>

    const target = Plot[name]
    if (!target || name === 'plot' as keyof Plots) {
      throw new Error(
        `${name} is not defined on the PLOT namespace. Use extend to add it to the catalog.`,
      )
    }

    const data = (props as PlotMarksProps)?.data
    const options = props ? { ...props, data: undefined } : undefined

    // @ts-ignore
    let obj = target(data, options)

    if (!obj) { return null }

    const plot = obj.plot(ctx.root!._plotOptions)

    plot._plot = {
      target,
      obj,
      options: { ...options },
      data: data ? { ...data } : undefined
    }

    ctx.marks.push(plot)

    return plot
  }

  const insert = (child: SVGElement | HTMLElement, parent: SVGElement | HTMLDivElement | HTMLElement, anchor?: Element) => {
    if (!child) return null

    if (parent === ctx.root) {
      const styleNode = child.querySelector('style')
      if (styleNode) {
        styleNode.remove()
      }
      const children = Array.from(child.childNodes)

      for (const child of children) {
        parent.appendChild(child)
      }

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

  const patchProp = (node: Element & { [k: string]: any }, prop: keyof Plot.PlotOptions, _: any, nextValue: any) => {
    if (!node || !nextValue || !ctx.parent) { return }

    /**
     * 1. If props is in plotRoot, regenerate Root and childrens (if exists)
     *    if marks are pass as props, Root does not have children
     * 2. If props is in childrens, regenerate only children.
     */
    if (node === ctx.root) {
      ctx.root._plotOptions[prop] = nextValue

      const patchPlot = Plot.plot(ctx.root._plotOptions)

      if (ctx.marks.length > 0) {
        for (const child of ctx.marks) {
          const patchChild = child._plot.obj.plot(ctx.root._plotOptions) as ReturnType<Plots['plot']>

          const styleNode = patchChild.querySelector('style')
          if (styleNode) {
            styleNode.remove()
          }
          const children = Array.from(patchChild.children)

          patchPlot.append(...children)
        }
      }

      ctx.parent.replaceChildren(patchPlot)
    }
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
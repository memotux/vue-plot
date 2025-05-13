import * as Plot from '@observablehq/plot'
import { patchStyle } from "./patchStyle";
import { isHTMLTag, kebabToCamel, is, noop } from '../utils'
import type { ElementNamespace } from 'vue'
import type { Plots, PlotProps, PlotTag, PlotMarksProps } from '../types';

const supportedPointerEvents = [
  'onClick',
  'onContextMenu',
  'onPointerMove',
  'onPointerEnter',
  'onPointerLeave',
  'onPointerOver',
  'onPointerOut',
  'onDoubleClick',
  'onPointerDown',
  'onPointerUp',
  'onPointerCancel',
  'onPointerMissed',
  'onLostPointerCapture',
  'onWheel',
]

let plotContext: Plot.PlotOptions = {}

function createElement(tag: PlotTag, _?: ElementNamespace, __?: string, props?: PlotProps) {
  if (tag === 'template' || isHTMLTag(tag)) { return null }
  if (tag === 'PlotRoot') {
    plotContext = Object.assign(plotContext, props)
    return Plot.plot(plotContext)
  }
  let name = (tag.replace('Plot', '') || 'Plot')
  name = name.replace(name[0], name[0].toLowerCase())

  const target = (Plot as Plots)[name as keyof Plots]
  if (!target) {
    throw new Error(
      `${name} is not defined on the PLOT namespace. Use extend to add it to the catalog.`,
    )
  }

  const data = (props as PlotMarksProps)?.data
  const options = props ? { ...props, data: undefined } : undefined
  // @ts-ignore
  let obj = target(data, options)

  if (!obj) { return null }

  return obj.plot(plotContext)
}

function insert(child: SVGElement | HTMLElement, parent: SVGElement | HTMLDivElement, anchor?: Element) {
  if (!child) return null

  if (parent.tagName === 'svg') {
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

  if (parent.tagName === 'DIV' && child.tagName === 'svg') {
    for (const child of Array.from(parent.children)) {
      if (child.tagName.toLowerCase().startsWith('plot')) {
        parent.removeChild(child)
      }
    }
  }

  parent.insertBefore(child, anchor || null)
}

function remove(child: Element) {
  const parent = child.parentNode
  if (parent) {
    parent.removeChild(child)
  }
}

function patchProp(node: Element & { [k: string]: any }, prop: string, prevValue: any, nextValue: any) {
  if (!node || !nextValue) { return }

  let root = node
  let key = prop

  let finalKey = kebabToCamel(key)
  let target = root?.[finalKey]

  // if (finalKey === 'marks') return

  // Traverse pierced props (e.g. foo-bar=value => foo.bar = value)
  if (key.includes('-') && target === undefined) {
    return
  }
  let value = nextValue
  if (value === '') { value = true }

  // if (finalKey === 'className') {
  //   if (root.tagName !== 'svg') {
  //     root[finalKey] = value
  //   }
  //   root.classList.add(value)
  //   return
  // }

  // Set prop, prefer atomic methods if applicable
  if (is.fun(target)) {
    // don't call pointer event callback functions

    if (!supportedPointerEvents.includes(prop)) {
      if (is.arr(value)) { node[finalKey](...value) }
      else { node[finalKey](value) }
    }
    // NOTE: Set on* callbacks
    // Issue: https://github.com/Tresjs/tres/issues/360
    if (finalKey.startsWith('on') && is.fun(value)) {
      root[finalKey] = value
    }
    return
  }
  if (finalKey === 'style') {
    patchStyle(root, prevValue, nextValue)
    return
  }
  // if (!target?.set && !is.fun(target)) {
  //   root.setAttribute(finalKey, value)
  // }
  if (!target?.set && !is.fun(target)) { root[finalKey] = value }
  else if (target.constructor === value.constructor && target?.copy) { target?.copy(value) }
  else if (is.arr(value)) { target.set(...value) }
  else if (!target.isColor && target.setScalar) { target.setScalar(value) }
  else { target.set(value) }
}

function parentNode(node: Element): ParentNode | null {
  return node?.parentNode || null
}

// nextSibling - Returns the next sibling of a PlotElement
function nextSibling(node: Element) {
  return node?.nextSibling || null
}

function createComment(text: string) { document.createComment(text) }

export default {
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
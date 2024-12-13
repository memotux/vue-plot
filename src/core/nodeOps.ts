import * as Plot from '@observablehq/plot'
import { patchStyle } from "./patchStyle";
import { isHTMLTag, kebabToCamel, is, noop } from '../utils'
import type { ElementNamespace } from 'vue'

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

type Plots = typeof Plot

type PlotMarks = Pick<Plots, 'area' | 'areaX' | 'areaY' | 'arrow' | 'auto' | 'axisFx' | 'axisFy' | 'axisX' | 'axisY' | 'barX' | 'barY' | 'bollinger' | 'bollingerX' | 'bollingerY' | 'boxX' | 'boxY' | 'cell' | 'cellX' | 'cellY' | 'contour' | 'crosshair' | 'crosshairX' | 'crosshairY' | 'delaunayLink' | 'delaunayMesh' | 'density' | 'differenceX' | 'differenceY' | 'dot' | 'dotX' | 'dotY' | 'frame' | 'geo' | 'geoCentroid' | 'hexgrid' | 'image' | 'line' | 'lineX' | 'lineY' | 'linearRegressionX' | 'linearRegressionY' | 'link' | 'raster' | 'rect' | 'rectX' | 'rectY' | 'ruleX' | 'ruleY' | 'text' | 'textX' | 'textY' | 'tickX' | 'tickY' | 'tip' | 'tree' | 'vector' | 'vectorX' | 'vectorY' | 'waffleX' | 'waffleY' | 'plot'>

type PlotMarksKeys = keyof PlotMarks

function createElement(tag: string, _?: ElementNamespace, __?: string, options?: (Plot.PlotOptions & { data?: Plot.Data })) {
  if (!options) { return null }

  if (tag === 'template') { return null }
  if (isHTMLTag(tag)) { return null }
  const name = (tag.replace('Plot', '').toLowerCase() || 'plot') as PlotMarksKeys

  const target = (Plot as PlotMarks)[name]
  if (!target) {
    throw new Error(
      `${name} is not defined on the PLOT namespace. Use extend to add it to the catalog.`,
    )
  }

  let obj: any

  if (name === 'plot') {
    obj = (target as PlotMarks['plot'])(options)
  } else {
    if (!options.data) return null
    // @ts-ignore
    obj = target(options.data, options)
  }

  if (!obj) { return null }

  return obj
}

function insert(child: Element, parent: Element, anchor?: Element) {
  if (!child) return null

  parent.insertBefore(child, anchor || null)
}

function remove(child: Element) {
  const parent = child.parentNode
  if (parent) {
    parent.removeChild(child)
  }
}

function patchProp(node: Element & { [k: string]: any }, prop: string, prevValue: any, nextValue: any) {
  if (!node) { return }

  let root = node
  let key = prop

  let finalKey = kebabToCamel(key)
  let target = root?.[finalKey]

  // Traverse pierced props (e.g. foo-bar=value => foo.bar = value)
  if (key.includes('-') && target === undefined) {
    // TODO: A standalone function called `resolve` is
    // available in /src/utils/index.ts. It's covered by tests.
    // Refactor below to DRY.
    const chain = key.split('-')
    target = chain.reduce((acc, key) => acc[kebabToCamel(key)], root)
    key = chain.pop() as string
    finalKey = key
    if (!target?.set) { root = chain.reduce((acc, key) => acc[kebabToCamel(key)], root) }
  }
  let value = nextValue
  if (value === '') { value = true }
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
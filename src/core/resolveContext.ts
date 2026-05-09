import { getCurrentInstance } from 'vue'
import { getPlotApp } from './context'
import type { PlotContext } from '../types'

/**
 * Resolve the PlotContext for a given plot ID.
 * Uses the shared context Map from getPlotApp().
 */
function resolveById(id: string | undefined): PlotContext | undefined {
  const { ctx } = getPlotApp()
  return ctx.get(id || '')
}

/**
 * Resolve the PlotContext using Vue's current component instance.
 * Falls back to the parent element's data-plot-id attribute.
 */
function resolveFromInstance(): PlotContext | undefined {
  const instance = getCurrentInstance()
  if (!instance) return undefined
  const plotId = instance.vnode.el?.getAttribute('data-plot-id')
  return resolveById(plotId)
}

/**
 * Unified context resolution for renderer operations.
 *
 * Resolution strategy (in order):
 * 1. If no current Vue instance and _ctx is provided → use _ctx directly
 * 2. If current instance exists → resolve via data-plot-id attribute
 * 3. Otherwise → resolve by explicit id parameter
 *
 * @param options.id - Explicit plot ID (e.g., from a mark descriptor)
 * @param options._ctx - Fallback context (e.g., from patchProp's parent.vnode.el._ctx)
 * @param options.parent - Parent element or root (for insert's data-plot-id lookup)
 * @returns The resolved PlotContext, or undefined if not found
 */
export function resolveContext(options: {
  id?: string
  _ctx?: PlotContext
  parent?: HTMLDivElement | PlotContext['root']
} = {}): PlotContext | undefined {
  const { id, _ctx, parent } = options

  // Fast path: no instance, fallback context provided
  if (!getCurrentInstance() && _ctx) {
    return _ctx
  }

  // Try current instance first (createElement, patchProp)
  const fromInstance = resolveFromInstance()
  if (fromInstance) return fromInstance

  // Try parent element's data-plot-id (insert)
  if (parent) {
    const parentId = (parent as HTMLDivElement).getAttribute?.('data-plot-id')
      || (parent as PlotContext['root']).id
    if (parentId) return resolveById(parentId)
  }

  // Try explicit id (remove, patchProp)
  if (id) return resolveById(id)

  return undefined
}

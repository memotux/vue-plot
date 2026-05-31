import { getPlotApp, getActivePlotId } from "./context";
import type { PlotContext } from "../types";

/**
 * Resolve the PlotContext for a given plot ID.
 * Uses the shared context Map from getPlotApp().
 */
function resolveById(id: string | undefined): PlotContext | undefined {
	const { ctx } = getPlotApp();
	return ctx.get(id || "");
}

/**
 * Unified context resolution for renderer operations.
 *
 * Resolution strategy (in order):
 * 1. Explicit _ctx parameter (fallback context from parent component)
 * 2. Active plot stack (replaces getCurrentInstance())
 * 3. Parent element DOM walk (for insert)
 * 4. Explicit id (for remove, patchProp)
 *
 * @param options.id - Explicit plot ID (e.g., from a mark descriptor)
 * @param options._ctx - Fallback context (e.g., from patchProp's parent.vnode.el._ctx)
 * @param options.parent - Parent element or root (for insert's data-plot-id lookup)
 * @returns The resolved PlotContext, or undefined if not found
 */
export function resolveContext(
	options: {
		id?: string;
		_ctx?: PlotContext;
		parent?: HTMLDivElement | PlotContext["root"];
	} = {},
): PlotContext | undefined {
	const { id, _ctx, parent } = options;

	// 1. Explicit _ctx always wins (fallback context from parent component)
	if (_ctx) return _ctx;

	// 2. Active plot stack (replaces getCurrentInstance for createElement)
	const activeId = getActivePlotId();
	if (activeId) {
		const fromStack = resolveById(activeId);
		if (fromStack) return fromStack;
	}

	// 3. Parent element's data-plot-id (insert)
	if (parent) {
		const parentId =
			(parent as HTMLDivElement).getAttribute?.("data-plot-id") ||
			(parent as PlotContext["root"]).id;
		if (parentId) return resolveById(parentId);
	}

	// 4. Explicit id (remove, patchProp)
	if (id) return resolveById(id);

	return undefined;
}

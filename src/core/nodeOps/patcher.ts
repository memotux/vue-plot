import type * as Plot from "@observablehq/plot";
import { nextTick } from "vue";
import { resolveContext } from "../resolveContext";
import { insert } from "./renderer";
import type { PlotContext, PlotProps, PlotChildrenContext } from "../../types";

/**
 * Removes a mark descriptor from the plot context and schedules a re-render.
 *
 * If the child is a PlotChildrenContext (mark descriptor), splices it
 * from ctx.marks and triggers a batched re-render via nextTick.
 * Otherwise falls through to standard DOM element removal.
 */
export function remove(child: Element) {
	// Check if child is a PlotChildrenContext (mark descriptor) via runtime type guard
	const maybeMark = child as unknown as PlotChildrenContext<"frame">;
	if (maybeMark && typeof maybeMark.mark === "function") {
		const ctx = resolveContext({ id: maybeMark.id });
		if (ctx) {
			const index = ctx.marks.indexOf(maybeMark);
			if (index !== -1) {
				ctx.marks.splice(index, 1);
				// Batch re-render with remaining marks
				if (ctx.parent.value && !ctx._renderQueued) {
					ctx._renderQueued = true;
					nextTick(() => {
						ctx._renderQueued = false;
						// Guard: context may have been removed during unmount
						const currentCtx = resolveContext({ id: ctx.id });
						if (currentCtx && ctx.parent.value) {
							insert(ctx.root, ctx.parent.value);
						}
					});
				}
			}
			return;
		}
	}

	// Fallback: standard DOM element removal
	const parent = child.parentNode;
	if (parent) {
		parent.removeChild(child);
	}
}

/**
 * Patches a prop change on a mark or the plot root.
 *
 * Updates the descriptor's data/options and schedules a batched
 * re-render via nextTick. If the context is not found (e.g. during
 * unmount cleanup), returns early gracefully.
 */
export function patchProp(
	node: PlotContext["marks"][0] | PlotContext["root"],
	prop: PlotProps | string,
	prevValue: any,
	nextValue: any,
) {
	if (!node || prevValue === nextValue) return;

	const { id } = node;
	const ctx = resolveContext({ id });

	// Context not found — the plot is being torn down (onUnmounted cleared the
	// context from the Map before Vue finished child cleanup). Handle gracefully.
	if (!ctx) return;

	if (!ctx.parent.value) return;

	const child = node as PlotContext["marks"][0];

	if (ctx.marks.includes(child)) {
		if (prop === "data") {
			child.data = nextValue;
		} else {
			// child.options is typed as Omit<PlotMarksProps<M>, 'data'> | {},
			// which collapses to {} (not indexable). prop is typed as
			// PlotProps | string where PlotProps = PlotOptions | PlotMarksProps
			// (object types). At runtime both are always strings and valid keys.
			(child.options as Record<string, unknown>)[prop as string] = nextValue;
		}
	} else if (node === ctx.root) {
		const option = prop as keyof Plot.PlotOptions;
		ctx.root.options[option] = nextValue;
	} else {
		return;
	}

	// Batch re-render: schedule once per tick
	if (!ctx._renderQueued) {
		ctx._renderQueued = true;
		nextTick(() => {
			ctx._renderQueued = false;
			// Guard: context may have been removed during unmount
			const currentCtx = resolveContext({ id: ctx.id });
			if (currentCtx && ctx.parent.value) {
				insert(ctx.root, ctx.parent.value);
			}
		});
	}
}

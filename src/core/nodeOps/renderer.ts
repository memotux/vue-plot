import * as Plot from "@observablehq/plot";
import { noop } from "../../utils";
import { resolveContext } from "../resolveContext";
import type { PlotChildrenContext, PlotContext } from "../../types";

/**
 * Renders the current plot's marks into the container DOM element.
 *
 * Builds the mark array from ctx.marks descriptors, calls Plot.plot()
 * with the accumulated options, and replaces the container's children
 * with the resulting SVG.
 */
export function insert(
	child: PlotChildrenContext<"frame"> | PlotContext["root"],
	parent: PlotContext["root"] | HTMLDivElement,
	anchor?: Element,
	_ctx?: PlotContext,
) {
	if (!child) return null;

	const ctx = resolveContext({ _ctx, parent });

	if (!ctx) {
		throw new Error("Plot Context not defined.");
	}

	if (parent === ctx.root) return;

	if (ctx.marks.length > 0) {
		ctx.root.options.marks = [];
		for (const child of ctx.marks) {
			ctx.root.options.marks.push(child.mark(child.data, child.options));
		}
	}

	const plot = Plot.plot(ctx.root.options);

	parent = parent as HTMLDivElement;

	parent.replaceChildren();

	parent.insertBefore(plot, anchor || null);
}

export function parentNode(node: Element): ParentNode | null {
	return node?.parentNode || null;
}

export function nextSibling(node: Element) {
	return node?.nextSibling || null;
}

export function createComment(text: string) {
	return document.createComment(text);
}

export const createText = () => noop("createText");
export const setText = () => noop("setText");
export const setElementText = () => noop("setElementText");
export const querySelector = () => noop("querySelector");
export const setScopeId = () => noop("setScopeId");
export const cloneNode = () => noop("cloneNode");
export const insertStaticContent = () => noop("insertStaticContent");

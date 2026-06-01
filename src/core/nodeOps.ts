import * as Plot from "@observablehq/plot";
import { isHTMLTag, noop, tagToMarkName } from "../utils";
import { nextTick } from "vue";
import { resolveContext } from "./resolveContext";
import type { ElementNamespace } from "vue";
import type {
	PlotContext,
	Marks,
	PlotProps,
	PlotTag,
	PlotMarksProps,
	PlotChildrenContext,
} from "../types";

export default function () {
	const createElement = (
		tag: PlotTag,
		_?: ElementNamespace,
		__?: string,
		props?: PlotProps,
	) => {
		if (tag === "template" || isHTMLTag(tag)) {
			return null;
		}

		const ctx = resolveContext();

		if (!ctx) {
			throw new Error("Plot Context not initialized.");
		}

		if (tag === "PlotRoot") {
			ctx.root.options = { ...props } as Plot.PlotOptions;
			return ctx.root;
		}

		const name = tagToMarkName(tag);

		const mark = Plot[name] as PlotChildrenContext<typeof name>["mark"];

		if (!mark || name === ("plot" as Marks)) {
			throw new Error(
				`${name} is not defined on the PLOT namespace. Use extend to add it to the catalog.`,
			);
		}

		let data: PlotChildrenContext<typeof name>["data"];
		let options: PlotChildrenContext<typeof name>["options"] = {};

		if (props) {
			const { data: markData, ...markOptions } = props as PlotMarksProps<
				typeof name
			>;
			data = markData;
			options = markOptions;
		}

		const plot: PlotChildrenContext<typeof name> = {
			id: ctx.id,
			mark,
			options,
			data,
			inserted: false,
		};

		ctx.marks.push(plot);

		return plot;
	};

	const insert = (
		child: PlotChildrenContext<"frame"> | PlotContext["root"],
		parent: PlotContext["root"] | HTMLDivElement,
		anchor?: Element,
		_ctx?: PlotContext,
	) => {
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
	};

	const remove = (child: Element) => {
		// Check if child is a PlotChildrenContext (mark descriptor) via runtime type guard
		const maybeMark = child as unknown as PlotChildrenContext<"frame">;
		if (maybeMark && typeof maybeMark.mark === "function") {
			const ctx = resolveContext({ id: maybeMark.id });
			if (ctx) {
				const index = ctx.marks.indexOf(maybeMark);
				if (index !== -1) {
					ctx.marks.splice(index, 1);
				}
				// Batch re-render with remaining marks
				if (ctx.parent.value && !ctx._renderQueued) {
					ctx._renderQueued = true;
					nextTick(() => {
						ctx._renderQueued = false;
						if (ctx.parent.value) {
							insert(ctx.root, ctx.parent.value);
						}
					});
				}
				return;
			}
		}

		// Fallback: standard DOM element removal
		const parent = child.parentNode;
		if (parent) {
			parent.removeChild(child);
		}
	};

	const patchProp = (
		node: PlotContext["marks"][0] | PlotContext["root"],
		prop: PlotProps | string,
		prevValue: any,
		nextValue: any,
	) => {
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
				// @ts-expect-error
				child.options[prop] = nextValue;
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
				if (ctx.parent.value) {
					insert(ctx.root, ctx.parent.value);
				}
			});
		}
	};

	const parentNode = (node: Element): ParentNode | null => {
		return node?.parentNode || null;
	};

	const nextSibling = (node: Element) => {
		return node?.nextSibling || null;
	};

	const createComment = (text: string) => {
		return document.createComment(text);
	};

	return {
		insert,
		remove,
		createElement,
		patchProp,
		parentNode,
		createText: () => noop("createText"),
		createComment,
		setText: () => noop("setText"),
		setElementText: () => noop("setElementText"),
		nextSibling,
		querySelector: () => noop("querySelector"),
		setScopeId: () => noop("setScopeId"),
		cloneNode: () => noop("cloneNode"),
		insertStaticContent: () => noop("insertStaticContent"),
	};
}

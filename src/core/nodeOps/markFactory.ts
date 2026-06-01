import * as Plot from "@observablehq/plot";
import { isHTMLTag, tagToMarkName } from "../../utils";
import { resolveContext } from "../resolveContext";
import type { ElementNamespace } from "vue";
import type {
	Marks,
	PlotProps,
	PlotTag,
	PlotMarksProps,
	PlotChildrenContext,
} from "../../types";

/**
 * Creates a Plot mark descriptor from a Vue custom element tag.
 *
 * Handles PlotRoot specially (returns the root context object).
 * For all other Plot* tags, looks up the corresponding Observable Plot
 * mark function, extracts data/options from props, and pushes the
 * descriptor to the current plot context.
 */
export function createElement(
	tag: PlotTag,
	_?: ElementNamespace,
	__?: string,
	props?: PlotProps,
) {
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
}

import { createRenderer } from "vue";
import nodeOps from "./nodeOps";
import type { RootRenderFunction } from "vue";
import type { PlotContext } from "../types";

function createPlotApp() {
	let initialized = false;
	let render: RootRenderFunction;
	const ctx: Map<string, PlotContext> = new Map();

	/**
	 * Active plot ID stack.
	 *
	 * Replaces getCurrentInstance() for context resolution in the custom renderer.
	 * pushActivePlotId/popActivePlotId are called around render() in Plot.vue,
	 * ensuring that createElement() can find the correct PlotContext during
	 * the synchronous VNode patch process.
	 */
	const activePlotStack: string[] = [];

	function pushActivePlotId(id: string) {
		activePlotStack.push(id);
	}

	function popActivePlotId() {
		activePlotStack.pop();
	}

	function getActivePlotId(): string | undefined {
		return activePlotStack[activePlotStack.length - 1];
	}

	const addPlot = (parent: PlotContext["parent"], id: string) => {
		ctx.set(id, {
			id,
			parent,
			root: {
				id,
				options: {},
			},
			marks: [],
			_renderQueued: false,
		});
	};

	const removePlot = (id: string) => {
		ctx.delete(id);
	};

	return () => {
		if (!initialized) {
			render = createRenderer(nodeOps()).render;
			initialized = true;
		}

		return {
			render,
			ctx,
			addPlot,
			removePlot,
			pushActivePlotId,
			popActivePlotId,
			getActivePlotId,
		};
	};
}

export const getPlotApp = createPlotApp();

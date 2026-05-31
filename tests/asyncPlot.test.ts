import { describe, it, expect } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import PlotComponent from "../src/components/Plot.vue";
import { getPlotApp } from "../src/core/context";
import { resolveContext } from "../src/core/resolveContext";

/**
 * Async plot tests: prove the custom renderer can be called from
 * async/non-component contexts without depending on Vue's
 * getCurrentInstance() internal API.
 *
 * The real benefit of removing getCurrentInstance():
 *   1. Marks get their plot ID from ctx.id (set by addPlot)
 *      instead of from the Vue instance's vnode.el attribute
 *   2. resolveContext() works with explicit id/DOM walk even
 *      when there is no active Vue component instance
 *   3. The code is simpler and doesn't depend on Vue internals
 */

describe("mark id comes from context, not from getCurrentInstance", () => {
	/**
	 * In the current code, the mark's id is set from:
	 *   getCurrentInstance()?.vnode.el?.getAttribute('data-plot-id')
	 *
	 * This is fragile because it depends on:
	 *   - getCurrentInstance() returning a valid instance
	 *   - The instance's vnode.el having a data-plot-id attribute
	 *
	 * After the fix, the mark's id comes from ctx.id, which is
	 * set by addPlot() and is always the correct plot ID.
	 *
	 * This test proves both approaches produce the same result
	 * in the happy path, but ctx.id is simpler and more reliable.
	 */
	it("mark id equals ctx.id (the plot context id)", async () => {
		const App = defineComponent({
			setup() {
				return () =>
					h(PlotComponent, null, () => [
						h("PlotFrame"),
						h("PlotText", { data: ["test"], frameAnchor: "middle" }),
					]);
			},
		});

		// Mount and wait for render
		const wrapper = mount(App, { attachTo: document.body });
		await nextTick();
		await nextTick();

		// Get the plot context after mount
		const { ctx } = getPlotApp();
		const plotId = wrapper.element.getAttribute("data-plot-id");
		expect(plotId).toBeTruthy();

		const plotCtx = ctx.get(plotId!);
		expect(plotCtx).toBeDefined();

		// All marks in this plot should have the same id as the plot context
		for (const mark of plotCtx!.marks) {
			expect(mark.id).toBe(plotCtx!.id);
		}

		wrapper.unmount();
	});
});

describe("resolveContext works without component instance", () => {
	/**
	 * This test proves that a mark's id (stored on the mark object
	 * during createElement) can be used to resolve context even
	 * when there is no active Vue component instance.
	 *
	 * This is the scenario that would occur with async components,
	 * Suspense, or any other context where getCurrentInstance()
	 * cannot be relied upon.
	 */
	it("resolves context by mark id without component instance", async () => {
		const App = defineComponent({
			setup() {
				return () =>
					h(PlotComponent, null, () => [
						h("PlotFrame"),
						h("PlotText", { data: ["resolve-me"], frameAnchor: "middle" }),
					]);
			},
		});

		const wrapper = mount(App, { attachTo: document.body });
		await nextTick();
		await nextTick();

		// Get a mark's id from the plot context
		const { ctx } = getPlotApp();
		const plotId = wrapper.element.getAttribute("data-plot-id") || "";
		const plotCtx = ctx.get(plotId);
		expect(plotCtx).toBeDefined();

		const marks = plotCtx!.marks;
		expect(marks.length).toBeGreaterThanOrEqual(1);

		// Each mark has an id — use that id to resolve the context
		// without needing getCurrentInstance()
		for (const mark of marks) {
			const resolved = resolveContext({ id: mark.id });
			expect(resolved).toBeDefined();
			expect(resolved!.id).toBe(plotId);
		}

		wrapper.unmount();
	});
});

describe("multiple plots with independent context resolution", () => {
	/**
	 * With two independent plot instances, each mark should
	 * belong to its own plot context. The mark's id should
	 * match its parent plot's context id.
	 */
	it("each plot context is correctly resolved for its own marks", async () => {
		const App = defineComponent({
			setup() {
				return () =>
					h("div", [
						h(PlotComponent, { key: "a" }, () => [
							h("PlotFrame"),
							h("PlotText", { data: ["Plot A"], frameAnchor: "middle" }),
						]),
						h(PlotComponent, { key: "b" }, () => [
							h("PlotFrame"),
							h("PlotText", { data: ["Plot B"], frameAnchor: "middle" }),
						]),
					]);
			},
		});

		const wrapper = mount(App, { attachTo: document.body });
		await nextTick();
		await nextTick();

		const { ctx } = getPlotApp();
		const allIds = Array.from(ctx.keys());

		// Find both plot contexts (last two added)
		const plotIds = allIds.slice(-2);
		expect(plotIds.length).toBe(2);

		const plotAId = plotIds[0];
		const plotBId = plotIds[1];

		const plotA = ctx.get(plotAId);
		const plotB = ctx.get(plotBId);
		expect(plotA).toBeDefined();
		expect(plotB).toBeDefined();

		// Marks in plot A should have plot A's id
		for (const mark of plotA!.marks) {
			expect(mark.id).toBe(plotAId);
		}

		// Marks in plot B should have plot B's id
		for (const mark of plotB!.marks) {
			expect(mark.id).toBe(plotBId);
		}

		wrapper.unmount();
	});
});

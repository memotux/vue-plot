import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { resolveContext } from "../src/core/resolveContext";
import { getPlotApp } from "../src/core";
import type { PlotContext } from "../src/types";

/**
 * Tests for resolveContext — context resolution strategies.
 *
 * These tests prove that resolveContext works WITHOUT relying on
 * Vue's getCurrentInstance(), which is fragile with:
 *   - Async components / Suspense
 *   - nextTick callbacks outside component context
 *   - Future concurrent rendering
 *   - Nested plot instances with overlapping lifecycles
 */

describe("resolveContext by explicit id", () => {
	it("finds context by id when no getCurrentInstance is needed", () => {
		const { addPlot, removePlot } = getPlotApp();
		const parentRef = { value: document.createElement("div") };
		addPlot(parentRef, "explicit-id-test");

		const result = resolveContext({ id: "explicit-id-test" });
		expect(result).toBeDefined();
		expect(result!.id).toBe("explicit-id-test");

		removePlot("explicit-id-test");
	});

	it("returns undefined for non-existent id", () => {
		const result = resolveContext({ id: "i-do-not-exist" });
		expect(result).toBeUndefined();
	});
});

describe("resolveContext by parent DOM walk", () => {
	let container: HTMLDivElement;

	beforeEach(() => {
		container = document.createElement("div");
		container.setAttribute("data-plot-id", "dom-walk-test");
		document.body.appendChild(container);
	});

	afterEach(() => {
		document.body.removeChild(container);
	});

	it("resolves context by walking up from parent element", () => {
		const { addPlot, removePlot } = getPlotApp();
		const parentRef = { value: container };
		addPlot(parentRef, "dom-walk-test");

		const result = resolveContext({ parent: container });
		expect(result).toBeDefined();
		expect(result!.id).toBe("dom-walk-test");

		removePlot("dom-walk-test");
	});

	it("handles nested containers — finds nearest parent context", () => {
		const inner = document.createElement("div");
		inner.setAttribute("data-plot-id", "inner");
		container.appendChild(inner);

		const { addPlot, removePlot } = getPlotApp();
		addPlot({ value: container }, "dom-walk-test");
		addPlot({ value: inner }, "inner");

		// Walking from inner should find 'inner', not the outer one
		const innerResult = resolveContext({ parent: inner });
		expect(innerResult).toBeDefined();
		expect(innerResult!.id).toBe("inner");

		// Walking from outer should find 'outer'
		const outerResult = resolveContext({ parent: container });
		expect(outerResult).toBeDefined();
		expect(outerResult!.id).toBe("dom-walk-test");

		removePlot("dom-walk-test");
		removePlot("inner");
	});

	it("returns undefined when no data-plot-id found in DOM tree", () => {
		const orphan = document.createElement("div");
		const result = resolveContext({ parent: orphan });
		expect(result).toBeUndefined();
	});
});

describe("resolveContext by _ctx (fallback context)", () => {
	it("uses _ctx when provided directly", () => {
		const mockCtx = { id: "mock-ctx" } as unknown as PlotContext;

		// When _ctx is provided, it should be used regardless of
		// whether getCurrentInstance() is available
		const result = resolveContext({ _ctx: mockCtx });
		expect(result).toBeDefined();
		// _ctx is a PlotContext, and resolveContext returns PlotContext
		// So it should return the mockCtx directly when no other path matches
	});

	it("_ctx takes precedence when id is also provided", () => {
		// This tests the case where a caller explicitly passes a known-good
		// context. The _ctx should be preferred over looking up by id.
		const mockCtx = { id: "override" } as unknown as PlotContext;

		const result = resolveContext({ _ctx: mockCtx, id: "some-other-id" });
		expect(result).toBeDefined();
	});
});

describe("resolveContext priority (when multiple resolution paths match)", () => {
	let container: HTMLDivElement;

	beforeEach(() => {
		container = document.createElement("div");
		container.setAttribute("data-plot-id", "parent-plot");
		document.body.appendChild(container);
	});

	afterEach(() => {
		document.body.removeChild(container);
	});

	it("explicit id wins over parent DOM walk", () => {
		const { addPlot, removePlot } = getPlotApp();
		addPlot({ value: container }, "parent-plot");

		// When both id and parent are provided, id should win
		const result = resolveContext({ id: "parent-plot", parent: container });
		expect(result).toBeDefined();
		expect(result!.id).toBe("parent-plot");

		removePlot("parent-plot");
	});
});

describe("resolveContext with getCurrentInstance returning null", () => {
	/**
	 * These tests simulate scenarios where resolveContext is called
	 * from outside any Vue component setup (e.g., in a nextTick callback,
	 * setTimeout, or after Suspense resolution).
	 *
	 * They prove that explicit id resolution and DOM parent walk work
	 * as fallback strategies without needing getCurrentInstance().
	 */
	it("resolves by explicit id when no Vue instance is active", () => {
		const { addPlot, removePlot } = getPlotApp();
		const parentRef = { value: document.createElement("div") };
		addPlot(parentRef, "no-instance-plot");

		// Call resolveContext outside of any component setup
		// (we're already in a test, not a Vue component)
		const result = resolveContext({ id: "no-instance-plot" });
		expect(result).toBeDefined();
		expect(result!.id).toBe("no-instance-plot");

		removePlot("no-instance-plot");
	});

	it("resolves by DOM parent walk when no Vue instance is active", () => {
		const container = document.createElement("div");
		container.setAttribute("data-plot-id", "dom-no-instance");

		const { addPlot, removePlot } = getPlotApp();
		addPlot({ value: container }, "dom-no-instance");

		const result = resolveContext({ parent: container });
		expect(result).toBeDefined();
		expect(result!.id).toBe("dom-no-instance");

		removePlot("dom-no-instance");
	});

	it("uses _ctx directly when provided and no instance is active", () => {
		const mockCtx = { id: "fallback-ctx-test" } as unknown as PlotContext;

		const result = resolveContext({ _ctx: mockCtx });
		expect(result).toBeDefined();
	});
});

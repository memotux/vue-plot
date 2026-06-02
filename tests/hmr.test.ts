import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";

// import.meta.hot is undefined in test environment (no Vite dev server).
// The HMR handler is guarded by if (import.meta.hot), so it's a dead path
// in unit tests. We verify:
// 1. Plot.vue mounts without errors (the HMR guard doesn't break anything)
// 2. Plot.vue unmounts without errors (cleanup is correct)
// 3. The HMR code path is guarded (by code review — see Plot.vue)

// Import Plot.vue after ensuring no import.meta.hot
const Plot = (await import("../src/components/Plot.vue")).default;

describe("Plot.vue — HMR guard", () => {
	it("mounts without errors even when import.meta.hot is undefined", () => {
		const wrapper = mount(Plot, {
			slots: {
				default: () => h("PlotFrame"),
			},
		});
		expect(wrapper.find("[data-plot-id]").exists()).toBe(true);
		wrapper.unmount();
	});

	it("unmounts cleanly when import.meta.hot is undefined", async () => {
		const wrapper = mount(Plot, {
			slots: {
				default: () => h("PlotFrame"),
			},
		});
		wrapper.unmount();
		// If we get here without error, the guard works
		expect(true).toBe(true);
	});

	// Note: Full HMR behavior (vite:afterUpdate handler, hmrTick bump, re-render)
	// can only be tested with a real Vite dev server. The handler is registered
	// only when import.meta.hot is defined, which doesn't happen in vitest.
});

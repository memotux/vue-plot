import { describe, it, expect } from "vitest";
import { tagToMarkName } from "../src/utils";

describe("tagToMarkName", () => {
	it("converts PlotFrame to frame", () => {
		expect(tagToMarkName("PlotFrame")).toBe("frame");
	});

	it("converts PlotText to text", () => {
		expect(tagToMarkName("PlotText")).toBe("text");
	});

	it("converts PlotDot to dot", () => {
		expect(tagToMarkName("PlotDot")).toBe("dot");
	});

	it("converts multi-word marks like PlotBarX to barX", () => {
		expect(tagToMarkName("PlotBarX")).toBe("barX");
	});

	it("converts PlotLinearRegressionX to linearRegressionX", () => {
		expect(tagToMarkName("PlotLinearRegressionX")).toBe("linearRegressionX");
	});

	it("handles Plot edge case (fallback when stripped tag is empty)", () => {
		// tag === "Plot" → withoutPrefix becomes "Plot" (falsy fallback)
		// → "plot" (caught by error check in createElement)
		expect(tagToMarkName("Plot")).toBe("plot");
	});

	it("handles PlotDelaunayLink to delaunayLink", () => {
		expect(tagToMarkName("PlotDelaunayLink")).toBe("delaunayLink");
	});

	it("handles PlotGeoCentroid to geoCentroid", () => {
		expect(tagToMarkName("PlotGeoCentroid")).toBe("geoCentroid");
	});

	it("handles PlotWaffleY to waffleY", () => {
		expect(tagToMarkName("PlotWaffleY")).toBe("waffleY");
	});
});

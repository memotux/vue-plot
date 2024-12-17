import { describe } from "vitest";
import { testComponent } from "./utils";

describe('PlotRenderer should render with props', () => {
  testComponent('PlotRendererWithProps', true)
})
describe('PlotRenderer should render with chilren', () => {
  testComponent('PlotRendererWithChildren', true)
})
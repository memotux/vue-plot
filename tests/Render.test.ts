import { describe } from "vitest";
import { testComponent } from "./utils";

describe('PlotRenderer should render with props', () => {
  testComponent('PlotRendererWithProps')
})
describe('PlotRenderer should render with chilren', () => {
  testComponent('PlotRendererWithChildren')
})
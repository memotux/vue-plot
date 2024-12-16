import type { area, areaX, areaY, arrow, auto, axisFx, axisFy, axisX, axisY, barX, barY, bollinger, bollingerX, bollingerY, boxX, boxY, cell, cellX, cellY, contour, crosshair, crosshairX, crosshairY, delaunayLink, delaunayMesh, density, differenceX, differenceY, dot, dotX, dotY, frame, geo, geoCentroid, hexgrid, hexagon, hexbin, image, line, lineX, lineY, linearRegressionX, linearRegressionY, link, raster, rect, rectX, rectY, ruleX, ruleY, text, textX, textY, tickX, tickY, tip, tree, vector, vectorX, vectorY, waffleX, waffleY, plot, AreaOptions, AreaXOptions, AreaYOptions, ArrowOptions, AutoOptions, AxisOptions, AxisXOptions, AxisYOptions, BarXOptions, BarYOptions, BarOptions, BollingerOptions, BollingerXOptions, BollingerYOptions, BoxXOptions, BoxYOptions, CellOptions, ContourOptions, CrosshairOptions, DelaunayOptions, DensityOptions, DifferenceOptions, DotOptions, DotXOptions, DotYOptions, FrameOptions, GeoOptions, HexgridOptions, HexbinOptions, ImageOptions, LineOptions, LineXOptions, LineYOptions, LinearRegressionOptions, LinearRegressionXOptions, LinearRegressionYOptions, LinkOptions, RasterOptions, RectOptions, RectXOptions, RectYOptions, RuleOptions, RuleXOptions, RuleYOptions, TextOptions, TextXOptions, TextYOptions, TickXOptions, TickYOptions, TipOptions, TreeOptions, VectorOptions, WaffleOptions, WaffleXOptions, WaffleYOptions, Data, PlotOptions, CentroidOptions } from '@observablehq/plot'
import type { DefineComponent } from "vue";

export type Plots = {
  area: typeof area,
  areaX: typeof areaX,
  areaY: typeof areaY,
  arrow: typeof arrow,
  auto: typeof auto,
  axisFx: typeof axisFx,
  axisFy: typeof axisFy,
  axisX: typeof axisX,
  axisY: typeof axisY,
  barX: typeof barX,
  barY: typeof barY,
  bollinger: typeof bollinger,
  bollingerX: typeof bollingerX,
  bollingerY: typeof bollingerY,
  boxX: typeof boxX,
  boxY: typeof boxY,
  cell: typeof cell,
  cellX: typeof cellX,
  cellY: typeof cellY,
  contour: typeof contour,
  crosshair: typeof crosshair,
  crosshairX: typeof crosshairX,
  crosshairY: typeof crosshairY,
  delaunayLink: typeof delaunayLink,
  delaunayMesh: typeof delaunayMesh,
  density: typeof density,
  differenceX: typeof differenceX,
  differenceY: typeof differenceY,
  dot: typeof dot,
  dotX: typeof dotX,
  dotY: typeof dotY,
  frame: typeof frame,
  geo: typeof geo,
  geoCentroid: typeof geoCentroid,
  hexgrid: typeof hexgrid,
  hexagon: typeof hexagon,
  hexbin: typeof hexbin,
  image: typeof image,
  line: typeof line,
  lineX: typeof lineX,
  lineY: typeof lineY,
  linearRegressionX: typeof linearRegressionX,
  linearRegressionY: typeof linearRegressionY,
  link: typeof link,
  raster: typeof raster,
  rect: typeof rect,
  rectX: typeof rectX,
  rectY: typeof rectY,
  ruleX: typeof ruleX,
  ruleY: typeof ruleY,
  text: typeof text,
  textX: typeof textX,
  textY: typeof textY,
  tickX: typeof tickX,
  tickY: typeof tickY,
  tip: typeof tip,
  tree: typeof tree,
  vector: typeof vector,
  vectorX: typeof vectorX,
  vectorY: typeof vectorY,
  waffleX: typeof waffleX,
  waffleY: typeof waffleY,
  plot: typeof plot
}

type PlotsKeys = keyof Plots

type PlotComponents = {
  [K in PlotsKeys as `Plot${Capitalize<string & K>}`]: DefineComponent<{ data?: Data, options?: PlotMarksOptions[K] }>
}

type PlotMarksOpts = AreaOptions | AreaXOptions | AreaYOptions | ArrowOptions | AutoOptions | AxisOptions | AxisXOptions | AxisYOptions | BarXOptions | BarYOptions | BarOptions | BollingerOptions | BollingerXOptions | BollingerYOptions | BoxXOptions | CellOptions | ContourOptions | CrosshairOptions | DelaunayOptions | DensityOptions | DifferenceOptions | DotOptions | DotXOptions | DotYOptions | FrameOptions | GeoOptions | CentroidOptions | HexgridOptions | HexbinOptions | ImageOptions | LineOptions | LineXOptions | LineYOptions | LinearRegressionOptions | LinearRegressionXOptions | LinearRegressionYOptions | LinkOptions | RasterOptions | RectOptions | RectXOptions | RectYOptions | RuleOptions | RuleXOptions | RuleYOptions | TextOptions | TextXOptions | TextYOptions | TickXOptions | TickYOptions | TipOptions | TreeOptions | VectorOptions | WaffleOptions | WaffleXOptions | WaffleYOptions

interface PlotMarksOptions {
  area: AreaOptions
  areaX: AreaXOptions
  areaY: AreaYOptions
  arrow: ArrowOptions
  auto: AutoOptions
  axis: AxisOptions
  axisX: AxisXOptions
  axisY: AxisYOptions
  axisFx: AxisXOptions
  axisFy: AxisYOptions
  barX: BarXOptions
  barY: BarYOptions
  bar: BarOptions
  bollinger: BollingerOptions
  bollingerX: BollingerXOptions
  bollingerY: BollingerYOptions
  boxX: BoxXOptions
  boxY: BoxYOptions
  cell: CellOptions
  cellX: CellOptions
  cellY: CellOptions
  contour: ContourOptions
  crosshair: CrosshairOptions
  crosshairX: CrosshairOptions
  crosshairY: CrosshairOptions
  delaunay: DelaunayOptions
  delaunayLink: DelaunayOptions
  delaunayMesh: DelaunayOptions
  density: DensityOptions
  difference: DifferenceOptions
  differenceX: DifferenceOptions
  differenceY: DifferenceOptions
  dot: DotOptions
  dotX: DotXOptions
  dotY: DotYOptions
  frame: FrameOptions
  geo: GeoOptions
  geoCentroid: CentroidOptions
  hexagon: Exclude<DotOptions, "symbol">
  hexgrid: HexgridOptions
  hexbin: HexbinOptions
  image: ImageOptions
  line: LineOptions
  lineX: LineXOptions
  lineY: LineYOptions
  linearRegression: LinearRegressionOptions
  linearRegressionX: LinearRegressionXOptions
  linearRegressionY: LinearRegressionYOptions
  link: LinkOptions
  raster: RasterOptions
  rect: RectOptions
  rectX: RectXOptions
  rectY: RectYOptions
  rule: RuleOptions
  ruleX: RuleXOptions
  ruleY: RuleYOptions
  text: TextOptions
  textX: TextXOptions
  textY: TextYOptions
  tickX: TickXOptions
  tickY: TickYOptions
  tip: TipOptions
  tree: TreeOptions
  vector: VectorOptions
  vectorX: VectorOptions
  vectorY: VectorOptions
  waffle: WaffleOptions
  waffleX: WaffleXOptions
  waffleY: WaffleYOptions
  plot: PlotOptions
}

export type PlotTag = `Plot${Capitalize<keyof Plots>}` | 'PlotRoot' | 'template'

export type PlotProps = PlotOptions | { data: Data, options: PlotMarksOpts }

declare module 'vue' {
  export interface GlobalComponents extends PlotComponents { }
}
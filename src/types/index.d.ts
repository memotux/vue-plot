import {
	AreaOptions,
	AreaXOptions,
	AreaYOptions,
	ArrowOptions,
	AutoOptions,
	AxisYOptions,
	AxisXOptions,
	BarXOptions,
	BarYOptions,
	BollingerOptions,
	BollingerXOptions,
	BollingerYOptions,
	BoxXOptions,
	BoxYOptions,
	CellOptions,
	ContourOptions,
	CrosshairOptions,
	DelaunayOptions,
	DensityOptions,
	DifferenceOptions,
	DotOptions,
	DotXOptions,
	DotYOptions,
	FrameOptions,
	GeoOptions,
	CentroidOptions,
	HexgridOptions,
	HexbinOptions,
	ImageOptions,
	LineOptions,
	LineXOptions,
	LineYOptions,
	LinearRegressionXOptions,
	LinearRegressionYOptions,
	LinkOptions,
	RasterOptions,
	RectOptions,
	RectXOptions,
	RectYOptions,
	RuleXOptions,
	RuleYOptions,
	TextOptions,
	TextXOptions,
	TextYOptions,
	TickXOptions,
	TickYOptions,
	TipOptions,
	TreeOptions,
	VectorOptions,
	WaffleXOptions,
	WaffleYOptions,
	Data,
	PlotOptions,
	RenderableMark,
} from "@observablehq/plot";
import { DefineComponent, ShallowRef } from "vue";

export type Marks =
	| "area"
	| "areaX"
	| "areaY"
	| "arrow"
	| "auto"
	| "axisFx"
	| "axisFy"
	| "axisX"
	| "axisY"
	| "barX"
	| "barY"
	| "bollinger"
	| "bollingerX"
	| "bollingerY"
	| "boxX"
	| "boxY"
	| "cell"
	| "cellX"
	| "cellY"
	| "contour"
	| "crosshair"
	| "crosshairX"
	| "crosshairY"
	| "delaunayLink"
	| "delaunayMesh"
	| "density"
	| "differenceX"
	| "differenceY"
	| "dot"
	| "dotX"
	| "dotY"
	| "frame"
	| "geo"
	| "geoCentroid"
	| "hexgrid"
	| "hexagon"
	| "hexbin"
	| "image"
	| "line"
	| "lineX"
	| "lineY"
	| "linearRegressionX"
	| "linearRegressionY"
	| "link"
	| "raster"
	| "rect"
	| "rectX"
	| "rectY"
	| "ruleX"
	| "ruleY"
	| "text"
	| "textX"
	| "textY"
	| "tickX"
	| "tickY"
	| "tip"
	| "tree"
	| "vector"
	| "vectorX"
	| "vectorY"
	| "waffleX"
	| "waffleY";

type MarksOptions = {
	area: AreaOptions;
	areaX: AreaXOptions;
	areaY: AreaYOptions;
	arrow: ArrowOptions;
	auto: AutoOptions;
	axisX: AxisXOptions;
	axisY: AxisYOptions;
	axisFx: AxisXOptions;
	axisFy: AxisYOptions;
	barX: BarXOptions;
	barY: BarYOptions;
	bollinger: BollingerOptions;
	bollingerX: BollingerXOptions;
	bollingerY: BollingerYOptions;
	boxX: BoxXOptions;
	boxY: BoxYOptions;
	cell: CellOptions;
	cellX: CellOptions;
	cellY: CellOptions;
	contour: ContourOptions;
	crosshair: CrosshairOptions;
	crosshairX: CrosshairOptions;
	crosshairY: CrosshairOptions;
	delaunayLink: DelaunayOptions;
	delaunayMesh: DelaunayOptions;
	density: DensityOptions;
	differenceX: DifferenceOptions;
	differenceY: DifferenceOptions;
	dot: DotOptions;
	dotX: DotXOptions;
	dotY: DotYOptions;
	frame: FrameOptions;
	geo: GeoOptions;
	geoCentroid: CentroidOptions;
	hexagon: Omit<DotOptions, "symbol">;
	hexgrid: HexgridOptions;
	hexbin: HexbinOptions;
	image: ImageOptions;
	line: LineOptions;
	lineX: LineXOptions;
	lineY: LineYOptions;
	linearRegressionX: LinearRegressionXOptions;
	linearRegressionY: LinearRegressionYOptions;
	link: LinkOptions;
	raster: RasterOptions;
	rect: RectOptions;
	rectX: RectXOptions;
	rectY: RectYOptions;
	ruleX: RuleXOptions;
	ruleY: RuleYOptions;
	text: TextOptions;
	textX: TextXOptions;
	textY: TextYOptions;
	tickX: TickXOptions;
	tickY: TickYOptions;
	tip: TipOptions;
	tree: TreeOptions;
	vector: VectorOptions;
	vectorX: VectorOptions;
	vectorY: VectorOptions;
	waffleX: WaffleXOptions;
	waffleY: WaffleYOptions;
};

type PlotComponents = {
	[K in Marks as `Plot${Capitalize<string & K>}`]: DefineComponent<
		{ data?: Data } & MarksOptions[K]
	>;
};

export type PlotTag = `Plot${Capitalize<Marks>}` | "PlotRoot" | "template";

export type PlotMarksProps<M extends Marks = "frame"> = {
	data?: Data;
} & MarksOptions[M];

export type PlotProps = PlotOptions | PlotMarksProps;

declare module "vue" {
	export interface GlobalComponents extends PlotComponents {}
}

export interface PlotChildrenContext<M extends Marks> {
	mark: (
		data: Data | undefined,
		options: Omit<PlotMarksProps<M>, "data"> | undefined,
	) => RenderableMark;
	options: Omit<PlotMarksProps<M>, "data"> | {};
	data: PlotMarksProps<M>["data"];
	inserted: boolean;
	id: string;
}

export interface PlotContext {
	id: string;
	parent: Readonly<ShallowRef<HTMLDivElement | null>>;
	root: {
		id: string;
		options: PlotOptions;
		_ctx?: PlotContext;
	};
	marks: Array<PlotChildrenContext<"frame">>;
	_renderQueued: boolean;
}

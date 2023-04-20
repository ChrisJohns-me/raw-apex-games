import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { environment } from "@app/../environments/environment.js";
import { MatchMapCoordinates } from "@app/models/match/map/map-coordinates.js";
import { MatchMap } from "@app/models/match/map/match-map.js";
import * as d3 from "d3";
import { combineLatest, Subject } from "rxjs";
import { takeUntil, throttleTime } from "rxjs/operators";

type MatchMapImageAxisScale = NonNullable<MatchMap["chartConfig"]>["imageAxisScale"];

@Component({
    selector: "app-map-heatmap",
    templateUrl: "./map-heatmap.component.html",
    styleUrls: ["./map-heatmap.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapHeatmapComponent implements OnInit, AfterViewInit, OnDestroy {
    public ENABLE_DEBUG_TOOLS = environment.DEV && true;
    //#region Inputs
    @Input()
    public get map(): Optional<MatchMap> {
        return this._map;
    }
    public set map(value: Optional<MatchMap>) {
        this._map = value;
        this.isLoadingMapImage = true;
        this.drawAllGraphs();
        if (this.ENABLE_DEBUG_TOOLS) this.refreshMapDebugTools();
    }
    @Input()
    public get primaryCoordinates(): MatchMapCoordinates[] {
        return this._primaryCoordinates;
    }
    public set primaryCoordinates(value: MatchMapCoordinates[]) {
        this._primaryCoordinates = value;
        this.initGraph();
        this.drawAllGraphs();
        this.refreshUI();
    }
    @Input()
    public get secondaryCoordinates(): MatchMapCoordinates[] {
        return this._secondaryCoordinates;
    }
    public set secondaryCoordinates(value: MatchMapCoordinates[]) {
        this._secondaryCoordinates = value;
        this.initGraph();
        this.drawAllGraphs();
        this.refreshUI();
    }
    //#endregion

    @ViewChild("mapOverlayGraphPrimary")
    public set mapOverlayGraphRefPrimary(value: Optional<ElementRef<HTMLDivElement>>) {
        this._mapOverlayGraphRefPrimary = value;
        this.initGraph();
    }
    public get mapOverlayGraphRefPrimary(): Optional<ElementRef<HTMLDivElement>> {
        return this._mapOverlayGraphRefPrimary;
    }
    private _mapOverlayGraphRefPrimary: Optional<ElementRef<HTMLDivElement>>;

    @ViewChild("mapOverlayGraphSecondary")
    public set mapOverlayGraphRefSecondary(value: Optional<ElementRef<HTMLDivElement>>) {
        this._mapOverlayGraphRefSecondary = value;
        this.initGraph();
    }
    public get mapOverlayGraphRefSecondary(): Optional<ElementRef<HTMLDivElement>> {
        return this._mapOverlayGraphRefSecondary;
    }
    private _mapOverlayGraphRefSecondary: Optional<ElementRef<HTMLDivElement>>;

    public get isLoadingMapImage(): boolean {
        return this._isLoadingMapImage;
    }
    public set isLoadingMapImage(value: boolean) {
        this._isLoadingMapImage = value;
        this.refreshUI();
    }

    // Debug
    public showMapDebugToolsForm = new UntypedFormControl(false);
    public heatSizeRange;
    public xShiftRangeForm = new UntypedFormControl(0);
    public xStartRangeForm = new UntypedFormControl(-600);
    public xEndRangeForm = new UntypedFormControl(600);
    public yShiftRangeForm = new UntypedFormControl(0);
    public yStartRangeForm = new UntypedFormControl(-600);
    public yEndRangeForm = new UntypedFormControl(600);

    // Graph
    private graphSvgPrimary?: d3.Selection<SVGGElement, unknown, null, undefined>;
    private graphSvgSecondary?: d3.Selection<SVGGElement, unknown, null, undefined>;
    private graphResolutionX = 720;
    private graphResolutionY = 720;
    private graphHeatSize = 4;
    private graphHeatAlpha = 0.25;
    private graphThreshold = 10;

    private _map: Optional<MatchMap>;
    private _primaryCoordinates: MatchMapCoordinates[] = [];
    private _secondaryCoordinates: MatchMapCoordinates[] = [];
    private _isLoadingMapImage = false;
    /** Num rows to add when user reaches the bottom of the scroll */
    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef) {
        this.heatSizeRange = new UntypedFormControl(this.graphHeatSize);
    }

    public getMapFilename = MatchMap.getLayoutFilename;

    //#region Lifecycle Methods
    public ngOnInit(): void {
        if (this.ENABLE_DEBUG_TOOLS) this.setupDebug();
    }

    public ngAfterViewInit(): void {
        this.initGraph();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
    //#endregion

    private initGraph(): void {
        if (this.graphSvgPrimary || this.graphSvgSecondary) {
            console.log(`[MapHeatmapComponent] initGraph(): Graph already initialized; skipping`);
            return;
        }
        if (!this.mapOverlayGraphRefPrimary?.nativeElement || !this.mapOverlayGraphRefSecondary?.nativeElement) return;
        this.graphSvgPrimary = d3
            .select(this.mapOverlayGraphRefPrimary.nativeElement)
            .append("svg")
            .attr("viewBox", `0 0 ${this.graphResolutionX} ${this.graphResolutionY}`) as any;
        this.graphSvgSecondary = d3
            .select(this.mapOverlayGraphRefSecondary.nativeElement)
            .append("svg")
            .attr("viewBox", `0 0 ${this.graphResolutionX} ${this.graphResolutionY}`) as any;
    }

    private drawAllGraphs(customImageAxisScale?: MatchMapImageAxisScale, customHeatSize?: number): void {
        const colorPrimary = d3.scaleLinear(
            [0, 0.5, 1],
            [
                `rgba(0, 128, 0, ${this.graphHeatAlpha})`,
                `rgba(255, 255, 0, ${this.graphHeatAlpha})`,
                `rgba(255, 0, 0, ${this.graphHeatAlpha})`,
            ]
        );
        const colorSecondary = d3.scaleLinear(
            [0, 1],
            [`rgba(255, 0, 0, ${this.graphHeatAlpha})`, `rgba(255, 0, 0, ${this.graphHeatAlpha})`]
        );
        this.drawGraph(
            this.mapOverlayGraphRefPrimary,
            this.graphSvgPrimary,
            colorPrimary,
            this.primaryCoordinates,
            customImageAxisScale,
            customHeatSize
        );
        this.drawGraph(
            this.mapOverlayGraphRefSecondary,
            this.graphSvgSecondary,
            colorSecondary,
            this.secondaryCoordinates,
            customImageAxisScale,
            customHeatSize
        );
    }

    private drawGraph(
        elementRef: Optional<ElementRef<HTMLDivElement>>,
        d3SvgElement: Optional<d3.Selection<SVGGElement, unknown, null, undefined>>,
        d3Color: d3.ScaleLinear<string, string, never>,
        coordinates: MatchMapCoordinates[],
        customImageAxisScale?: MatchMapImageAxisScale,
        customHeatSize?: number
    ): void {
        if (!elementRef?.nativeElement) return void console.log(`[MapHeatmapComponent] drawGraph(): Map graph element was not found.`);

        const xStart = customImageAxisScale?.xStart ?? this.map?.chartConfig?.imageAxisScale?.xStart ?? -500,
            xEnd = customImageAxisScale?.xEnd ?? this.map?.chartConfig?.imageAxisScale?.xEnd ?? 500,
            yStart = customImageAxisScale?.yStart ?? this.map?.chartConfig?.imageAxisScale?.yStart ?? -500,
            yEnd = customImageAxisScale?.yEnd ?? this.map?.chartConfig?.imageAxisScale?.yEnd ?? 500;

        // clear the graph
        d3SvgElement?.selectAll("g").remove();

        // read data
        const x = d3 // Add X axis
            .scaleLinear()
            .domain([xStart, xEnd])
            .range([0, this.graphResolutionX]);

        const y = d3 // Add Y axis
            .scaleLinear()
            .domain([yStart, yEnd])
            .range([this.graphResolutionY, 0]);

        // compute the density data
        const densityData = d3
            .contourDensity()
            .x((d) => x((d as any)["x"]))
            .y((d) => y((d as any)["y"]))
            .size([this.graphResolutionX, this.graphResolutionY])
            .bandwidth(customHeatSize ?? this.graphHeatSize)(coordinates as any);

        // show the shape
        d3SvgElement
            ?.insert("g", "g")
            .selectAll("path")
            .data(densityData)
            .enter()
            .append("path")
            .attr("d", d3.geoPath())
            .attr("fill", (d) => d3Color(d.value));
    }

    private refreshUI(): void {
        this.cdr.detectChanges();
    }

    //#region Debug Tools
    private setupDebug(): void {
        console.warn(`Match Map DEBUG Enabled`);
        combineLatest([
            this.xShiftRangeForm.valueChanges,
            this.xStartRangeForm.valueChanges,
            this.xEndRangeForm.valueChanges,
            this.yShiftRangeForm.valueChanges,
            this.yStartRangeForm.valueChanges,
            this.yEndRangeForm.valueChanges,
            this.heatSizeRange.valueChanges,
        ])
            .pipe(takeUntil(this.destroy$), throttleTime(10))
            .subscribe(([xShift, xStart, xEnd, yShift, yStart, yEnd, heatSize]) => {
                const imageAxisScale = { xStart: xStart + xShift, xEnd: xEnd + xShift, yStart: yStart + yShift, yEnd: yEnd + yShift };
                this.graphHeatSize = heatSize;
                this.drawAllGraphs(imageAxisScale, heatSize);
            });
    }

    private refreshMapDebugTools(): void {
        this.xShiftRangeForm.setValue(0);
        this.xStartRangeForm.setValue(this.map?.chartConfig?.imageAxisScale?.xStart ?? -500);
        this.xEndRangeForm.setValue(this.map?.chartConfig?.imageAxisScale?.xEnd ?? 500);
        this.yShiftRangeForm.setValue(0);
        this.yStartRangeForm.setValue(this.map?.chartConfig?.imageAxisScale?.yStart ?? -500);
        this.yEndRangeForm.setValue(this.map?.chartConfig?.imageAxisScale?.yEnd ?? 500);
    }
    //#endregion
}

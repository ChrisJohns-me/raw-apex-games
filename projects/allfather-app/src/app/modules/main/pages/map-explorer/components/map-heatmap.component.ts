import { MatchMapCoordinates } from "@allfather-app/app/common/match/map/map-coordinates";
import { MatchMap } from "@allfather-app/app/common/match/map/match-map";
import { environment } from "@allfather-app/environments/environment";
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
import { FormControl } from "@angular/forms";
import * as d3 from "d3";
import { combineLatest, Subject } from "rxjs";
import { distinctUntilChanged, takeUntil, throttleTime } from "rxjs/operators";

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
        this.drawGraph();
        if (this.ENABLE_DEBUG_TOOLS) this.refreshMapDebugTools();
    }
    @Input()
    public get coordinates(): MatchMapCoordinates[] {
        return this._coordinates;
    }
    public set coordinates(value: MatchMapCoordinates[]) {
        this._coordinates = value;
        this.drawGraph();
        this.refreshUI();
    }
    //#endregion

    @ViewChild("mapOverlayGraph") public mapOverlayGraphRef?: ElementRef<HTMLDivElement>;
    public get isLoadingMapImage(): boolean {
        return this._isLoadingMapImage;
    }
    public set isLoadingMapImage(value: boolean) {
        this._isLoadingMapImage = value;
        this.refreshUI();
    }

    // Form inputs
    public locationHistoryRange = new FormControl(1000);

    // Debug
    public showMapDebugToolsForm = new FormControl(false);
    public heatSizeRange;
    public xShiftRangeForm = new FormControl(0);
    public xStartRangeForm = new FormControl(-600);
    public xEndRangeForm = new FormControl(600);
    public yShiftRangeForm = new FormControl(0);
    public yStartRangeForm = new FormControl(-600);
    public yEndRangeForm = new FormControl(600);

    // Graph
    private graphSvg?: d3.Selection<SVGGElement, unknown, null, undefined>;
    private graphResolutionX = 720;
    private graphResolutionY = 720;
    private heatSize = 4;
    private heatAlpha = 0.25;

    private _map: Optional<MatchMap>;
    private _coordinates: MatchMapCoordinates[] = [];
    private _isLoadingMapImage = false;
    /** Num rows to add when user reaches the bottom of the scroll */
    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef) {
        this.heatSizeRange = new FormControl(this.heatSize);
    }

    public getMapFilename = MatchMap.getLayoutFilename;

    //#region Lifecycle Methods
    public ngOnInit(): void {
        this.setupEventListeners();
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

    //#region Setup
    private setupEventListeners(): void {
        // Timeline slider changed
        this.locationHistoryRange.valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged()).subscribe(() => {
            this.drawGraph();
            this.refreshUI();
        });
    }
    //#endregion

    //#region Low Order Functions
    private initGraph(): void {
        if (!this.mapOverlayGraphRef?.nativeElement) return;
        this.graphSvg = d3
            .select(this.mapOverlayGraphRef.nativeElement)
            .append("svg")
            .attr("viewBox", `0 0 ${this.graphResolutionX} ${this.graphResolutionY}`) as any;
    }

    private drawGraph(customImageAxisScale?: MatchMapImageAxisScale, customHeatSize?: number): void {
        if (!this.mapOverlayGraphRef?.nativeElement) return void console.error(`Map graph element was not found.`);

        const maxHistory = this.locationHistoryRange?.value;
        const coordinates = this.coordinates.slice(0, maxHistory) ?? [];

        const xStart = customImageAxisScale?.xStart ?? this.map?.chartConfig?.imageAxisScale?.xStart ?? -500,
            xEnd = customImageAxisScale?.xEnd ?? this.map?.chartConfig?.imageAxisScale?.xEnd ?? 500,
            yStart = customImageAxisScale?.yStart ?? this.map?.chartConfig?.imageAxisScale?.yStart ?? -500,
            yEnd = customImageAxisScale?.yEnd ?? this.map?.chartConfig?.imageAxisScale?.yEnd ?? 500;

        // clear the graph
        this.graphSvg?.selectAll("g").remove();

        // read data
        const x = d3 // Add X axis
            .scaleLinear()
            .domain([xStart, xEnd])
            .range([0, this.graphResolutionX]);

        const y = d3 // Add Y axis
            .scaleLinear()
            .domain([yStart, yEnd])
            .range([this.graphResolutionY, 0]);

        const color = d3.scaleLinear(
            [0, 0.5, 1],
            [`rgba(0, 128, 0, ${this.heatAlpha})`, `rgba(255, 255, 0, ${this.heatAlpha})`, `rgba(255, 0, 0, ${this.heatAlpha})`]
        );

        // compute the density data
        const densityData = d3
            .contourDensity()
            .x((d) => x((d as any)["x"]))
            .y((d) => y((d as any)["y"]))
            .size([this.graphResolutionX, this.graphResolutionY])
            .bandwidth(customHeatSize ?? this.heatSize)(coordinates as any);

        // show the shape
        this.graphSvg
            ?.insert("g", "g")
            .selectAll("path")
            .data(densityData)
            .enter()
            .append("path")
            .attr("d", d3.geoPath())
            .attr("fill", (d) => color(d.value));
    }

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
    //#endregion

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
                this.heatSize = heatSize;
                this.drawGraph(imageAxisScale, heatSize);
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

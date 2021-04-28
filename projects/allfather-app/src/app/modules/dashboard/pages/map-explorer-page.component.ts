import { MatchGameMode } from "@allfather-app/app/shared/models/match/game-mode";
import { MatchMap } from "@allfather-app/app/shared/models/match/map";
import { MatchMapCoordinates } from "@allfather-app/app/shared/models/match/map-coordinates";
import { MatchMapList, MatchMapName } from "@allfather-app/app/shared/models/match/map-list";
import { environment } from "@allfather-app/environments/environment";
import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    TrackByFunction,
    ViewChild,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import * as d3 from "d3";
import { intervalToDuration } from "date-fns";
import { combineLatest, Subject } from "rxjs";
import { filter, map, takeUntil, throttleTime } from "rxjs/operators";
import { isEmpty } from "shared/utilities";
import { unique } from "shared/utilities/primitives/array";
import { MatchDataStore } from "../../core/local-database/match-data-store";
import { MatchMapService } from "../../core/match/match-map.service";
import { MatchPlayerLocationService } from "../../core/match/match-player-location.service";
import { MatchService } from "../../core/match/match.service";
import { ReportingEngineId, ReportingStatus } from "../../core/reporting/reporting-engine/reporting-engine";
import { ReportingService } from "../../core/reporting/reporting.service";

type MatchMapImageAxixScale = NonNullable<MatchMap["chartConfig"]>["imageAxisScale"];

@Component({
    selector: "app-map-explorer-page",
    templateUrl: "./map-explorer-page.component.html",
    styleUrls: ["./map-explorer-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapExplorerPageComponent implements OnInit, AfterViewInit, OnDestroy, AfterContentInit {
    public ENABLE_DEBUG_TOOLS = environment.DEV && true; // Debug tools
    @ViewChild("mapOverlayGraph") public mapOverlayGraph?: ElementRef<HTMLDivElement>;

    public get isShowingLiveMatch(): boolean {
        return !this.selectedMap;
    }
    public get isShowingAggregateData(): boolean {
        return !!this.selectedMap && !this.selectedMatch;
    }
    public isMapImageLoaded = false;
    public mapList: MatchMap[];
    public selectedMapMatchList: MatchDataStore[] = [];
    public get matchList(): MatchDataStore[] {
        return this._matchList;
    }
    public set matchList(value: MatchDataStore[]) {
        this._matchList = value;
        this.isMapImageLoaded = false;
        this.refreshSelectedMapMatchList();
    }
    /** If empty, show Live Match */
    public get selectedMap(): Optional<MatchMap> {
        return this._selectedMap;
    }
    public set selectedMap(value: Optional<MatchMap>) {
        this._selectedMap = value;
        this.refreshSelectedMapMatchList();
    }
    public get coordinateData(): MatchMapCoordinates[] | undefined {
        if (this.isShowingLiveMatch) return this.liveMatchLocationHistory;
        else if (this.isShowingAggregateData) return this.aggregateMapLocationHistory;
        else return this.selectedMatch?.locationHistory.map((location) => location.value);
    }

    /** If empty, show aggregate of selectedMap */
    public selectedMatch?: MatchDataStore;
    public liveMap?: MatchMap;

    // Form inputs
    public followLiveLocation = false;
    public locationHistoryRange = new FormControl(1000);

    // Debug
    public showMapDebugToolsForm = new FormControl(false);
    public heatSizeRange;
    public xShiftRangeForm = new FormControl(0);
    public xStartRangeForm = new FormControl(-500);
    public xEndRangeForm = new FormControl(500);
    public yShiftRangeForm = new FormControl(0);
    public yStartRangeForm = new FormControl(-500);
    public yEndRangeForm = new FormControl(500);

    // Graph
    private graphSvg?: d3.Selection<SVGGElement, unknown, null, undefined>;
    private graphResolutionX = 720;
    private graphResolutionY = 720;
    private heatSize = 4;
    private heatAlpha = 0.25;

    private liveMatchLocationHistory: MatchMapCoordinates[] = [];
    private aggregateMapLocationHistory: MatchMapCoordinates[] = [];
    private _matchList: MatchDataStore[] = [];
    private _selectedMap?: MatchMap;
    private isDestroyed$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly match: MatchService,
        private readonly matchMap: MatchMapService,
        private readonly matchPlayerLocation: MatchPlayerLocationService,
        private readonly reportingService: ReportingService
    ) {
        this.heatSizeRange = new FormControl(this.heatSize);
        this.mapList = unique(
            MatchMapList.filter((m) => m.mapName !== MatchMapName.FiringRange),
            (m) => m.mapName
        ).sort((a, b) => {
            if (a.mapName < b.mapName) return -1;
            if (a.mapName > b.mapName) return 1;
            return 0;
        });
    }

    public matchTrackBy: TrackByFunction<MatchDataStore> = (_, item): string => item.matchId;
    public durationSinceNow = (baseDate: Date): Duration => intervalToDuration({ start: baseDate, end: new Date() });
    public getGameModeTypeName = (gameModeId: string): Optional<string> => new MatchGameMode(gameModeId).baseType;

    public loaded(): void {
        console.log("Loaded");
    }
    public unloaded(): void {
        console.log("Unloaded");
    }
    public changed(): void {
        console.log("Changed");
    }

    //#region Lifecycle Methods
    public ngOnInit(): void {
        this.setupLiveMatchListeners();
    }

    public ngAfterContentInit(): void {
        this.setLiveMatch();
    }

    public ngAfterViewInit(): void {
        this.initGraph();
        this.setupEventListeners();
        this.loadMatchList();
        if (this.ENABLE_DEBUG_TOOLS) this.setupDebug();
    }

    public ngOnDestroy(): void {
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
    }
    //#endregion

    public onLiveMatchClick(): void {
        this.setLiveMatch();
    }

    public onSelectMatchClick(match?: MatchDataStore): void {
        this.followLiveLocation = false;
        this.locationHistoryRange.enable();
        this.setSelectedMatch(match);
    }

    public onSelectMapClick(map?: MatchMap): void {
        this.followLiveLocation = false;
        this.setSelectedMap(map);
        this.setSelectedMatch(undefined);
    }

    //#region Setup
    private setupEventListeners(): void {
        // Timeline slider changed
        this.locationHistoryRange.valueChanges.pipe(takeUntil(this.isDestroyed$)).subscribe(() => this.refreshGraph());
    }

    private setupLiveMatchListeners(): void {
        // Match started event
        this.match.startedEvent$.pipe(takeUntil(this.isDestroyed$)).subscribe(() => {
            this.liveMatchLocationHistory = [];
            this.refreshGraph();
        });

        // New match was reported to local database
        this.reportingService.reportingEvent$
            .pipe(
                takeUntil(this.isDestroyed$),
                filter((reportingEvent) => reportingEvent.engine.engineId === ReportingEngineId.Local),
                filter((localReportingStatus) => localReportingStatus.status === ReportingStatus.SUCCESS)
            )
            .subscribe(() => this.loadMatchList());

        // New player coordinates
        this.matchPlayerLocation.myCoordinates$.pipe(takeUntil(this.isDestroyed$)).subscribe((coordinates) => {
            if (!coordinates) return;
            this.liveMatchLocationHistory.push(coordinates);

            if (this.isShowingLiveMatch && this.followLiveLocation) {
                this.locationHistoryRange.setValue(this.liveMatchLocationHistory.length);
                this.refreshGraph();
            }
        });

        // In-Game map change events
        this.matchMap.map$.pipe(takeUntil(this.isDestroyed$)).subscribe((matchMap) => {
            if (!matchMap || isEmpty(matchMap)) return;
            this.liveMap = matchMap;

            if (this.isShowingLiveMatch) {
                this.setLiveMatch();
            } else {
                this.refreshSelectedMapMatchList();
            }
        });
    }
    //#endregion

    //#region Matches
    private refreshSelectedMapMatchList(): void {
        this.selectedMapMatchList = this.matchList.filter((m) => m.mapId === this.selectedMap?.mapId);
        this.cdr.detectChanges();
    }

    private setLiveMatch(): void {
        this.followLiveLocation = true;
        if (this.ENABLE_DEBUG_TOOLS) this.refreshMapDebugTools();
        this.setSelectedMap(this.matchMap.map$.value);
        this.setSelectedMatch(undefined);
    }

    private setSelectedMatch(match?: MatchDataStore): void {
        this.selectedMatch = match;
        if (isEmpty(match) && this.selectedMap && !isEmpty(this.selectedMap)) {
            // Show aggregate map data
            this.loadAggregateMatchData(this.selectedMap);
        } else if (!isEmpty(match?.matchId)) {
            this.loadMatchById(match!.matchId);
        }
    }

    private loadMatchList(): void {
        // TODO: Private
        this.match
            .getAllMatchData()
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((matches) => (this.matchList = matches));
    }

    private loadAggregateMatchData(map: MatchMap): void {
        this.locationHistoryRange.disable();
        this.locationHistoryRange.setValue(Infinity);

        this.aggregateMapLocationHistory = this.matchList
            .filter((m) => m.mapId === map.mapId)
            .reduce((prev, curr) => {
                const coordinates = curr.locationHistory.map((l) => l.value);
                return prev.concat(coordinates);
            }, [] as MatchMapCoordinates[]);
        this.refreshGraph();
    }

    private loadMatchById(matchId?: string): void {
        if (!matchId || isEmpty(matchId)) return this.locationHistoryRange.disable();
        this.match
            .getMatchDataByMatchId(matchId)
            .pipe(
                takeUntil(this.isDestroyed$),
                filter((match) => !isEmpty(match)),
                map((match) => match as MatchDataStore)
            )
            .subscribe((match) => {
                const foundMap = this.mapList.find((m) => m.mapId === match.mapId);
                this.setSelectedMap(foundMap);
                this.locationHistoryRange.enable();
                this.locationHistoryRange.setValue(this.coordinateData?.length ?? 0);
            });
    }
    //#endregion

    //#region Maps
    private setSelectedMap(map?: MatchMap): void {
        this.selectedMap = map;
        if (this.ENABLE_DEBUG_TOOLS) this.refreshMapDebugTools();
        this.refreshSelectedMapMatchList();
        this.refreshGraph();
    }
    //#endregion

    //#region Graph
    private initGraph(): void {
        if (!this.mapOverlayGraph?.nativeElement) return void console.error(`Map graph element was not found.`);
        this.graphSvg = d3
            .select(this.mapOverlayGraph.nativeElement)
            .append("svg")
            .attr("viewBox", `0 0 ${this.graphResolutionX} ${this.graphResolutionY}`) as any;
    }

    private refreshGraph(customImageAxisScale?: MatchMapImageAxixScale, customHeatSize?: number): void {
        const matchMap = this.isShowingLiveMatch ? this.liveMap : this.selectedMap;
        const maxHistory = this.locationHistoryRange?.value;
        const coordinates = this.coordinateData?.slice(0, maxHistory) ?? [];

        const imageAxisScale = {
            xStart: customImageAxisScale?.xStart ?? matchMap?.chartConfig?.imageAxisScale?.xStart ?? -500,
            xEnd: customImageAxisScale?.xEnd ?? matchMap?.chartConfig?.imageAxisScale?.xEnd ?? 500,
            yStart: customImageAxisScale?.yStart ?? matchMap?.chartConfig?.imageAxisScale?.yStart ?? -500,
            yEnd: customImageAxisScale?.yEnd ?? matchMap?.chartConfig?.imageAxisScale?.yEnd ?? 500,
        };

        this.drawGraphData(coordinates, imageAxisScale, customHeatSize ?? this.heatSize);
        // this.cdr.detectChanges();
        // this.cdr.markForCheck();
    }

    private drawGraphData(
        coordinates: MatchMapCoordinates[],
        { xStart, xEnd, yStart, yEnd }: MatchMapImageAxixScale,
        customHeatSize: number
    ): void {
        if (!this.mapOverlayGraph?.nativeElement) return void console.error(`Map graph element was not found.`);
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
            .bandwidth(customHeatSize)(coordinates as any);

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
            .pipe(takeUntil(this.isDestroyed$), throttleTime(10))
            .subscribe(([xShift, xStart, xEnd, yShift, yStart, yEnd, heatSize]) => {
                const imageAxisScale = { xStart: xStart + xShift, xEnd: xEnd + xShift, yStart: yStart + yShift, yEnd: yEnd + yShift };
                this.heatSize = heatSize;
                this.refreshGraph(imageAxisScale, heatSize);
            });
    }

    private refreshMapDebugTools(): void {
        this.xShiftRangeForm.setValue(0);
        this.xStartRangeForm.setValue(this.selectedMap?.chartConfig?.imageAxisScale?.xStart ?? -500);
        this.xEndRangeForm.setValue(this.selectedMap?.chartConfig?.imageAxisScale?.xEnd ?? 500);
        this.yShiftRangeForm.setValue(0);
        this.yStartRangeForm.setValue(this.selectedMap?.chartConfig?.imageAxisScale?.yStart ?? -500);
        this.yEndRangeForm.setValue(this.selectedMap?.chartConfig?.imageAxisScale?.yEnd ?? 500);
    }
    //#endregion
}

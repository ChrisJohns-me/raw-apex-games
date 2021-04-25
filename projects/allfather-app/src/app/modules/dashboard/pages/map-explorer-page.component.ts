import { MatchGameMode } from "@allfather-app/app/shared/models/match/game-mode";
import { MatchMap } from "@allfather-app/app/shared/models/match/map";
import { MatchMapCoordinates } from "@allfather-app/app/shared/models/match/map-coordinates";
import { MatchMapList, MatchMapName } from "@allfather-app/app/shared/models/match/map-list";
import { environment } from "@allfather-app/environments/environment";
import { AfterContentInit, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import * as d3 from "d3";
import { intervalToDuration } from "date-fns";
import { combineLatest, Subject } from "rxjs";
import { distinctUntilChanged, filter, map, takeUntil, throttleTime } from "rxjs/operators";
import { isEmpty } from "shared/utilities";
import { unique } from "shared/utilities/primitives/array";
import { MatchDataStore } from "../../core/local-database/match-data-store";
import { MatchMapService } from "../../core/match/match-map.service";
import { MatchPlayerLocationService } from "../../core/match/match-player-location.service";
import { MatchService } from "../../core/match/match.service";
import { ReportingStatus } from "../../core/reporting/reporting-engine/reporting-engine";
import { LocalReportingEngine } from "../../core/reporting/reporting-engine/reporting-engines/local-reporting-engine";
import { ReportingService } from "../../core/reporting/reporting.service";

@Component({
    selector: "app-map-explorer-page",
    templateUrl: "./map-explorer-page.component.html",
    styleUrls: ["./map-explorer-page.component.scss"],
})
export class MapExplorerPageComponent implements OnInit, AfterViewInit, OnDestroy, AfterContentInit {
    public ENABLE_DEBUG_TOOLS = environment.DEV && false; // Debug tools
    @ViewChild("mapOverlayGraph") public mapOverlayGraph?: ElementRef<HTMLDivElement>;

    public isLive = false;
    public mapList: MatchMap[];
    public matchList: MatchDataStore[] = [];
    // public get selectedMatchText(): string {
    //     return "aggregate" ?
    // }
    public get coordinateData(): MatchMapCoordinates[] | undefined {
        if (this.isLive) return this.liveMatchLocationHistory;
        else return this.selectedMatch?.locationHistory.map((location) => location.value);
    }
    public selectedMap?: MatchMap;
    public selectedMatch?: MatchDataStore;
    public liveMap?: MatchMap;
    public liveMatchLocationHistory: MatchMapCoordinates[] = [];

    // Form inputs
    public selectedMatchForm = new FormControl();
    public followLiveLocation = false;
    public locationHistoryRange = new FormControl(1000);

    // Debug
    public heatSizeRange;
    public xStartRangeForm = new FormControl(-500);
    public xEndRangeForm = new FormControl(500);
    public yStartRangeForm = new FormControl(-500);
    public yEndRangeForm = new FormControl(500);

    // Graph
    private graphSvg!: d3.Selection<SVGGElement, unknown, null, undefined>;
    private mapImageHeight = 720;
    private mapImageWidth = 720;
    private heatSize = 4;
    private _unsubscribe$ = new Subject<void>();

    constructor(
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

    public durationSinceNow = (baseDate: Date): Duration => intervalToDuration({ start: baseDate, end: new Date() });
    public getGameModeTypeName = (gameModeId: string): Optional<string> => new MatchGameMode(gameModeId).baseType;

    //#region Lifecycle Methods
    public ngOnInit(): void {
        this.setupLiveMatch();
    }

    public ngAfterContentInit(): void {
        this.setLive();
    }

    public ngAfterViewInit(): void {
        this.initGraph();
        this.initEventListeners();
        this.loadMatchList();
        if (this.ENABLE_DEBUG_TOOLS) this.setupDebug();
    }

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }
    //#endregion

    public setLive(): void {
        this.isLive = true;
        // this.selectedMatchForm.reset(); // ?
        this.selectedMap = this.matchMap.map$.value;
        this.followLiveLocation = true;
        this.selectedMatchForm.disable();
        this.locationHistoryRange.disable();
        this.refreshGraph();
    }

    public selectMap(map: MatchMap): void {
        this.isLive = false;
        this.selectedMap = map;
        this.followLiveLocation = false;
        this.selectedMatchForm.enable();
        this.locationHistoryRange.enable();
        this.selectedMatch = undefined;
        // this.selectedMatchForm.reset(null, { emitEvent: false });

        if (this.ENABLE_DEBUG_TOOLS) {
            this.xStartRangeForm.setValue(map.imageAxisScale?.xStart ?? -500);
            this.xEndRangeForm.setValue(map.imageAxisScale?.xEnd ?? 500);
            this.yStartRangeForm.setValue(map.imageAxisScale?.yStart ?? -500);
            this.yEndRangeForm.setValue(map.imageAxisScale?.yEnd ?? 500);
        }

        this.refreshGraph();
    }

    private loadMatch(matchId: string): void {
        this.match
            .getMatchDataByMatchId(matchId)
            .pipe(
                takeUntil(this._unsubscribe$),
                filter((match) => !isEmpty(match)),
                map((match) => match as MatchDataStore)
            )
            .subscribe((match) => {
                this.selectedMatch = match;
                this.locationHistoryRange.setValue(this.coordinateData?.length ?? 0);
                this.refreshGraph();
            });
    }

    public loadMatchList(): void {
        // TODO: Private
        this.match
            .getAllMatchData()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((matches) => (this.matchList = matches));
    }

    private initEventListeners(): void {
        // New Match Selected
        this.selectedMatchForm.valueChanges
            .pipe(
                takeUntil(this._unsubscribe$),
                distinctUntilChanged((a: MatchDataStore, b: MatchDataStore) => a?.matchId === b?.matchId)
            )
            .subscribe((value) => {
                const matchId = value?.matchId;
                if (matchId) this.loadMatch(matchId);
            });

        // Timeline slider changed
        this.locationHistoryRange.valueChanges.pipe(takeUntil(this._unsubscribe$)).subscribe(() => this.refreshGraph());
    }

    private setupLiveMatch(): void {
        // Match started event
        this.match.startedEvent$.pipe(takeUntil(this._unsubscribe$)).subscribe(() => {
            this.liveMatchLocationHistory = [];
            this.refreshGraph();
        });

        // New match was reported to local
        this.reportingService.reportingEvent$
            .pipe(
                takeUntil(this._unsubscribe$),
                filter((reportingEvent) => reportingEvent.engine instanceof LocalReportingEngine),
                filter((localReportingStatus) => localReportingStatus.status === ReportingStatus.SUCCESS)
            )
            .subscribe(() => this.loadMatchList());

        // New player coordinates
        this.matchPlayerLocation.myCoordinates$.pipe(takeUntil(this._unsubscribe$)).subscribe((coordinates) => {
            if (!coordinates) return;
            this.liveMatchLocationHistory.push(coordinates);

            if (this.isLive && this.followLiveLocation) {
                this.locationHistoryRange.setValue(this.liveMatchLocationHistory.length);
                this.refreshGraph();
            }
        });

        // In-Game map change events
        this.matchMap.map$.pipe(takeUntil(this._unsubscribe$)).subscribe((matchMap) => {
            if (!matchMap) return;
            this.liveMap = matchMap;

            if (this.isLive) {
                this.selectedMap = matchMap;
                this.refreshGraph();
            }
        });
    }

    private initGraph(): void {
        if (!this.mapOverlayGraph?.nativeElement) return void console.error(`Map graph element was not found.`);
        this.graphSvg = d3
            .select(this.mapOverlayGraph.nativeElement)
            .append("svg")
            .attr("width", this.mapImageWidth)
            .attr("height", this.mapImageHeight) as any;
    }

    private refreshGraph(
        customImageAxisScale?: { xStart: number; xEnd: number; yStart: number; yEnd: number },
        customHeatSize?: number
    ): void {
        const matchMap = this.isLive ? this.liveMap : this.selectedMap;
        const maxHistory = this.locationHistoryRange?.value;
        const coordinates = this.coordinateData?.slice(0, maxHistory) ?? [];

        const imageAxisScale = {
            xStart: matchMap?.imageAxisScale?.xStart ?? -500,
            xEnd: matchMap?.imageAxisScale?.xEnd ?? 500,
            yStart: matchMap?.imageAxisScale?.yStart ?? -500,
            yEnd: matchMap?.imageAxisScale?.yEnd ?? 500,
        };

        this.drawGraph(coordinates, customImageAxisScale ?? imageAxisScale, customHeatSize ?? this.heatSize);
    }

    private drawGraph(
        coordinates: MatchMapCoordinates[],
        { xStart, xEnd, yStart, yEnd }: { xStart: number; xEnd: number; yStart: number; yEnd: number },
        customHeatSize: number
    ): void {
        if (!this.mapOverlayGraph?.nativeElement) return void console.error(`Map graph element was not found.`);
        // clear the graph
        this.graphSvg.selectAll("g").remove();

        // read data
        const x = d3 // Add X axis
            .scaleLinear()
            .domain([xStart, xEnd])
            .range([0, this.mapImageWidth]);

        const y = d3 // Add Y axis
            .scaleLinear()
            .domain([yStart, yEnd])
            .range([this.mapImageHeight, 0]);

        // Prepare a color palette
        const color = d3.scaleLinear([0, 0.25, 0.5], ["rgba(0, 128, 0, 0.15)", "rgba(255, 255, 0, 0.5)", "rgba(255, 0, 0, 0.65)"]);

        // compute the density data
        const densityData = d3
            .contourDensity()
            .x((d) => x((d as any)["x"]))
            .y((d) => y((d as any)["y"]))
            .size([this.mapImageWidth, this.mapImageHeight])
            .bandwidth(customHeatSize)(coordinates as any);

        // show the shape
        this.graphSvg
            .insert("g", "g")
            .selectAll("path")
            .data(densityData)
            .enter()
            .append("path")
            .attr("d", d3.geoPath())
            .attr("fill", (d) => color(d.value));
    }

    private setupDebug(): void {
        console.warn(`Match Map DEBUG Enabled`);
        combineLatest([
            this.xStartRangeForm.valueChanges,
            this.xEndRangeForm.valueChanges,
            this.yStartRangeForm.valueChanges,
            this.yEndRangeForm.valueChanges,
            this.heatSizeRange.valueChanges,
        ])
            .pipe(takeUntil(this._unsubscribe$), throttleTime(100))
            .subscribe(([xStart, xEnd, yStart, yEnd, heatSize]) => {
                this.heatSize = heatSize;
                this.refreshGraph({ xStart, xEnd, yStart, yEnd }, heatSize);
            });
    }
}

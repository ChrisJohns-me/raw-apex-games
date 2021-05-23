import { MatchGameMode } from "@allfather-app/app/common/match/game-mode";
import { MatchLocationPhase } from "@allfather-app/app/common/match/location";
import { MatchMapCoordinates } from "@allfather-app/app/common/match/map/map-coordinates";
import { MatchMapList } from "@allfather-app/app/common/match/map/map-list";
import { MatchMapFriendlyName } from "@allfather-app/app/common/match/map/map.enum";
import { MatchMap } from "@allfather-app/app/common/match/map/match-map";
import { environment } from "@allfather-app/environments/environment";
import {
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
import { combineLatest, merge, Observable, Subject } from "rxjs";
import { distinctUntilChanged, filter, finalize, switchMap, takeUntil, throttleTime } from "rxjs/operators";
import { isEmpty } from "shared/utilities";
import { unique } from "shared/utilities/primitives/array";
import { LocationPhaseNum, MatchDataStore } from "../../core/local-database/match-data-store";
import { MatchMapService } from "../../core/match/match-map.service";
import { MatchPlayerLegendService } from "../../core/match/match-player-legend.service";
import { MatchPlayerLocationService } from "../../core/match/match-player-location.service";
import { MatchPlayerStatsService } from "../../core/match/match-player-stats.service";
import { MatchRosterService } from "../../core/match/match-roster.service";
import { MatchService } from "../../core/match/match.service";
import { PlayerService } from "../../core/player.service";
import { ReportingEngineId, ReportingStatus } from "../../core/reporting/reporting-engine/reporting-engine";
import { ReportingService } from "../../core/reporting/reporting.service";

type MatchMapImageAxisScale = NonNullable<MatchMap["chartConfig"]>["imageAxisScale"];

@Component({
    selector: "app-match-explorer-page",
    templateUrl: "./match-explorer-page.component.html",
    styleUrls: ["./match-explorer-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchExplorerPageComponent implements OnInit, AfterViewInit, OnDestroy {
    public ENABLE_DEBUG_TOOLS = environment.DEV && false; // Debug tools
    @ViewChild("mapOverlayGraph") public mapOverlayGraphRef?: ElementRef<HTMLDivElement>;

    public isLiveMatchFocused = true;
    public liveMatch?: MatchDataStore;
    public isLoadingMatchList = false;
    public mapList: MatchMap[];
    public matchList: MatchDataStore[] = [];
    public selectedMatch?: MatchDataStore;

    public get isLiveMatchStarted(): boolean {
        return !!this.liveMatch?.matchId && !this.liveMatch?.endDate;
    }
    public get isLoadingMapImage(): boolean {
        return this._isLoadingMapImage;
    }
    public set isLoadingMapImage(value: boolean) {
        this._isLoadingMapImage = value;
        this.refreshUI();
    }
    public get displayedMap(): Optional<MatchMap> {
        return this.isLiveMatchFocused ? this.matchMap.map$.value : this.selectedMap;
    }
    public get isShowingAggregateData(): boolean {
        return !!this.selectedMap && !this.selectedMatch;
    }
    public get selectedMapMatchList(): MatchDataStore[] {
        return this.matchList.filter((m) => m.mapId === this.selectedMap?.mapId);
    }
    public get displayedLocationHistory(): MatchMapCoordinates[] {
        if (this.isLiveMatchFocused) return this.liveMatchLocationHistory;
        else if (this.isShowingAggregateData) return this.aggregateMapLocationHistory;
        else if (!this.selectedMatch?.locationHistory || !Array.isArray(this.selectedMatch?.locationHistory)) return [];
        else return this.selectedMatch.locationHistory.filter((l) => l.value.phaseNum === LocationPhaseNum.HasLanded).map((l) => l.value);
    }

    // Form inputs
    public followLiveLocationForm = new FormControl(false);
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

    private _isLoadingMapImage = false;
    private selectedMap?: MatchMap;
    private liveMatchLocationHistory: MatchMapCoordinates[] = [];
    private aggregateMapLocationHistory: MatchMapCoordinates[] = [];
    private isDestroyed$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly match: MatchService,
        private readonly matchMap: MatchMapService,
        private readonly matchPlayerLegend: MatchPlayerLegendService,
        private readonly matchPlayerLocation: MatchPlayerLocationService,
        private readonly matchPlayerStats: MatchPlayerStatsService,
        private readonly matchRoster: MatchRosterService,
        private readonly player: PlayerService,
        private readonly reportingService: ReportingService
    ) {
        this.heatSizeRange = new FormControl(this.heatSize);
        this.mapList = unique(
            MatchMapList.filter((m) => m.mapName !== MatchMapFriendlyName.FiringRange),
            (m) => m.mapName
        ).sort((a, b) => {
            if (a.mapName < b.mapName) return -1;
            if (a.mapName > b.mapName) return 1;
            return 0;
        });
    }

    public matchTrackBy: TrackByFunction<MatchDataStore> = (_, item) => item.matchId ?? item.endDate;
    public durationSinceNow = (baseDate: Date): Duration => intervalToDuration({ start: baseDate, end: new Date() });
    public getGameModeTypeName = (gameModeId: string): Optional<string> => new MatchGameMode(gameModeId).baseType;

    //#region Lifecycle Methods
    public ngOnInit(): void {
        this.setupLiveMatchListeners();
        this.setLiveMatch();
        this.setupEventListeners();
        this.getMatchList()
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((matchList) => {
                this.matchList = matchList;
                this.refreshUI();
            });
        if (this.ENABLE_DEBUG_TOOLS) this.setupDebug();
    }

    public ngAfterViewInit(): void {
        this.initGraph();
    }

    public ngOnDestroy(): void {
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
    }
    //#endregion

    public onLiveMatchClick(): void {
        this.setLiveMatch();
        this.setSelectedMap(this.matchMap.map$.value);
        this.setSelectedMatch(undefined);
        this.setShowAggregateMapData(false);
        this.drawGraph();
        this.refreshUI();
    }

    public onSelectMatchClick(match?: MatchDataStore): void {
        const matchMap = this.mapList.find((m) => m.mapId === match?.mapId);
        this.locationHistoryRange.enable({ emitEvent: false });
        this.setLiveMatch(false);
        this.setSelectedMap(matchMap);
        this.setSelectedMatch(match);
        this.setShowAggregateMapData(false);
        this.drawGraph();
        this.refreshUI();
    }

    public onSelectMapClick(map?: MatchMap): void {
        this.setLiveMatch(false);
        this.setSelectedMap(map);
        this.setSelectedMatch(undefined);
        this.setShowAggregateMapData(true);
        this.drawGraph();
        this.refreshUI();
    }

    //#region Setup
    private setupEventListeners(): void {
        // Timeline slider changed
        this.locationHistoryRange.valueChanges.pipe(takeUntil(this.isDestroyed$), distinctUntilChanged()).subscribe(() => {
            this.drawGraph();
            this.refreshUI();
        });

        // Follow Live Form
        this.followLiveLocationForm.valueChanges.pipe(takeUntil(this.isDestroyed$), distinctUntilChanged()).subscribe((isEnabled) => {
            if (isEnabled) this.locationHistoryRange.enable({ emitEvent: false });
            else this.locationHistoryRange.disable({ emitEvent: false });
            this.refreshUI();
        });
    }

    private setupLiveMatchListeners(): void {
        // Match started event
        this.match.startedEvent$.pipe(takeUntil(this.isDestroyed$)).subscribe(() => {
            this.liveMatchLocationHistory = [];
            if (this.isLiveMatchFocused) {
                this.setLiveMatch();
                this.setShowAggregateMapData(false);
                this.drawGraph();
                this.refreshUI();
            }
        });

        // Match ended event
        this.match.endedEvent$.pipe(takeUntil(this.isDestroyed$)).subscribe(() => {
            this.liveMatch = undefined;
        });

        // New match was reported to local database
        this.reportingService.reportingEvent$
            .pipe(
                takeUntil(this.isDestroyed$),
                filter((reportingEvent) => reportingEvent.engine.engineId === ReportingEngineId.Local),
                filter((localReportingStatus) => localReportingStatus.status === ReportingStatus.SUCCESS),
                switchMap(() => this.getMatchList())
            )
            .subscribe((matchList) => {
                this.matchList = matchList;

                // Transition from Live Match to Stored Match
                if (this.isLiveMatchFocused) {
                    this.selectedMatch = matchList[0];
                }

                this.refreshUI();
            });

        // New player coordinates
        this.matchPlayerLocation.myCoordinates$.pipe(takeUntil(this.isDestroyed$)).subscribe((coordinates) => {
            if (!coordinates) return;
            if (this.matchPlayerLocation.myLocationPhase$.value !== MatchLocationPhase.HasLanded) return;

            this.liveMatchLocationHistory.push(coordinates);
            this.locationHistoryRange.setValue(this.liveMatchLocationHistory.length, { emitEvent: false });

            if (this.isLiveMatchFocused && this.followLiveLocationForm.value) {
                this.drawGraph();
                this.refreshUI();
            }
        });

        // In-Game map change events
        this.matchMap.map$.pipe(takeUntil(this.isDestroyed$)).subscribe((matchMap) => {
            if (!matchMap || isEmpty(matchMap)) return;
            // this.liveMap = matchMap;
            if (this.isLiveMatchFocused) {
                this.setLiveMatch();
                this.setShowAggregateMapData(false);
                this.drawGraph();
                this.refreshUI();
            }
        });

        // Update Live Match data
        merge(
            this.match.gameMode$,
            this.match.matchId$,
            this.match.state$,
            this.match.state$,
            this.matchMap.map$,
            this.matchPlayerLegend.myLegend$,
            this.matchPlayerStats.myAssists$,
            this.matchPlayerStats.myDamage$,
            this.matchPlayerStats.myEliminations$,
            this.matchPlayerStats.myKnockdowns$,
            this.matchPlayerStats.myPlacement$,
            this.matchRoster.startingNumTeams$,
            this.matchRoster.teammateRoster$,
            this.player.myName$
        )
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe(() => {
                this.liveMatch = this.generateLiveMatch();
                this.refreshUI();
            });
    }
    //#endregion

    //#region Intermediate Functions
    private setLiveMatch(isLive = true): void {
        this.isLiveMatchFocused = isLive;
        this.followLiveLocationForm.setValue(isLive, { emitEvent: false });
    }

    private setSelectedMap(map?: MatchMap): void {
        if (!map?.mapId || map?.mapId === this.selectedMap?.mapId) return;
        this.isLoadingMapImage = true;
        this.selectedMap = map;
        if (this.ENABLE_DEBUG_TOOLS) this.refreshMapDebugTools();
    }

    private setSelectedMatch(match?: MatchDataStore): void {
        this.selectedMatch = match;
        if (match?.matchId) {
            this.locationHistoryRange.enable({ emitEvent: false });
            this.locationHistoryRange.setValue(this.displayedLocationHistory?.length ?? Infinity, { emitEvent: false });
        }
    }

    private setShowAggregateMapData(show = true): void {
        if (show && this.selectedMap) {
            this.aggregateMapLocationHistory = this.extractAggregateMapLocationHistory(this.matchList, this.selectedMap);
            this.locationHistoryRange.disable({ emitEvent: false });
            this.locationHistoryRange.setValue(Infinity, { emitEvent: false });
        } else {
            this.aggregateMapLocationHistory = [];
        }
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

    private getMatchList(): Observable<MatchDataStore[]> {
        this.isLoadingMatchList = true;
        return this.match.getAllMatchData$().pipe(finalize(() => (this.isLoadingMatchList = false)));
    }

    private extractAggregateMapLocationHistory(matchList: MatchDataStore[], map: MatchMap): MatchMapCoordinates[] {
        return matchList
            .filter((m) => m.mapId === map.mapId)
            .reduce((prev, curr) => {
                if (!curr.locationHistory || !Array.isArray(curr.locationHistory)) return prev;
                const coordinates = curr.locationHistory.filter((l) => l.value.phaseNum === LocationPhaseNum.HasLanded).map((l) => l.value);
                return prev.concat(coordinates);
            }, [] as MatchMapCoordinates[]);
    }

    private drawGraph(customImageAxisScale?: MatchMapImageAxisScale, customHeatSize?: number): void {
        if (!this.mapOverlayGraphRef?.nativeElement) return void console.error(`Map graph element was not found.`);

        const matchMap = this.isLiveMatchFocused ? this.matchMap.map$.value : this.selectedMap;
        const maxHistory = this.locationHistoryRange?.value;
        const coordinates = this.displayedLocationHistory?.slice(0, maxHistory) ?? [];

        const xStart = customImageAxisScale?.xStart ?? matchMap?.chartConfig?.imageAxisScale?.xStart ?? -500,
            xEnd = customImageAxisScale?.xEnd ?? matchMap?.chartConfig?.imageAxisScale?.xEnd ?? 500,
            yStart = customImageAxisScale?.yStart ?? matchMap?.chartConfig?.imageAxisScale?.yStart ?? -500,
            yEnd = customImageAxisScale?.yEnd ?? matchMap?.chartConfig?.imageAxisScale?.yEnd ?? 500;

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

    private generateLiveMatch(): MatchDataStore {
        const teamRoster: MatchDataStore["teamRoster"] = this.matchRoster.teammateRoster$.value.allPlayers.map((p) => ({
            isMe: p.isMe,
            legendId: p.legend?.legendId ?? "",
            name: p.name,
        }));

        return {
            matchId: this.match.matchId$.value,
            startDate: this.match.state$.value.startDate!,
            endDate: this.match.state$.value.endDate!,
            myName: this.player.myName$.value!,
            gameModeId: this.match.gameMode$.value?.gameModeId ?? "",
            mapId: this.matchMap.map$.value?.mapId ?? "",
            assists: this.matchPlayerStats.myAssists$.value,
            damage: this.matchPlayerStats.myDamage$.value,
            eliminations: this.matchPlayerStats.myEliminations$.value,
            knockdowns: this.matchPlayerStats.myKnockdowns$.value,
            maxPlacement: this.matchRoster.startingNumTeams$.value,
            placement: this.matchPlayerStats.myPlacement$.value,
            damageEventsHistory: [],
            killfeedHistory: [],
            locationHistory: [],
            matchRoster: [],
            teamRoster: teamRoster,
            ultimateUsageDates: [],
            weaponIdsHistory: [],
        };
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
            .pipe(takeUntil(this.isDestroyed$), throttleTime(10))
            .subscribe(([xShift, xStart, xEnd, yShift, yStart, yEnd, heatSize]) => {
                const imageAxisScale = { xStart: xStart + xShift, xEnd: xEnd + xShift, yStart: yStart + yShift, yEnd: yEnd + yShift };
                this.heatSize = heatSize;
                this.drawGraph(imageAxisScale, heatSize);
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

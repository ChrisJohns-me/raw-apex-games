import { MatchGameMode } from "@allfather-app/app/common/match/game-mode/game-mode";
import { MatchGameModeList } from "@allfather-app/app/common/match/game-mode/game-mode-list";
import { MatchMapCoordinates } from "@allfather-app/app/common/match/map/map-coordinates";
import { MatchMapList, sortMatchMapList } from "@allfather-app/app/common/match/map/map-list";
import { MatchMap } from "@allfather-app/app/common/match/map/match-map";
import { LocationPhaseNum, MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { DataItem } from "@allfather-app/app/shared/components/match-listing/match-listing.component";
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
import { combineLatest, Observable, Subject } from "rxjs";
import { distinctUntilChanged, finalize, takeUntil, throttleTime } from "rxjs/operators";
import { unique } from "shared/utilities/primitives/array";

type MatchMapImageAxisScale = NonNullable<MatchMap["chartConfig"]>["imageAxisScale"];

@Component({
    selector: "app-map-explorer-page",
    templateUrl: "./map-explorer-page.component.html",
    styleUrls: ["./map-explorer-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapExplorerPageComponent implements OnInit, AfterViewInit, OnDestroy {
    public ENABLE_DEBUG_TOOLS = environment.DEV && false; // Debug tools
    @ViewChild("mapOverlayGraph") public mapOverlayGraphRef?: ElementRef<HTMLDivElement>;

    public isLoadingMatchList = false;
    public mapList: MatchMap[];
    public matchList: MatchDataStore[] = [];
    public selectedMatch?: MatchDataStore;
    public selectedMap?: MatchMap;
    public showMatchItems: DataItem[] = [
        DataItem.GameMode,
        DataItem.MatchDate,
        DataItem.SquadLegends,
        DataItem.Map,
        DataItem.Eliminations,
        DataItem.Placement,
        DataItem.Damage,
    ];

    public get isLoadingMapImage(): boolean {
        return this._isLoadingMapImage;
    }
    public set isLoadingMapImage(value: boolean) {
        this._isLoadingMapImage = value;
        this.refreshUI();
    }
    public get isShowingAggregateData(): boolean {
        return !!this.selectedMap && !this.selectedMatch;
    }
    public get selectedMapMatchList(): MatchDataStore[] {
        return this.matchList.filter((m) => m.mapId === this.selectedMap?.mapId);
    }
    public get displayedLocationHistory(): MatchMapCoordinates[] {
        if (this.isShowingAggregateData) return this.aggregateMapLocationHistory;
        else if (!this.selectedMatch?.locationHistory || !Array.isArray(this.selectedMatch?.locationHistory)) return [];
        else return this.selectedMatch.locationHistory.filter((l) => l.value.phaseNum === LocationPhaseNum.HasLanded).map((l) => l.value);
    }

    // Form inputs
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
    private aggregateMapLocationHistory: MatchMapCoordinates[] = [];
    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly match: MatchService) {
        this.heatSizeRange = new FormControl(this.heatSize);
        this.mapList = unique(MatchMapList, (m) => m.mapName);
        this.mapList = this.mapList.filter((m) => {
            const hasSupportedGameMode = m.gameModeTypes?.some((genericGameModeId) => {
                const gm = MatchGameMode.getFromId(MatchGameModeList, genericGameModeId);
                return gm.isAFSupported;
            });

            return hasSupportedGameMode && m.isChartable;
        });
        this.mapList = sortMatchMapList(this.mapList.filter((m) => m.isBattleRoyaleMap || m.isArenasMap));
    }

    public matchTrackBy: TrackByFunction<MatchDataStore> = (_, item) => item.matchId ?? item.endDate;
    public durationSinceNow = (baseDate: Date): Duration => intervalToDuration({ start: baseDate, end: new Date() });
    public getGameModeTypeName = (gameModeId: string): Optional<string> =>
        MatchGameMode.getFromId(MatchGameModeList, gameModeId).gameModeGenericId;
    public getMapFilename = MatchMap.getLayoutFilename;

    //#region Lifecycle Methods
    public ngOnInit(): void {
        this.setupEventListeners();
        this.getMatchList()
            .pipe(takeUntil(this.destroy$))
            .subscribe((matchList) => {
                this.matchList = matchList.filter((match) => {
                    if (!match.gameModeId) return false;
                    const gameMode = MatchGameMode.getFromId(MatchGameModeList, match.gameModeId);
                    const foundMatchMap = this.mapList.find((m) => m.isChartable && m.mapId === match.mapId);
                    return gameMode.isAFSupported && !!foundMatchMap;
                });
                this.onSelectMatchClick(matchList[0]);
                this.refreshUI();
            });
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

    public onSelectMatchClick(match?: MatchDataStore): void {
        const matchMap = this.mapList.find((m) => m.mapId === match?.mapId);
        this.locationHistoryRange.enable({ emitEvent: false });
        this.setSelectedMap(matchMap);
        this.setSelectedMatch(match);
        this.setShowAggregateMapData(false);
        this.drawGraph();
        this.refreshUI();
    }

    public onSelectMapClick(map?: MatchMap): void {
        this.setSelectedMap(map);
        this.setSelectedMatch(undefined);
        this.setShowAggregateMapData(true);
        this.drawGraph();
        this.refreshUI();
    }

    //#region Setup
    private setupEventListeners(): void {
        // Timeline slider changed
        this.locationHistoryRange.valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged()).subscribe(() => {
            this.drawGraph();
            this.refreshUI();
        });
    }
    //#endregion

    //#region Intermediate Functions
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

        const matchMap = this.selectedMap;
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
        this.xStartRangeForm.setValue(this.selectedMap?.chartConfig?.imageAxisScale?.xStart ?? -500);
        this.xEndRangeForm.setValue(this.selectedMap?.chartConfig?.imageAxisScale?.xEnd ?? 500);
        this.yShiftRangeForm.setValue(0);
        this.yStartRangeForm.setValue(this.selectedMap?.chartConfig?.imageAxisScale?.yStart ?? -500);
        this.yEndRangeForm.setValue(this.selectedMap?.chartConfig?.imageAxisScale?.yEnd ?? 500);
    }
    //#endregion
}

/**
// TODO: Extract into a new LIVE MATCH component
// Template:
    <!-- Current Live Match -->
    <app-match-listing
        *ngIf="isLiveMatchStarted"
        [isLiveMatch]="true"
        [matches]="[liveMatch!]"
        [isMatchClickable]="true"
        [selectedMatchId]="liveMatch?.matchId"
        (matchClick)="onLiveMatchClick()"
        [showDataItems]="showMatchItems"
    ></app-match-listing>
    <!-- -->

    <!-- No Map Selected / No Live Map -->
    <div class="map-full-image map-full-image-no-map" *ngIf="!selectedMap?.mapId">
        <div class="message-overlay">
            <h5>Waiting for match</h5>
        </div>
        <picture>
            <source media="(max-width: 1000px)" [srcset]="'../../../../assets/images/map-layouts/medium/' + getMapFilename()" />
            <source media="(max-width: 1440px)" [srcset]="'../../../../assets/images/map-layouts/large/' + getMapFilename()" />
            <img [src]="'../../../../assets/images/map-layouts/' + getMapFilename()" class="img-fluid" alt="..." />
        </picture>
    </div>



// Component:
    public isLiveMatchFocused = true;
    public liveMatch?: MatchDataStore;

    private liveMatchLocationHistory: MatchMapCoordinates[] = [];

    public get isLiveMatchStarted(): boolean {
        return !!this.liveMatch?.matchId && !this.liveMatch?.endDate;
    }


    public onLiveMatchClick(): void {
        this.setLiveMatch();
        this.setSelectedMap(this.matchMap.map$.value);
        this.setSelectedMatch(undefined);
        this.setShowAggregateMapData(false);
        this.drawGraph();
        this.refreshUI();
    }

    private setLiveMatch(isLive = true): void {
        this.isLiveMatchFocused = isLive;
        this.followLiveLocationForm.setValue(isLive, { emitEvent: false });
    }


    private setupLiveMatchListeners(): void {
        // Match started event
        this.match.startedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.liveMatchLocationHistory = [];
            if (this.isLiveMatchFocused) {
                this.setLiveMatch();
                this.setShowAggregateMapData(false);
                this.drawGraph();
                this.refreshUI();
            }
        });

        // Match ended event
        this.match.endedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.liveMatch = undefined;
        });

        // New match was reported to local database
        this.reportingService.reportingEvent$
            .pipe(
                takeUntil(this.destroy$),
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
        this.matchPlayerLocation.myCoordinates$.pipe(takeUntil(this.destroy$)).subscribe((coordinates) => {
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
        this.matchMap.map$.pipe(takeUntil(this.destroy$)).subscribe((matchMap) => {
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
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.liveMatch = this.generateLiveMatch();
                this.refreshUI();
            });
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

 */

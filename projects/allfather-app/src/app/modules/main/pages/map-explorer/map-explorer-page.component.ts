import { MatchGameMode } from "@allfather-app/app/common/match/game-mode/game-mode";
import { MatchGameModeList } from "@allfather-app/app/common/match/game-mode/game-mode-list";
import { MatchMapCoordinates } from "@allfather-app/app/common/match/map/map-coordinates";
import { MatchMapList, sortMatchMapList } from "@allfather-app/app/common/match/map/map-list";
import { MatchMap } from "@allfather-app/app/common/match/map/match-map";
import { LocationPhaseNum, MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { ReportingEngineId, ReportingStatus } from "@allfather-app/app/modules/core/reporting/reporting-engine/reporting-engine";
import { ReportingService } from "@allfather-app/app/modules/core/reporting/reporting.service";
import { DataItem } from "@allfather-app/app/shared/components/match-listing/match-listing.component";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TrackByFunction } from "@angular/core";
import { unique } from "common/utilities/primitives/array";
import { intervalToDuration } from "date-fns";
import { Subject } from "rxjs";
import { filter, finalize, takeUntil } from "rxjs/operators";

const DEFAULT_NUM_ROWS = 25;

enum HeatmapDisplayType {
    Traveled = "Traveled",
    Eliminations = "Kills",
    Deaths = "Deaths",
    DeathsAndEliminations = "Kills & Deaths",
    Landings = "Landings",
}

@Component({
    selector: "app-map-explorer-page",
    templateUrl: "./map-explorer-page.component.html",
    styleUrls: ["./map-explorer-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapExplorerPageComponent implements OnInit, OnDestroy {
    public isLoadingMatchList = false;
    public numDisplayMatches = DEFAULT_NUM_ROWS;
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
    public heatmapDisplayTypeList = [
        HeatmapDisplayType.Traveled,
        HeatmapDisplayType.Eliminations,
        HeatmapDisplayType.Deaths,
        HeatmapDisplayType.DeathsAndEliminations,
        HeatmapDisplayType.Landings,
    ];
    public heatmapDisplayType: HeatmapDisplayType = HeatmapDisplayType.Traveled;

    public get isShowingAggregateData(): boolean {
        return !!this.selectedMap && !this.selectedMatch;
    }
    public get selectedMapMatchList(): MatchDataStore[] {
        return this.matchList.filter((m) => m.mapId === this.selectedMap?.mapId);
    }
    // Typically of "positive" connotation; ie. player's kills
    public get primaryCoordinates(): MatchMapCoordinates[] {
        switch (this.heatmapDisplayType) {
            case HeatmapDisplayType.Traveled:
                return this.locationHistoryCoordinates;
            case HeatmapDisplayType.Eliminations:
            case HeatmapDisplayType.DeathsAndEliminations:
                return this.eliminationLocationHistoryCoordinates;
            case HeatmapDisplayType.Landings:
                return this.landingLocationHistoryCoordinates;
            default:
                return [];
        }
    }

    // Typically of "negative" connotation; ie. player's deaths
    public get secondaryCoordinates(): MatchMapCoordinates[] {
        switch (this.heatmapDisplayType) {
            case HeatmapDisplayType.Deaths:
            case HeatmapDisplayType.DeathsAndEliminations:
                return this.deathLocationHistoryCoordinates;
            default:
                return [];
        }
    }

    //#region Coordinate Calculations
    private get locationHistoryCoordinates(): MatchMapCoordinates[] {
        if (this.isShowingAggregateData) return this.aggregateLocationHistory;
        else if (!this.selectedMatch?.locationHistory || !Array.isArray(this.selectedMatch?.locationHistory)) return [];
        else return this.selectedMatch.locationHistory.filter((l) => l.value.phaseNum === LocationPhaseNum.HasLanded).map((l) => l.value);
    }
    private get landingLocationHistoryCoordinates(): MatchMapCoordinates[] {
        if (this.isShowingAggregateData) return this.aggregateLandingLocationHistory;
        else if (!this.selectedMatch?.locationHistory || !Array.isArray(this.selectedMatch?.locationHistory)) return [];
        else {
            const landedLocation = this.selectedMatch.locationHistory.find((l) => l.value.phaseNum === LocationPhaseNum.HasLanded);
            const landedCoords: Optional<MatchMapCoordinates> = landedLocation?.value
                ? { x: landedLocation.value.x, y: landedLocation.value.y, z: landedLocation.value.z }
                : undefined;
            return landedCoords ? [landedCoords] : [];
        }
    }
    private get deathLocationHistoryCoordinates(): MatchMapCoordinates[] {
        if (this.isShowingAggregateData) return this.aggregateDeathLocationHistory;
        else if (!this.selectedMatch?.deathLocationHistory || !Array.isArray(this.selectedMatch?.deathLocationHistory)) return [];
        else return this.selectedMatch.deathLocationHistory.map((l) => l.value);
    }
    private get eliminationLocationHistoryCoordinates(): MatchMapCoordinates[] {
        if (this.isShowingAggregateData) return this.aggregateEliminationLocationHistory;
        else if (!this.selectedMatch?.eliminationLocationHistory || !Array.isArray(this.selectedMatch?.eliminationLocationHistory))
            return [];
        else return this.selectedMatch.eliminationLocationHistory.map((l) => l.value);
    }
    //#endregion

    /** Num rows to add when user reaches the bottom of the scroll */
    private numAddRowsScroll = 25;
    private aggregateLocationHistory: MatchMapCoordinates[] = [];
    private aggregateDeathLocationHistory: MatchMapCoordinates[] = [];
    private aggregateEliminationLocationHistory: MatchMapCoordinates[] = [];
    private aggregateLandingLocationHistory: MatchMapCoordinates[] = [];
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly match: MatchService,
        private readonly reportingService: ReportingService
    ) {
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
        this.setupLiveMatchListeners();
        this.loadMatchList();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
    //#endregion

    public onSelectMapIdClick(mapId?: MatchMap["mapId"]): void {
        const map = this.mapList.find((m) => m.mapId === mapId);
        this.setSelectedMap(map);
        this.setSelectedMatch(undefined);
        this.calcAggregateDataFromSelectedMap();
        this.refreshUI();
    }

    public onSelectMatchIdClick(matchId?: MatchDataStore["matchId"]): void {
        const match = this.matchList.find((m) => m.matchId === matchId);
        const matchMap = this.mapList.find((m) => m.mapId === match?.mapId);
        this.setSelectedMap(matchMap);
        this.setSelectedMatch(match);
        this.calcAggregateDataFromSelectedMap();
        this.refreshUI();
    }

    public onMatchListingScroll(event: Event): void {
        const requiredBottomDistance = 100;
        const target = event.target as HTMLDivElement;
        const distanceFromBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
        const hasMoreRowsToDisplay = this.numDisplayMatches <= this.matchList.length;

        if (!hasMoreRowsToDisplay) return;
        if (distanceFromBottom < requiredBottomDistance) {
            this.numDisplayMatches += this.numAddRowsScroll;
        }
    }

    //#region Intermediate Functions
    private setSelectedMap(map?: MatchMap): void {
        if (!map?.mapId || map?.mapId === this.selectedMap?.mapId) return;
        this.selectedMap = map;
    }

    private setSelectedMatch(match?: MatchDataStore): void {
        this.selectedMatch = match;
    }

    private setupLiveMatchListeners(): void {
        // New match was reported to local database
        this.reportingService.reportingEvent$
            .pipe(
                takeUntil(this.destroy$),
                filter((reportingEvent) => reportingEvent.engine.engineId === ReportingEngineId.Local),
                filter((localReportingStatus) => localReportingStatus.status === ReportingStatus.SUCCESS)
            )
            .subscribe(() => this.loadMatchList());
    }

    private loadMatchList(): void {
        this.isLoadingMatchList = true;
        this.match
            .getAllMatchData$()
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => (this.isLoadingMatchList = false))
            )
            .subscribe((matchList) => {
                this.matchList = matchList.filter((match) => {
                    if (!match.gameModeId) return false;
                    const gameMode = MatchGameMode.getFromId(MatchGameModeList, match.gameModeId);
                    const foundMatchMap = this.mapList.find((m) => m.isChartable && m.mapId === match.mapId);
                    return gameMode.isAFSupported && !!foundMatchMap;
                });
                // Select the last played map
                const lastPlayedMap = this.mapList.find((m) => m.isChartable && m.mapId === matchList[0].mapId);
                this.onSelectMapIdClick(lastPlayedMap?.mapId);
                this.refreshUI();
            });
    }

    /**
     * Calculates the aggregate data from selectedMap; if selectedMap is undefined, aggregate data is set to empty
     */
    private calcAggregateDataFromSelectedMap(): void {
        if (this.selectedMap) {
            this.aggregateLocationHistory = this.extractAggregateLocationHistory(this.matchList, this.selectedMap);
            this.aggregateDeathLocationHistory = this.extractAggregateDeathLocationHistory(this.matchList, this.selectedMap);
            this.aggregateEliminationLocationHistory = this.extractAggregateEliminationLocationHistory(this.matchList, this.selectedMap);
            this.aggregateLandingLocationHistory = this.extractAggregateLandingLocationHistory(this.matchList, this.selectedMap);
        } else {
            this.aggregateLocationHistory = [];
            this.aggregateDeathLocationHistory = [];
            this.aggregateEliminationLocationHistory = [];
            this.aggregateLandingLocationHistory = [];
        }
    }
    //#endregion

    //#region Low Order Functions
    /**
     * Returns combined map location history for matches of the same map
     */
    private extractAggregateLocationHistory(matchList: MatchDataStore[], map: MatchMap): MatchMapCoordinates[] {
        return matchList
            .filter((m) => m.mapId === map.mapId)
            .reduce((prev, curr) => {
                if (!curr.locationHistory || !Array.isArray(curr.locationHistory)) return prev;
                const coordinates = curr.locationHistory.filter((l) => l.value.phaseNum === LocationPhaseNum.HasLanded).map((l) => l.value);
                return prev.concat(coordinates);
            }, [] as MatchMapCoordinates[]);
    }

    /**
     * Returns combined map death location history for matches of the same map
     */
    private extractAggregateDeathLocationHistory(matchList: MatchDataStore[], map: MatchMap): MatchMapCoordinates[] {
        return matchList
            .filter((m) => m.mapId === map.mapId)
            .reduce((prev, curr) => {
                if (!curr.deathLocationHistory || !Array.isArray(curr.deathLocationHistory)) return prev;
                const coordinates = curr.deathLocationHistory.map((l) => l.value);
                return prev.concat(coordinates);
            }, [] as MatchMapCoordinates[]);
    }

    /**
     * Returns combined map elimination location history for matches of the same map
     */
    private extractAggregateEliminationLocationHistory(matchList: MatchDataStore[], map: MatchMap): MatchMapCoordinates[] {
        return matchList
            .filter((m) => m.mapId === map.mapId)
            .reduce((prev, curr) => {
                if (!curr.eliminationLocationHistory || !Array.isArray(curr.eliminationLocationHistory)) return prev;
                const coordinates = curr.eliminationLocationHistory.map((l) => l.value);
                return prev.concat(coordinates);
            }, [] as MatchMapCoordinates[]);
    }

    /**
     * Returns combined map landing location history for matches of the same map
     */
    private extractAggregateLandingLocationHistory(matchList: MatchDataStore[], map: MatchMap): MatchMapCoordinates[] {
        return matchList
            .filter((m) => m.mapId === map.mapId)
            .reduce((prev, curr) => {
                if (!curr.locationHistory || !Array.isArray(curr.locationHistory)) return prev;
                const firstLandingLocationData = curr.locationHistory
                    .sort((a, b) => a.timestamp - b.timestamp)
                    .find((l) => l.value.phaseNum === LocationPhaseNum.HasLanded)?.value;
                if (!firstLandingLocationData) return prev;

                const firstLandingCoords: MatchMapCoordinates = {
                    x: firstLandingLocationData.x,
                    y: firstLandingLocationData.y,
                    z: firstLandingLocationData.z,
                };
                return prev.concat([firstLandingCoords]);
            }, [] as MatchMapCoordinates[]);
    }

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
    //#endregion
}

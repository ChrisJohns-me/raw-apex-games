import { Legend } from "@allfather-app/app/common/legend/legend";
import { MatchGameMode } from "@allfather-app/app/common/match/game-mode/game-mode";
import { MatchMapCoordinates } from "@allfather-app/app/common/match/map/map-coordinates";
import { MatchMap } from "@allfather-app/app/common/match/map/match-map";
import { MatchFilters } from "@allfather-app/app/common/utilities/match-filters";
import { LocationPhaseNum, MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { ReportingEngineId, ReportingStatus } from "@allfather-app/app/modules/core/reporting/reporting-engine/reporting-engine";
import { ReportingService } from "@allfather-app/app/modules/core/reporting/reporting.service";
import { DataItem } from "@allfather-app/app/shared/components/match-listing/match-listing.component";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { mdiFilterVariantRemove } from "@mdi/js";
import { isEmpty } from "common/utilities";
import { Observable, Subject } from "rxjs";
import { filter, finalize, map, switchMap, takeUntil } from "rxjs/operators";

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
    //#region Match Filters
    public resetFilters = new Subject<void>();
    public get areFiltersResettable(): boolean {
        return (
            this.matchFilters.selectedGameModeList.length < this.gameModeList.length ||
            this.matchFilters.selectedLegendList.length < this.legendList.length
        );
    }
    public get matchList(): MatchDataStore[] {
        return this.matchFilters.matchList;
    }
    public get filteredMatchList(): MatchDataStore[] {
        return this.matchFilters.filteredMatchList;
    }
    public get genericMapList(): MatchMap[] {
        return this.matchFilters.mapList;
    }
    public gameModeList: MatchGameMode[] = [];
    public get legendList(): Legend[] {
        return this.matchFilters.legendList;
    }
    private matchFilters = new MatchFilters();
    //#endregion

    //#region Selected Viewing Match and Map
    public viewingMap?: MatchMap;
    public viewingMatch?: MatchDataStore;
    //#endregion

    //#region Map Graph
    public heatmapDisplayTypeList = [
        HeatmapDisplayType.Traveled,
        HeatmapDisplayType.Eliminations,
        HeatmapDisplayType.Deaths,
        HeatmapDisplayType.DeathsAndEliminations,
        HeatmapDisplayType.Landings,
    ];
    public heatmapDisplayType: HeatmapDisplayType = HeatmapDisplayType.Traveled;
    //#endregion

    //#region Match Listing
    public isLoadingMatchList = false;
    public numDisplayMatches = DEFAULT_NUM_ROWS;
    public showMatchItems: DataItem[] = [
        DataItem.GameMode,
        DataItem.MatchDate,
        DataItem.SquadLegends,
        DataItem.Map,
        DataItem.Eliminations,
        DataItem.Placement,
        DataItem.Damage,
    ];
    //#endregion

    //#region Coordinate Calculations
    public get isShowingAggregateData(): boolean {
        return !!this.viewingMap && !this.viewingMatch;
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
    private get locationHistoryCoordinates(): MatchMapCoordinates[] {
        if (this.isShowingAggregateData) return this.aggregateLocationHistory;
        else if (!this.viewingMatch?.locationHistory || !Array.isArray(this.viewingMatch?.locationHistory)) return [];
        else return this.viewingMatch.locationHistory.filter((l) => l.value.phaseNum === LocationPhaseNum.HasLanded).map((l) => l.value);
    }
    private get landingLocationHistoryCoordinates(): MatchMapCoordinates[] {
        if (this.isShowingAggregateData) return this.aggregateLandingLocationHistory;
        else if (!this.viewingMatch?.locationHistory || !Array.isArray(this.viewingMatch?.locationHistory)) return [];
        else {
            const landedLocation = this.viewingMatch.locationHistory.find((l) => l.value.phaseNum === LocationPhaseNum.HasLanded);
            const landedCoords: Optional<MatchMapCoordinates> = landedLocation?.value
                ? { x: landedLocation.value.x, y: landedLocation.value.y, z: landedLocation.value.z }
                : undefined;
            return landedCoords ? [landedCoords] : [];
        }
    }
    private get deathLocationHistoryCoordinates(): MatchMapCoordinates[] {
        if (this.isShowingAggregateData) return this.aggregateDeathLocationHistory;
        else if (!this.viewingMatch?.deathLocationHistory || !Array.isArray(this.viewingMatch?.deathLocationHistory)) return [];
        else return this.viewingMatch.deathLocationHistory.map((l) => l.value);
    }
    private get eliminationLocationHistoryCoordinates(): MatchMapCoordinates[] {
        if (this.isShowingAggregateData) return this.aggregateEliminationLocationHistory;
        else if (!this.viewingMatch?.eliminationLocationHistory || !Array.isArray(this.viewingMatch?.eliminationLocationHistory)) return [];
        else return this.viewingMatch.eliminationLocationHistory.map((l) => l.value);
    }
    //#endregion

    // Pass-through Variables
    public mdiFilterVariantRemove = mdiFilterVariantRemove;

    /** Num rows to add when user reaches the bottom of the scroll */
    private readonly numAddRowsScroll = 25;
    private aggregateLocationHistory: MatchMapCoordinates[] = [];
    private aggregateDeathLocationHistory: MatchMapCoordinates[] = [];
    private aggregateEliminationLocationHistory: MatchMapCoordinates[] = [];
    private aggregateLandingLocationHistory: MatchMapCoordinates[] = [];
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly match: MatchService,
        private readonly reporting: ReportingService
    ) {}

    //#region Lifecycle Methods
    public ngOnInit(): void {
        this.setupLiveMatchListeners();
        this.getMatchList$()
            .pipe(takeUntil(this.destroy$))
            .subscribe((matchList) => {
                this.matchFilters.matchList = matchList;
                this.setViewingMapToLastPlayed();
                this.matchFilters.selectedGameModeList = this.getMapGameModes(this.viewingMap);
                // this.setViewingMatchToLastPlayed();
                this.refreshUI();
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
    //#endregion

    //#region Filter Events
    public onResetClick(): void {
        this.resetFilters.next();
        this.applyMatchFilters();
        this.numDisplayMatches = DEFAULT_NUM_ROWS;
        this.heatmapDisplayType = HeatmapDisplayType.Traveled;
        this.refreshUI();
    }

    public onSelectedGameModesChange(selectedGameModes: MatchGameMode[]): void {
        this.matchFilters.selectedGameModeList = selectedGameModes;
        this.applyMatchFilters();
        this.calcAggregateDataFromViewingMap();
        this.refreshUI();
    }

    public onSelectedLegendsChange(selectedLegends: Legend[]): void {
        this.matchFilters.selectedLegendList = selectedLegends;
        this.applyMatchFilters();
        this.calcAggregateDataFromViewingMap();
        this.refreshUI();
    }
    //#endregion

    //#region Match Listing Events
    public onSelectViewingMapClick(map?: MatchMap): void {
        this.setViewingMap(map);
        this.setViewingMatch(undefined);
        this.calcAggregateDataFromViewingMap();
        this.refreshUI();
    }

    public onSelectViewingMatchClick(match?: MatchDataStore): void {
        const matchMap = this.genericMapList.find((m) => m.mapId === match?.mapId);
        this.setViewingMap(matchMap);
        this.setViewingMatch(match);
        this.calcAggregateDataFromViewingMap();
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
    //#endregion

    //#region Intermediate Functions
    private setViewingMap(map?: MatchMap): void {
        if (!map?.mapId || map?.mapId === this.viewingMap?.mapId) return;
        this.viewingMap = map;
        this.matchFilters.selectedMapList = [map];
        // Only show game modes that are available for the viewing map
        this.gameModeList = this.getMapGameModes(this.viewingMap);
        this.applyMatchFilters();
    }

    private setViewingMatch(match?: MatchDataStore): void {
        this.viewingMatch = match;
    }

    private setupLiveMatchListeners(): void {
        // New match was reported to local database
        this.reporting.reportingEvent$
            .pipe(
                takeUntil(this.destroy$),
                filter((reportingEvent) => reportingEvent.engine.engineId === ReportingEngineId.Local),
                filter((localReportingStatus) => localReportingStatus.status === ReportingStatus.SUCCESS),
                switchMap(() => this.getMatchList$())
            )
            .subscribe((matchList) => {
                this.matchFilters.matchList = matchList;

                // Select the last played match and map
                this.setViewingMapToLastPlayed();
                this.setViewingMatchToLastPlayed();
                this.refreshUI();
            });
    }

    private setViewingMapToLastPlayed(): void {
        const lastPlayedMatch = this.matchFilters.matchList[0];
        const lastPlayedMap = this.genericMapList.find((m) => m.isChartable && m.mapId === lastPlayedMatch.mapId);
        this.onSelectViewingMapClick(lastPlayedMap);
    }

    private setViewingMatchToLastPlayed(): void {
        const lastPlayedMatch = this.matchFilters.matchList[0];
        this.onSelectViewingMatchClick(lastPlayedMatch);
    }

    /** Calculates the aggregate data from viewingMap; if viewingMap is undefined, aggregate data is set to empty */
    private calcAggregateDataFromViewingMap(): void {
        if (this.viewingMap) {
            this.aggregateLocationHistory = this.extractAggregateLocationHistory(this.filteredMatchList, this.viewingMap);
            this.aggregateDeathLocationHistory = this.extractAggregateDeathLocationHistory(this.filteredMatchList, this.viewingMap);
            this.aggregateEliminationLocationHistory = this.extractAggregateEliminationLocationHistory(
                this.filteredMatchList,
                this.viewingMap
            );
            this.aggregateLandingLocationHistory = this.extractAggregateLandingLocationHistory(this.filteredMatchList, this.viewingMap);
        } else {
            this.aggregateLocationHistory = [];
            this.aggregateDeathLocationHistory = [];
            this.aggregateEliminationLocationHistory = [];
            this.aggregateLandingLocationHistory = [];
        }
    }
    //#endregion

    //#region Low Order Functions
    /** @returns combined map location history for matches of the same map */
    private extractAggregateLocationHistory(matchList: MatchDataStore[], map: MatchMap): MatchMapCoordinates[] {
        return matchList
            .filter((storedMatch) => storedMatch.mapId === map.mapId)
            .reduce((prev, curr) => {
                if (!curr.locationHistory || !Array.isArray(curr.locationHistory)) return prev;
                const coordinates = curr.locationHistory.filter((l) => l.value.phaseNum === LocationPhaseNum.HasLanded).map((l) => l.value);
                return prev.concat(coordinates);
            }, [] as MatchMapCoordinates[]);
    }

    /** @returns combined map death location history for matches of the same map */
    private extractAggregateDeathLocationHistory(matchList: MatchDataStore[], map: MatchMap): MatchMapCoordinates[] {
        return matchList
            .filter((storedMatch) => storedMatch.mapId === map.mapId)
            .reduce((prev, curr) => {
                if (!curr.deathLocationHistory || !Array.isArray(curr.deathLocationHistory)) return prev;
                const coordinates = curr.deathLocationHistory.map((l) => l.value);
                return prev.concat(coordinates);
            }, [] as MatchMapCoordinates[]);
    }

    /** @returns combined map elimination location history for matches of the same map */
    private extractAggregateEliminationLocationHistory(matchList: MatchDataStore[], map: MatchMap): MatchMapCoordinates[] {
        return matchList
            .filter((storedMatch) => storedMatch.mapId === map.mapId)
            .reduce((prev, curr) => {
                if (!curr.eliminationLocationHistory || !Array.isArray(curr.eliminationLocationHistory)) return prev;
                const coordinates = curr.eliminationLocationHistory.map((l) => l.value);
                return prev.concat(coordinates);
            }, [] as MatchMapCoordinates[]);
    }

    /** @returns Combined map landing location history for matches of the same map */
    private extractAggregateLandingLocationHistory(matchList: MatchDataStore[], map: MatchMap): MatchMapCoordinates[] {
        return matchList
            .filter((storedMatch) => storedMatch.mapId === map.mapId)
            .reduce((prev, curr) => {
                if (!curr.locationHistory || !Array.isArray(curr.locationHistory)) return prev;
                const firstLandingLocationData = curr.locationHistory
                    .slice()
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

    /**
     * @returns Match List
     *  - Filters out matches that don't have a map Id
     */
    private getMatchList$(): Observable<MatchDataStore[]> {
        this.isLoadingMatchList = true;
        return this.match.getAllMatchData$().pipe(
            map((matchList) => matchList.filter((match) => !isEmpty(match.mapId))),
            finalize(() => (this.isLoadingMatchList = false))
        );
    }

    /** @returns Game mode list supported by the map; if map is undefined, all game modes are returned */
    private getMapGameModes(map?: MatchMap): MatchGameMode[] {
        return this.matchFilters.gameModeList.filter((gameMode) => map?.gameModeTypes?.includes(gameMode.gameModeGenericId) ?? true);
    }

    private applyMatchFilters(): void {
        if (this.viewingMap) this.matchFilters.selectedMapList = [this.viewingMap];
        this.matchFilters.applyFilters();
    }

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
    //#endregion
}

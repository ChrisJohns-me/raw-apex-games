import { Legend } from "@allfather-app/app/common/legend/legend";
import { LegendList, sortLegendList } from "@allfather-app/app/common/legend/legend-list";
import { MatchGameMode } from "@allfather-app/app/common/match/game-mode/game-mode";
import { MatchGameModeList, sortMatchGameModeList } from "@allfather-app/app/common/match/game-mode/game-mode-list";
import { MatchGameModeGenericId } from "@allfather-app/app/common/match/game-mode/game-mode.enum";
import { latestGenericMap, MatchMapList, sortMatchMapList } from "@allfather-app/app/common/match/map/map-list";
import { MatchMap } from "@allfather-app/app/common/match/map/match-map";
import { GoogleAnalyticsService } from "@allfather-app/app/common/services/google-analytics.service";
import { MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { ReportingEngineId, ReportingStatus } from "@allfather-app/app/modules/core/reporting/reporting-engine/reporting-engine";
import { ReportingService } from "@allfather-app/app/modules/core/reporting/reporting.service";
import { AvgMatchStats, avgStats, SumMatchStats, sumStats } from "@allfather-app/app/modules/core/utilities/match-stats";
import { DataItem } from "@allfather-app/app/shared/components/match-listing/match-listing.component";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TrackByFunction } from "@angular/core";
import { FormControl } from "@angular/forms";
import { mdiFilterVariantRemove } from "@mdi/js";
import { cleanInt, isEmpty } from "common/utilities/";
import { unique } from "common/utilities/primitives/array";
import { intervalToDuration } from "date-fns";
import { Observable, Subject } from "rxjs";
import { debounceTime, filter, finalize, switchMap, takeUntil } from "rxjs/operators";

type TeamRosterPlayer = NonNullable<MatchDataStore["teamRoster"]>[0];
const DEFAULT_NUM_ROWS = 25;

@Component({
    selector: "app-match-explorer-page",
    templateUrl: "./match-explorer-page.component.html",
    styleUrls: ["./match-explorer-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchExplorerPageComponent implements OnInit, OnDestroy {
    public isSearching = false;
    public isLoadingMatchList = false;
    public numDisplayMatches = DEFAULT_NUM_ROWS;
    public resetFilters = new Subject<void>();
    public get areFiltersResettable(): boolean {
        return (
            this.filteredMatchList.length < this.matchList.length ||
            this.filteredMapGenericList.length < this.mapGenericList.length ||
            this.filteredGameModeList.length < this.gameModeList.length ||
            this.filteredLegendList.length < this.legendList.length ||
            !!this.searchForm.value?.length
        );
    }
    public searchForm = new FormControl();
    public matchList: MatchDataStore[] = [];
    /** Removes duplicate GenericIds by using the latest active map from Map list */
    public mapGenericList: MatchMap[];
    public gameModeList = sortMatchGameModeList(
        MatchGameModeList.filter((g) => g.isAFSupported && (g.isBattleRoyaleGameMode || g.isArenasGameMode || g.isControlGameMode))
    );
    public legendList = sortLegendList(LegendList);

    public filteredMatchList: MatchDataStore[] = this.matchList;
    public filteredMapGenericList: MatchMap[];
    public filteredGameModeList: MatchGameMode[] = this.gameModeList;
    public filteredLegendList: Legend[] = this.legendList;
    public filteredSumStats?: SumMatchStats;
    public filteredAvgStats?: AvgMatchStats;

    public avgToggle = true;
    public showMatchItems: DataItem[] = [
        DataItem.MatchDate,
        DataItem.GameMode,
        DataItem.SquadLegends,
        DataItem.Map,
        DataItem.Eliminations,
        DataItem.Assists,
        DataItem.Knockdowns,
        DataItem.Placement,
        DataItem.Damage,
        DataItem.Rank,
    ];

    // Pass-through variables
    public DataItem = DataItem;
    public mdiFilterVariantRemove = mdiFilterVariantRemove;

    /** All BattleRoyal, Arenas, and Control Maps; includes duplicate GenericIds */
    private _mapList = sortMatchMapList(MatchMapList.filter((m) => m.isBattleRoyaleMap || m.isArenasMap || m.isControlMap));
    /** Num rows to add when user reaches the bottom of the scroll */
    private numAddRowsScroll = 25;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly googleAnalytics: GoogleAnalyticsService,
        private readonly match: MatchService,
        private readonly reportingService: ReportingService
    ) {
        const bloatedGenericMapList = this._mapList
            .map((m) => latestGenericMap(m.mapGenericId, this._mapList))
            .filter((m) => !!m) as MatchMap[];
        const uniqueGenericMapList = unique(bloatedGenericMapList, (m) => m.mapGenericId);
        this.mapGenericList = uniqueGenericMapList;
        this.filteredMapGenericList = this.mapGenericList;
    }

    public matchTrackBy: TrackByFunction<MatchDataStore> = (_, item) => item.matchId ?? item.endDate;
    public durationSinceNow = (baseDate: Date): Duration => intervalToDuration({ start: baseDate, end: new Date() });
    public getGameModeTypeName = (gameModeId: string): Optional<string> =>
        MatchGameMode.getFromId(MatchGameModeList, gameModeId).gameModeGenericId;
    public getMapFilename = MatchMap.getLayoutFilename;

    //#region Lifecycle Methods
    public ngOnInit(): void {
        this.setupLiveMatchListeners();
        this.setupSearchForm();
        this.getMatchList$()
            .pipe(takeUntil(this.destroy$))
            .subscribe((matchList) => {
                this.matchList = matchList;
                this.refreshUI();
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
    //#endregion

    public onResetClick(): void {
        this.searchForm.reset("", { emitEvent: false });
        this.resetFilters.next();
        this.numDisplayMatches = DEFAULT_NUM_ROWS;
        this.refreshUI();
    }

    public setAvgToggle(value: boolean): void {
        this.avgToggle = value;
        this.refreshUI();
    }

    public onSelectedMapsChange(selectedMaps: MatchMap[]): void {
        this.filteredMapGenericList = selectedMaps;
        this.refreshUI();
    }

    public onSelectedGameModesChange(selectedGameModes: MatchGameMode[]): void {
        this.filteredGameModeList = selectedGameModes;
        this.refreshUI();
    }

    public onSelectedLegendsChange(selectedLegends: Legend[]): void {
        this.filteredLegendList = selectedLegends;
        this.refreshUI();
    }

    public onSelectMatchClick(): void {}

    public onTeamRosterClick(teamRosterPlayer: TeamRosterPlayer): void {
        this.searchForm.setValue(`"${teamRosterPlayer.name}"`);
    }

    public onMatchListingScroll(event: Event): void {
        const requiredBottomDistance = 100;
        const target = event.target as HTMLDivElement;
        const distanceFromBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
        const hasMoreRowsToDisplay = this.numDisplayMatches <= this.filteredMatchList.length;

        if (!hasMoreRowsToDisplay) return;
        if (distanceFromBottom < requiredBottomDistance) {
            this.numDisplayMatches += this.numAddRowsScroll;
        }
    }

    //#region Setup
    private setupLiveMatchListeners(): void {
        // New match was reported to local database
        this.reportingService.reportingEvent$
            .pipe(
                takeUntil(this.destroy$),
                filter((reportingEvent) => reportingEvent.engine.engineId === ReportingEngineId.Local),
                filter((localReportingStatus) => localReportingStatus.status === ReportingStatus.SUCCESS),
                switchMap(() => this.getMatchList$())
            )
            .subscribe((matchList) => {
                this.matchList = matchList;
                this.refreshUI();
            });
    }

    private setupSearchForm(): void {
        const pauseTime = 250;
        this.searchForm.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(pauseTime)).subscribe(() => {
            const searchInput = this.searchForm.value;
            if (searchInput?.trim().toLowerCase() === "") this.numAddRowsScroll = DEFAULT_NUM_ROWS;
            this.googleAnalytics.sendEvent("Match Explorer", "Matches Search", searchInput);
            this.refreshUI();
        });
    }

    private getMatchList$(): Observable<MatchDataStore[]> {
        this.isLoadingMatchList = true;
        return this.match.getAllMatchData$().pipe(finalize(() => (this.isLoadingMatchList = false)));
    }

    private refreshUI(): void {
        this.filteredMatchList = this.matchList.filter((match) => {
            return (
                this.isMatchInGameModeFilter(match) &&
                this.isMatchInMapFilter(match) &&
                this.isMatchInLegendFilter(match) &&
                this.isMatchInSearchInput(match)
            );
        });

        this.filteredSumStats = sumStats(this.filteredMatchList);
        this.filteredAvgStats = avgStats(this.filteredMatchList);

        this.cdr.detectChanges();
    }

    private isMatchInGameModeFilter(match: MatchDataStore): boolean {
        const isFilterSet = this.filteredGameModeList.length < this.gameModeList.length;
        const isFilterEmpty = !this.filteredGameModeList.length;
        const isGameModeEmpty = isEmpty(match.gameModeId);
        if (!isFilterSet || isFilterEmpty || isGameModeEmpty) return true;

        const matchGameMode = MatchGameMode.getFromId(this.gameModeList, match.gameModeId!);
        const foundGameMode = this.filteredGameModeList.find((gameMode) => gameMode.gameModeGenericId === matchGameMode.gameModeGenericId);
        return !!foundGameMode;
    }

    /** Uses map's generic ID to search match's mapID */
    private isMatchInMapFilter(match: MatchDataStore): boolean {
        const isFilterSet = this.filteredMapGenericList.length < this.mapGenericList.length;
        const isFilterEmpty = !this.filteredMapGenericList.length;
        const isMapEmpty = isEmpty(match.mapId);
        if (!isFilterSet || isFilterEmpty || isMapEmpty) return true;

        const matchMap = MatchMap.getFromId(match.mapId ?? "", this._mapList);
        if (!matchMap) return true;
        const foundMatchMap = this.filteredMapGenericList.find((map) => map.mapGenericId === matchMap.mapGenericId);
        return !!foundMatchMap;
    }

    private isMatchInLegendFilter(match: MatchDataStore): boolean {
        const isFilterSet = this.filteredLegendList.length < this.legendList.length;
        const isFilterEmpty = !this.filteredLegendList.length;
        const isLegendEmpty = isEmpty(match.legendId);
        if (!isFilterSet || isFilterEmpty || isLegendEmpty) return true;

        const foundLegend = this.filteredLegendList.find((legend) => legend.legendId === match.legendId);
        return !!foundLegend;
    }

    private isMatchInSearchInput(match: MatchDataStore): boolean {
        const searchInput = (this.searchForm.value as string)?.trim().toLowerCase() ?? "";
        if (isEmpty(searchInput)) return true;
        const parsedSearch = this.parseSearchInput(searchInput);
        return (
            this.isSearchInMatchData(parsedSearch.searchInput, match, parsedSearch.isExact) ||
            this.isSpecialSearchFound(parsedSearch.searchInput, match, parsedSearch.isExact) ||
            this.isSearchInStats(parsedSearch.searchInput, match)
        );
    }

    //#region Search
    /** Cleans search input by trimming whitespace. Checks for  */
    private parseSearchInput(searchInput: string): { searchInput: string; isExact: boolean } {
        searchInput = searchInput.trim().toLowerCase().replace(" ", "");
        const isExact = searchInput.substr(0, 1) === `"` && searchInput.substr(searchInput.length - 1, 1) === `"`;
        if (isExact) searchInput = searchInput.substring(1, searchInput.length - 1);
        return { searchInput, isExact };
    }

    private isSearchStringFound(needle: string, haystack: string, isExact: boolean): boolean {
        haystack = haystack.trim().toLowerCase().replace(" ", "");
        if (isEmpty(needle) || isEmpty(haystack)) return false;
        return isExact ? haystack === needle : haystack.includes(needle);
    }

    /**
     * Search using special keywords
     */
    private isSpecialSearchFound(searchInput: string, match: MatchDataStore, isExact: boolean): boolean {
        if (searchInput === "win" || searchInput === "wins" || searchInput === "won") {
            return match.placement === 1;
        } else if (searchInput === "lose" || searchInput === "lost") {
            return match.placement !== 1;
        } else if (searchInput === "solo") {
            return match.teamRoster?.length === 1;
        } else if (match.gameModeId && searchInput === "control") {
            const gameMode = MatchGameMode.getFromId(MatchGameModeList, match.gameModeId);
            return gameMode.gameModeGenericId === MatchGameModeGenericId.Control;
        } else if (match.gameModeId && (searchInput === "arena" || searchInput === "arenas")) {
            const gameMode = MatchGameMode.getFromId(MatchGameModeList, match.gameModeId);
            return gameMode.gameModeGenericId === MatchGameModeGenericId.Arenas;
        } else if (match.gameModeId && (searchInput === "battleroyale" || searchInput === "battle royale")) {
            const gameMode = MatchGameMode.getFromId(MatchGameModeList, match.gameModeId);
            return (
                gameMode.gameModeGenericId === MatchGameModeGenericId.BattleRoyale_Duos ||
                gameMode.gameModeGenericId === MatchGameModeGenericId.BattleRoyale_Ranked ||
                gameMode.gameModeGenericId === MatchGameModeGenericId.BattleRoyale_Trios
            );
        }
        return false;
    }

    private isSearchInStats(searchInput: string, match: MatchDataStore): boolean {
        if (isNaN(Number(searchInput))) return false;
        const numSearchInput = cleanInt(searchInput.replace(/[\D]+/g, ""));
        const foundInStats =
            (match.assists ?? 0) === numSearchInput ||
            (match.damage ?? 0) === numSearchInput ||
            (match.eliminations ?? 0) === numSearchInput ||
            (match.knockdowns ?? 0) === numSearchInput ||
            (match.placement ?? 0) === numSearchInput;
        return foundInStats;
    }

    private isSearchInMatchData(searchInput: string, match: MatchDataStore, isExact: boolean): boolean {
        const getLegendNameFn = (legendId: string): Optional<string> => Legend.getName(legendId)?.toLowerCase();

        const matchMap = match.mapId ? MatchMap.getFromId(match.mapId, this._mapList) : undefined;
        const gameMode = match.gameModeId ? MatchGameMode.getFromId(this.gameModeList, match.gameModeId) : undefined;

        const foundInMatchRoster = !!match.matchRoster?.find((mr) => this.isSearchStringFound(searchInput, mr.name, isExact));
        const foundInTeamRosterLegends = !!match.teamRoster?.find((tr) =>
            this.isSearchStringFound(searchInput, getLegendNameFn(tr.legendId) ?? "", isExact)
        );
        const foundInMapName = !!matchMap?.mapName && this.isSearchStringFound(searchInput, matchMap.mapName, isExact);
        const foundInMyName = !!match.myName && this.isSearchStringFound(searchInput, match.myName, isExact);
        const foundInMyLegendName =
            !!match.legendId && this.isSearchStringFound(searchInput, new Legend(match.legendId).name ?? "", isExact);
        const foundInGameMode = !!gameMode?.gameModeName && this.isSearchStringFound(searchInput, gameMode.gameModeName, isExact);

        return foundInMatchRoster || foundInTeamRosterLegends || foundInMapName || foundInMyName || foundInMyLegendName || foundInGameMode;
    }
    //#endregion
}

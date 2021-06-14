import { Legend } from "@allfather-app/app/common/legend/legend";
import { LegendList, sortLegendList } from "@allfather-app/app/common/legend/legend-list";
import { MatchGameMode } from "@allfather-app/app/common/match/game-mode/game-mode";
import { MatchGameModeList, sortMatchGameModeList } from "@allfather-app/app/common/match/game-mode/game-mode-list";
import { MatchMapList, sortMatchMapList } from "@allfather-app/app/common/match/map/map-list";
import { MatchMap } from "@allfather-app/app/common/match/map/match-map";
import { AvgMatchStats, avgStats, SumMatchStats, sumStats } from "@allfather-app/app/common/utilities/match-stats";
import { MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { ReportingEngineId, ReportingStatus } from "@allfather-app/app/modules/core/reporting/reporting-engine/reporting-engine";
import { ReportingService } from "@allfather-app/app/modules/core/reporting/reporting.service";
import { DataItem } from "@allfather-app/app/shared/components/match-listing/match-listing.component";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TrackByFunction } from "@angular/core";
import { FormControl } from "@angular/forms";
import { mdiFilterVariantRemove } from "@mdi/js";
import { intervalToDuration } from "date-fns";
import { Observable, Subject } from "rxjs";
import { debounceTime, filter, finalize, switchMap, takeUntil } from "rxjs/operators";
import { cleanInt } from "shared/utilities";

type TeamRosterPlayer = NonNullable<MatchDataStore["teamRoster"]>[0];

@Component({
    selector: "app-match-explorer-page",
    templateUrl: "./match-explorer-page.component.html",
    styleUrls: ["./match-explorer-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchExplorerPageComponent implements OnInit, AfterViewInit, OnDestroy {
    public isLoadingMatchList = false;
    public resetFilters = new Subject<void>();
    public get areFiltersResettable(): boolean {
        return (
            this.filteredMatchList.length < this.matchList.length ||
            this.filteredMapList.length < this.mapList.length ||
            this.filteredGameModeList.length < this.gameModeList.length ||
            this.filteredLegendList.length < this.legendList.length ||
            !!this.searchForm.value?.length
        );
    }
    public searchForm = new FormControl();
    public matchList: MatchDataStore[] = [];
    public mapList = sortMatchMapList(MatchMapList.filter((m) => m.isBattleRoyaleMap || m.isArenasMap));
    public gameModeList = sortMatchGameModeList(
        MatchGameModeList.filter((g) => g.isAFSupported && (g.isBattleRoyaleGameMode || g.isArenasGameMode))
    );
    public legendList = sortLegendList(LegendList);

    public filteredMatchList: MatchDataStore[] = this.matchList;
    public filteredMapList: MatchMap[] = this.mapList;
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

    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly match: MatchService,
        private readonly reportingService: ReportingService
    ) {}

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

    public ngAfterViewInit(): void {}

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
    //#endregion

    public onResetClick(): void {
        this.searchForm.reset("", { emitEvent: false });
        this.resetFilters.next();
        this.refreshUI();
    }

    public setAvgToggle(value: boolean): void {
        this.avgToggle = value;
        this.refreshUI();
    }

    public onSelectedMapsChange(selectedMaps: MatchMap[]): void {
        this.filteredMapList = selectedMaps;
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
        this.searchForm.setValue(teamRosterPlayer.name);
    }

    //#region Setup
    private setupLiveMatchListeners(): void {
        // Match started event
        this.match.startedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {});

        // Match ended event
        this.match.endedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {});

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
        this.searchForm.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(50)).subscribe((searchInput) => {
            this.refreshUI();
        });
    }

    private getMatchList$(): Observable<MatchDataStore[]> {
        this.isLoadingMatchList = true;
        return this.match.getAllMatchData$().pipe(finalize(() => (this.isLoadingMatchList = false)));
    }

    private refreshUI(): void {
        this.filteredMatchList = this.matchList.filter((match) => {
            if (this.gameModeList.length && match.gameModeId) {
                const matchGameMode = MatchGameMode.getFromId(this.gameModeList, match.gameModeId);
                const foundGameMode = this.filteredGameModeList.find(
                    (gameMode) => gameMode.gameModeGenericId === matchGameMode.gameModeGenericId
                );
                if (!foundGameMode) return false;
            }

            if (this.mapList.length && match.mapId) {
                const matchMap = MatchMap.getFromId(this.mapList, match.mapId);
                if (!matchMap) return;
                const foundMatchMap = this.filteredMapList.find((map) => map.mapGenericId === matchMap.mapGenericId);
                if (!foundMatchMap) return false;
            }

            if (this.legendList.length && match.legendId) {
                if (!match.legendId) return;
                const foundLegend = this.filteredLegendList.find((legend) => legend.legendId === match.legendId);
                if (!foundLegend) return false;
            }

            const searchInput = (this.searchForm.value as string)?.trim().toLowerCase() ?? "";
            if (searchInput) {
                const searchFound = this.searchMatch(searchInput, match);
                if (!searchFound) return false;
            }

            return true;
        });

        this.filteredSumStats = sumStats(this.filteredMatchList);
        this.filteredAvgStats = avgStats(this.filteredMatchList);

        this.cdr.detectChanges();
    }

    /**
     * Returns true if a search term is found within any of the match data
     */
    private searchMatch(searchInput: string, match: MatchDataStore): boolean {
        const isNumber = !isNaN(Number(searchInput));
        if (isNumber) {
            const numSearchInput = cleanInt(searchInput.replace(/[\D]+/g, ""));
            const foundInStats =
                (match.assists ?? 0) === numSearchInput ||
                (match.damage ?? 0) === numSearchInput ||
                (match.eliminations ?? 0) === numSearchInput ||
                (match.knockdowns ?? 0) === numSearchInput ||
                (match.placement ?? 0) === numSearchInput;
            return foundInStats;
        }

        searchInput = searchInput.toLowerCase();
        // Special Searches
        if (searchInput === "win" || searchInput === "wins" || searchInput === "won") {
            return match.placement === 1;
        } else if (searchInput === "loose" || searchInput === "lost") {
            return match.placement !== 1;
        } else if (searchInput === "solo") {
            return match.teamRoster?.length === 1;
        }

        const simplifyTextFn = (input: string): string => input.trim().toLowerCase().replace(" ", "");
        const getLegendNameFn = (legendId: string): Optional<string> => Legend.getName(legendId)?.toLowerCase();

        const matchMap = match.mapId ? MatchMap.getFromId(this.mapList, match.mapId) : undefined;
        const gameMode = match.gameModeId ? MatchGameMode.getFromId(this.gameModeList, match.gameModeId) : undefined;

        const foundInMatchRoster = !!match.matchRoster?.find((mr) => simplifyTextFn(mr.name).includes(searchInput));
        const foundInTeamRosterLegends = !!match.teamRoster?.find((tr) => getLegendNameFn(tr.legendId)?.includes(searchInput));
        const foundInMapName = !!matchMap?.mapName.toLowerCase().includes(searchInput);
        const foundInMyName = !!match.myName?.toLowerCase().includes(searchInput);
        const foundInMyLegendName = !!match.myName?.toLowerCase().includes(searchInput);
        const foundInGameMode = !!gameMode?.gameModeName?.toLowerCase().includes(searchInput);

        return foundInMatchRoster || foundInTeamRosterLegends || foundInMapName || foundInMyName || foundInMyLegendName || foundInGameMode;
    }
}

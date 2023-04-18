import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { mdiFilterVariantRemove } from "@mdi/js";
import { Legend } from "@app/app/common/legend/legend";
import { MatchGameMode } from "@app/app/common/match/game-mode/game-mode";
import { MatchMap } from "@app/app/common/match/map/match-map";
import { MatchFilters } from "@app/app/common/utilities/match-filters";
import { AvgMatchStats, avgStats, SumMatchStats, sumStats } from "@app/app/common/utilities/match-stats";
import { GoogleAnalyticsService } from "@app/app/modules/core/google-analytics.service";
import { MatchDataStore } from "@app/app/modules/core/local-database/match-data-store";
import { MatchService } from "@app/app/modules/core/match/match.service";
import { DataItem } from "@app/app/shared/components/match-listing/match-listing.component";
import { isEmpty } from "common/utilities/";
import { Observable, Subject } from "rxjs";
import { debounceTime, finalize, switchMap, takeUntil } from "rxjs/operators";

type TeamRosterPlayer = NonNullable<MatchDataStore["teamRoster"]>[0];
const DEFAULT_NUM_ROWS = 25;

@Component({
    selector: "app-match-explorer-page",
    templateUrl: "./match-explorer-page.component.html",
    styleUrls: ["./match-explorer-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchExplorerPageComponent implements OnInit, OnDestroy {
    //#region Match Filters
    public resetFilters = new Subject<void>();
    public get areFiltersResettable(): boolean {
        return (
            this.filteredMatchList.length < this.matchList.length ||
            this.matchFilters.selectedMapList.length < this.genericMapList.length ||
            this.matchFilters.selectedGameModeList.length < this.gameModeList.length ||
            this.matchFilters.selectedLegendList.length < this.legendList.length ||
            !!this.searchForm.value?.length
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
    public get gameModeList(): MatchGameMode[] {
        return this.matchFilters.gameModeList;
    }
    public get legendList(): Legend[] {
        return this.matchFilters.legendList;
    }
    private matchFilters = new MatchFilters(undefined, undefined, undefined, undefined, { chartableMapsOnly: false });
    //#endregion

    public isLoadingMatchList = false;
    public numDisplayMatches = DEFAULT_NUM_ROWS;
    public searchForm = new UntypedFormControl();
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
    public mdiFilterVariantRemove = mdiFilterVariantRemove;

    /** Num rows to add when user reaches the bottom of the scroll */
    private readonly numAddRowsScroll = 25;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly googleAnalytics: GoogleAnalyticsService,
        private readonly match: MatchService
    ) {}

    //#region Lifecycle Methods
    public ngOnInit(): void {
        this.setupLiveMatchListeners();
        this.setupSearchForm();
        this.getMatchList$()
            .pipe(takeUntil(this.destroy$))
            .subscribe((matchList) => {
                this.matchFilters.matchList = matchList;
                this.matchFilters.applyFilters();
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
        this.searchForm.reset("");
        this.resetFilters.next();
    }

    public onSelectedMapsChange(selectedMaps: MatchMap[]): void {
        this.matchFilters.selectedMapList = selectedMaps;
        this.matchFilters.applyFilters();
        this.refreshUI();
    }

    public onSelectedGameModesChange(selectedGameModes: MatchGameMode[]): void {
        this.matchFilters.selectedGameModeList = selectedGameModes;
        this.matchFilters.applyFilters();
        this.refreshUI();
    }

    public onSelectedLegendsChange(selectedLegends: Legend[]): void {
        this.matchFilters.selectedLegendList = selectedLegends;
        this.matchFilters.applyFilters();
        this.refreshUI();
    }
    //#endregion

    public setAvgToggle(value: boolean): void {
        this.avgToggle = value;
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
        const hasMoreRowsToDisplay = this.numDisplayMatches <= this.matchFilters.filteredMatchList.length;

        if (!hasMoreRowsToDisplay) return;
        if (distanceFromBottom < requiredBottomDistance) {
            this.numDisplayMatches += this.numAddRowsScroll;
        }
    }

    //#region Setup
    private setupLiveMatchListeners(): void {
        this.match.onMatchDataStoreChanged$ // Match was updated or added to local database
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.getMatchList$())
            )
            .subscribe((matchList) => {
                this.matchFilters.matchList = matchList;
                this.matchFilters.applyFilters();
                this.refreshUI();
            });
    }

    private setupSearchForm(): void {
        const pauseTime = 250;
        this.searchForm.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(pauseTime)).subscribe(() => {
            const searchInput = this.searchForm.value;
            if (isEmpty(searchInput)) this.numDisplayMatches = DEFAULT_NUM_ROWS;
            this.matchFilters.searchQuery = searchInput;
            this.matchFilters.applyFilters();
            this.refreshUI();
            this.googleAnalytics.sendEvent("Match Explorer", "Matches Search", searchInput);
        });
    }

    private getMatchList$(): Observable<MatchDataStore[]> {
        this.isLoadingMatchList = true;
        return this.match.getAllMatchData$().pipe(finalize(() => (this.isLoadingMatchList = false)));
    }

    private refreshUI(): void {
        this.filteredSumStats = sumStats(this.matchFilters.filteredMatchList);
        this.filteredAvgStats = avgStats(this.matchFilters.filteredMatchList);

        this.cdr.detectChanges();
    }
}

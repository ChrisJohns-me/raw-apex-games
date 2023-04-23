import { Legend } from "#app/models/legend/legend.js";
import { MatchGameMode } from "#app/models/match/game-mode/game-mode.js";
import { MatchMap } from "#app/models/match/map/match-map.js";
import { MatchFilters } from "#app/models/utilities/match-filters.js";
import { MatchDataStore } from "#app/modules/core/local-database/match-data-store.js";
import { MatchService } from "#app/modules/core/match/match.service.js";
import { ReportingService } from "#app/modules/core/reporting/reporting.service.js";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { mdiFilterVariantRemove } from "@mdi/js";
import { Observable, Subject } from "rxjs";
import { finalize, switchMap, takeUntil } from "rxjs/operators";

enum StatsType {
    Hourly = "Hourly",
    Daily = "Daily",
    Monthly = "Monthly",
    Quarterly = "Quarterly",
    Yearly = "Yearly",
}

@Component({
    selector: "app-charting-page",
    templateUrl: "./charting-page.component.html",
    styleUrls: ["./charting-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartingPageComponent implements OnInit, AfterViewInit, OnDestroy {
    //#region Match Filters
    public resetFilters = new Subject<void>();
    public get areFiltersResettable(): boolean {
        return (
            this.filteredMatchList.length < this.matchList.length ||
            this.matchFilters.selectedMapList.length < this.genericMapList.length ||
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
    public get gameModeList(): MatchGameMode[] {
        return this.matchFilters.gameModeList;
    }
    public get legendList(): Legend[] {
        return this.matchFilters.legendList;
    }
    private _supportedGameModeList: MatchGameMode[] = MatchFilters.getNonSandboxGameModeList().filter((gm) => gm.isBattleRoyaleGameMode);
    private matchFilters = new MatchFilters(undefined, undefined, this._supportedGameModeList, undefined);
    //#endregion

    public viewingStatsType = StatsType.Daily;
    public get viewingStatsUnit(): "hour" | "day" | "month" | "quarter" | "year" {
        if (this.viewingStatsType === StatsType.Yearly) return "year";
        else if (this.viewingStatsType === StatsType.Quarterly) return "quarter";
        else if (this.viewingStatsType === StatsType.Monthly) return "month";
        else if (this.viewingStatsType === StatsType.Daily) return "day";
        else return "hour";
    }
    public isLoadingMatchList = false;

    // Pass-through variables
    public mdiFilterVariantRemove = mdiFilterVariantRemove;
    public StatsType = StatsType;
    public statsTypeList = Object.values(StatsType);

    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly match: MatchService,
        private readonly reporting: ReportingService
    ) {}

    //#region Lifecycle Methods
    public ngOnInit(): void {
        this.setupLiveMatchListeners();
    }

    public ngAfterViewInit(): void {
        this.refreshUI();

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
        this.resetFilters.next();
        this.matchFilters.applyFilters();
        this.refreshUI();
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

    /** @returns Match List */
    private getMatchList$(): Observable<MatchDataStore[]> {
        this.isLoadingMatchList = true;
        return this.match.getAllMatchData$().pipe(finalize(() => (this.isLoadingMatchList = false)));
    }

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
}

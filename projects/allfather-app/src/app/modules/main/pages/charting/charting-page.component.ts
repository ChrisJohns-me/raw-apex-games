import { Legend } from "@allfather-app/app/common/legend/legend";
import { MatchGameMode } from "@allfather-app/app/common/match/game-mode/game-mode";
import { MatchMap } from "@allfather-app/app/common/match/map/match-map";
import { MatchFilters } from "@allfather-app/app/common/utilities/match-filters";
import { MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { ReportingEngineId, ReportingStatus } from "@allfather-app/app/modules/core/reporting/reporting-engine/reporting-engine";
import { ReportingService } from "@allfather-app/app/modules/core/reporting/reporting.service";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { mdiFilterVariantRemove } from "@mdi/js";
import { Observable, Subject } from "rxjs";
import { filter, finalize, switchMap, takeUntil, tap } from "rxjs/operators";

const MONTHLYAVG_REQUIRED_DAYS = 60;

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
    private _supportedGameModeList: MatchGameMode[] = MatchFilters.getNonTrainingGameModeList().filter((gm) => gm.isBattleRoyaleGameMode);
    private matchFilters = new MatchFilters(undefined, undefined, this._supportedGameModeList, undefined);
    //#endregion

    public showMonthlyAvgGraph = false;
    public isLoadingMatchList = false;

    // Pass-through variables
    public mdiFilterVariantRemove = mdiFilterVariantRemove;

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
        // New match was reported to local database
        this.reporting.reportingEvent$
            .pipe(
                takeUntil(this.destroy$),
                filter((reportingEvent) => reportingEvent.engine.engineId === ReportingEngineId.LocalDB),
                filter((localDBReportingStatus) => localDBReportingStatus.status === ReportingStatus.SUCCESS),
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
        return this.match.getAllMatchData$().pipe(
            finalize(() => (this.isLoadingMatchList = false)),
            tap((matchList) => (this.showMonthlyAvgGraph = this.shouldShowMonthlyAvgGraph(matchList)))
        );
    }

    private shouldShowMonthlyAvgGraph(matchList: MatchDataStore[]): boolean {
        const now = new Date();
        const oldestMatchDate = matchList
            .slice()
            .sort((a, b) => (b.startDate?.getDate() ?? Infinity) - (a.startDate?.getDate() ?? Infinity))
            .find((match) => match.startDate?.getTime() ?? 0 > 0)?.startDate;

        if (!oldestMatchDate) return false;
        const lifespan = now.getTime() - oldestMatchDate.getTime();
        return lifespan > 1000 * 60 * 60 * 24 * MONTHLYAVG_REQUIRED_DAYS;
    }

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
}

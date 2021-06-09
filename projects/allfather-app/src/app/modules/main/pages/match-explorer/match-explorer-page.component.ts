import { Legend } from "@allfather-app/app/common/legend/legend";
import { LegendList, sortLegendList } from "@allfather-app/app/common/legend/legend-list";
import { MatchGameMode } from "@allfather-app/app/common/match/game-mode/game-mode";
import { MatchGameModeList, sortMatchGameModeList } from "@allfather-app/app/common/match/game-mode/game-mode-list";
import { MatchMapList, sortMatchMapList } from "@allfather-app/app/common/match/map/map-list";
import { MatchMap } from "@allfather-app/app/common/match/map/match-map";
import { MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import { MatchPlayerLegendService } from "@allfather-app/app/modules/core/match/match-player-legend.service";
import { MatchPlayerLocationService } from "@allfather-app/app/modules/core/match/match-player-location.service";
import { MatchPlayerStatsService } from "@allfather-app/app/modules/core/match/match-player-stats.service";
import { MatchRosterService } from "@allfather-app/app/modules/core/match/match-roster.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { ReportingEngineId, ReportingStatus } from "@allfather-app/app/modules/core/reporting/reporting-engine/reporting-engine";
import { ReportingService } from "@allfather-app/app/modules/core/reporting/reporting.service";
import { DataItem } from "@allfather-app/app/shared/components/match-listing/match-listing.component";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TrackByFunction } from "@angular/core";
import { intervalToDuration } from "date-fns";
import { merge, Observable, Subject } from "rxjs";
import { filter, finalize, switchMap, takeUntil } from "rxjs/operators";

@Component({
    selector: "app-match-explorer-page",
    templateUrl: "./match-explorer-page.component.html",
    styleUrls: ["./match-explorer-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchExplorerPageComponent implements OnInit, AfterViewInit, OnDestroy {
    public DataItem: typeof DataItem = DataItem;
    public isLoadingMatchList = false;
    public matchList: MatchDataStore[] = [];
    public mapList = sortMatchMapList(MatchMapList.filter((m) => m.isActive && (m.isBattleRoyaleMap || m.isArenasMap)));
    public gameModeList = sortMatchGameModeList(
        MatchGameModeList.filter((g) => g.isActive && (g.isBattleRoyaleGameMode || g.isArenasGameMode))
    );
    public legendList = sortLegendList(LegendList);
    public filteredMatchList: MatchDataStore[] = this.matchList;
    public filteredMapList: MatchMap[] = this.mapList;
    public filteredGameModeList: MatchGameMode[] = this.gameModeList;
    public filteredLegendList: Legend[] = this.legendList;

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

    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly match: MatchService,
        private readonly matchPlayerLegend: MatchPlayerLegendService,
        private readonly matchPlayerLocation: MatchPlayerLocationService,
        private readonly matchPlayerStats: MatchPlayerStatsService,
        private readonly matchRoster: MatchRosterService,
        private readonly player: PlayerService,
        private readonly reportingService: ReportingService
    ) {
        console.debug(MatchGameModeList, this.gameModeList);
    }

    public matchTrackBy: TrackByFunction<MatchDataStore> = (_, item) => item.matchId ?? item.endDate;
    public durationSinceNow = (baseDate: Date): Duration => intervalToDuration({ start: baseDate, end: new Date() });
    public getGameModeTypeName = (gameModeId: string): Optional<string> =>
        MatchGameMode.getFromId(MatchGameModeList, gameModeId).gameModeGenericId;
    public getMapFilename = MatchMap.getLayoutFilename;

    //#region Lifecycle Methods
    public ngOnInit(): void {
        this.setupLiveMatchListeners();
        this.setupEventListeners();
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

    //#region Setup
    private setupEventListeners(): void {}

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
                // this.matchList = matchList;

                this.refreshUI();
            });

        // Update Live Match data
        merge(
            this.match.gameMode$,
            this.match.matchId$,
            this.match.state$,
            this.match.state$,
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
                this.refreshUI();
            });
    }

    private getMatchList$(): Observable<MatchDataStore[]> {
        this.isLoadingMatchList = true;
        return this.match.getAllMatchData$().pipe(finalize(() => (this.isLoadingMatchList = false)));
    }

    /**
     * @todo Optimize by combining all filter loops into one.
     */
    private refreshUI(): void {
        this.filteredMatchList = this.matchList;
        if (this.gameModeList.length) {
            this.filteredMatchList = this.filteredMatchList.filter((match) => {
                if (!match.gameModeId) return;
                const matchGameMode = MatchGameMode.getFromId(this.gameModeList, match.gameModeId);
                return !!this.filteredGameModeList.find((gameMode) => gameMode.gameModeGenericId === matchGameMode.gameModeGenericId);
            });
        }

        if (this.mapList.length) {
            this.filteredMatchList = this.filteredMatchList.filter((match) => {
                if (!match.mapId) return;
                const matchMap = MatchMap.getFromId(this.mapList, match.mapId);
                if (!matchMap) return;
                return !!this.filteredMapList.find((map) => map.mapGenericId === matchMap.mapGenericId);
            });
        }

        if (this.legendList.length) {
            this.filteredMatchList = this.filteredMatchList.filter((match) => {
                if (!match.legendId) return;
                return !!this.filteredLegendList.find((legend) => legend.legendId === match.legendId);
            });
        }

        this.cdr.detectChanges();
    }
}

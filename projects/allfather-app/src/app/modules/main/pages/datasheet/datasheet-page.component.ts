import { MatchGameMode } from "@allfather-app/app/common/match/game-mode/game-mode";
import { MatchGameModeList } from "@allfather-app/app/common/match/game-mode/game-mode-list";
import { MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import { MatchPlayerLegendService } from "@allfather-app/app/modules/core/match/match-player-legend.service";
import { MatchPlayerLocationService } from "@allfather-app/app/modules/core/match/match-player-location.service";
import { MatchPlayerStatsService } from "@allfather-app/app/modules/core/match/match-player-stats.service";
import { MatchRosterService } from "@allfather-app/app/modules/core/match/match-roster.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { ReportingService } from "@allfather-app/app/modules/core/reporting/reporting.service";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { merge, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

enum GroupBy {
    Legend = "Legend",
    Weapon = "Weapon",
    GameMode = "Game Mode",
    Map = "Map",
}

@Component({
    selector: "app-datasheet-page",
    templateUrl: "./datasheet-page.component.html",
    styleUrls: ["./datasheet-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasheetPageComponent implements OnInit, AfterViewInit, OnDestroy {
    public GroupBy: typeof GroupBy = GroupBy;

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
    ) {}

    public getGameModeTypeName = (gameModeId: string): Optional<string> =>
        MatchGameMode.getFromId(MatchGameModeList, gameModeId).gameModeGenericId;

    //#region Lifecycle Methods
    public ngOnInit(): void {
        this.setupLiveMatchListeners();
        this.setupEventListeners();
    }

    public ngAfterViewInit(): void {}

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
    //#endregion

    public onSelectMatchClick(match?: MatchDataStore): void {}

    //#region Setup
    private setupEventListeners(): void {}

    private setupLiveMatchListeners(): void {
        // Match started event
        this.match.startedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {});

        // Match ended event
        this.match.endedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {});

        // New match was reported to local database
        // this.reportingService.reportingEvent$
        //     .pipe(
        //         takeUntil(this.destroy$),
        //         filter((reportingEvent) => reportingEvent.engine.engineId === ReportingEngineId.Local),
        //         filter((localReportingStatus) => localReportingStatus.status === ReportingStatus.SUCCESS),
        //         switchMap(() => this.getMatchList())
        //     )
        //     .subscribe((matchList) => {
        //         this.matchList = matchList;

        //         this.refreshUI();
        //     });

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

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
}

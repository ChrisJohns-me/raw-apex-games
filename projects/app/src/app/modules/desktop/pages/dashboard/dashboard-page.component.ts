import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Legend } from "@app/app/common/legend/legend";
import { MatchGameModeGenericId } from "@app/app/common/match/game-mode/game-mode.enum";
import { AvgMatchStats } from "@app/app/common/utilities/match-stats";
import { ConfigurationService } from "@app/app/modules/core/configuration.service";
import { MatchService } from "@app/app/modules/core/match/match.service";
import { PlayerLocalStatsService } from "@app/app/modules/core/player-local-stats.service";
import { PlayerService } from "@app/app/modules/core/player.service";
import { Stopwatch } from "common/utilities";
import { Observable, OperatorFunction, Subject, Subscription, combineLatest, concat, from, of } from "rxjs";
import { concatMap, filter, finalize, map, startWith, switchMap, take, takeUntil, tap } from "rxjs/operators";

type LegendIdsRow = string[];

@Component({
    selector: "app-dashboard-page",
    templateUrl: "./dashboard-page.component.html",
    styleUrls: ["./dashboard-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit, OnDestroy {
    public focusedLegendId?: string;
    public legendIdsRows$: Observable<LegendIdsRow[]>;
    public playerBattleRoyaleStats?: AvgMatchStats;
    public playerArenasStats?: AvgMatchStats;
    public legendBattleRoyaleStats?: AvgMatchStats;
    public get focusedLegendName(): Optional<string> {
        return this.focusedLegendId ? Legend.getName(this.focusedLegendId) : undefined;
    }
    public playerName?: string;
    public emptyStats: AvgMatchStats = {
        avgDamage: 0,
        avgDuration: 0,
        avgEliminations: 0,
        avgDeaths: 0,
        avgAssists: 0,
        avgKnockdowns: 0,
        avgPlacement: 0,
        avgWins: 0,
        numMatches: 0,
    };
    private hoverLegendSubscription?: Subscription;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly configuration: ConfigurationService,
        private readonly match: MatchService,
        private readonly player: PlayerService,
        private readonly playerLocalStats: PlayerLocalStatsService
    ) {
        this.legendIdsRows$ = of();
        // this.legendIdsRows$ = this.configuration.config$.pipe(
        //     map((config) => config.featureConfigs.legendSelectAssist.legendRows.map((iconRows) => iconRows.legendIds)),
        //     shareReplay(1)
        // );
    }

    public getLegendName = (legendId?: string): Optional<string> => Legend.getName(legendId);

    //#region Lifecycle Hooks
    public ngOnInit(): void {
        concat(this.loadPlayerName$().pipe(take(1)), this.loadPlayerBattleRoyaleStats$(), this.preloadAllLegendStats$())
            .pipe(takeUntil(this.destroy$))
            .subscribe();
        this.watchLocalDatabaseMatchChanges();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
    //#endregion

    //#region External Methods
    public hoverLegend(legendId: string): void {
        this.focusedLegendId = legendId;
        this.refreshUI();
        this.hoverLegendSubscription?.unsubscribe();

        this.hoverLegendSubscription = combineLatest([
            this.getBattleRoyaleLegendStats$(legendId).pipe(
                startWith(undefined),
                filter(() => legendId === this.focusedLegendId),
                tap((legendBattleRoyaleStats) => (this.legendBattleRoyaleStats = legendBattleRoyaleStats))
            ),
        ])
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.refreshUI());
    }

    public unhoverLegend(): void {
        this.focusedLegendId = undefined;
        this.legendBattleRoyaleStats = undefined;
        this.refreshUI();
    }
    //#endregion

    //#region Intermediate Methods
    private loadPlayerName$(): Observable<string> {
        return this.player.myName$.pipe(
            filter((playerName) => !!playerName) as OperatorFunction<Optional<string>, string>,
            tap((playerName) => {
                this.playerName = playerName;
                this.refreshUI();
            })
        );
    }

    private loadPlayerBattleRoyaleStats$(): Observable<AvgMatchStats> {
        return this.getPlayerBattleRoyaleStats$(true).pipe(
            tap((avgStats) => {
                this.playerBattleRoyaleStats = avgStats;
                this.refreshUI();
            })
        );
    }

    private watchLocalDatabaseMatchChanges(): void {
        this.match.onMatchDataStoreChanged$
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.loadPlayerBattleRoyaleStats$()),
                switchMap(() => this.preloadAllLegendStats$())
            )
            .subscribe();
    }

    private preloadAllLegendStats$(): Observable<void> {
        const stopwatch = new Stopwatch();
        console.info(`[DashboardPage] Preloading All Legend Stats`);
        stopwatch.start();
        return this.legendIdsRows$.pipe(
            map((legendIdsRows) => legendIdsRows.flatMap((row) => row)),
            switchMap((allLegendIds) => from(allLegendIds)),
            concatMap((legendId) => combineLatest([this.getBattleRoyaleLegendStats$(legendId, true)])),
            map(() => undefined),
            finalize(() => {
                stopwatch.stop();
                console.info(`[DashboardPage] Finished Preloading Legend Stats in ${stopwatch.result()}ms`);
                this.refreshUI();
            })
        );
    }
    //#endregion

    //#region Legend Stats Observables
    private getBattleRoyaleLegendStats$(legendId: string, breakCache = false): Observable<AvgMatchStats> {
        return this.playerLocalStats.getLegendGameModeGenericStats$(
            legendId,
            [
                MatchGameModeGenericId.BattleRoyale_Duos,
                MatchGameModeGenericId.BattleRoyale_Trios,
                MatchGameModeGenericId.BattleRoyale_Ranked,
            ],
            undefined,
            breakCache
        );
    }

    //#endregion

    //#region Player Stats Observables
    private getPlayerBattleRoyaleStats$(breakCache = false): Observable<AvgMatchStats> {
        return this.playerLocalStats.getPlayerGameModeGenericStats$(
            [
                MatchGameModeGenericId.BattleRoyale_Duos,
                MatchGameModeGenericId.BattleRoyale_Trios,
                MatchGameModeGenericId.BattleRoyale_Ranked,
            ],
            undefined,
            breakCache
        );
    }
    //#endregion

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
}

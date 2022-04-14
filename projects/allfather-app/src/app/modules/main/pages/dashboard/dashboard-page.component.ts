import { Legend } from "@allfather-app/app/common/legend/legend";
import { MatchGameModeGenericId } from "@allfather-app/app/common/match/game-mode/game-mode.enum";
import { AvgMatchStats } from "@allfather-app/app/common/utilities/match-stats";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { GoogleAnalyticsService } from "@allfather-app/app/modules/core/google-analytics.service";
import { LocalDatabaseService } from "@allfather-app/app/modules/core/local-database/local-database.service";
import { PlayerLocalStatsService } from "@allfather-app/app/modules/core/player-local-stats.service";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Stopwatch } from "common/utilities";
import { combineLatest, from, Observable, Subject, Subscription } from "rxjs";
import { concatMap, filter, finalize, map, startWith, takeUntil, tap } from "rxjs/operators";

type LegendIdsRow = string[];

const NUM_MY_SUGGESTED_LEGENDS = 3;
const NUM_LEGEND_SUGGESTED_LEGENDS = 2;
const NUM_SUGGESTED_WEAPONS = 2;

@Component({
    selector: "app-dashboard-page",
    templateUrl: "./dashboard-page.component.html",
    styleUrls: ["./dashboard-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit, OnDestroy {
    public focusedLegendId?: string;
    public legendIdsRows: LegendIdsRow[] = [];
    public playerBattleRoyaleStats?: AvgMatchStats;
    public playerArenasStats?: AvgMatchStats;
    public legendBattleRoyaleStats?: AvgMatchStats;
    public legendArenasStats?: AvgMatchStats;
    public playerComplimentaryLegendWeights?: { legendId: string; weightScore: number }[];
    public legendComplimentaryLegendWeights?: { legendId: string; weightScore: number }[];
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
        private readonly googleAnalytics: GoogleAnalyticsService,
        private readonly localDatabase: LocalDatabaseService,
        private readonly player: PlayerService,
        private readonly playerLocalStats: PlayerLocalStatsService
    ) {
        this.configuration.config$.pipe(takeUntil(this.destroy$)).subscribe((config) => {
            this.legendIdsRows = config.featureConfigs.legendSelectAssist.legendRows.map((iconRows) => iconRows.legendIds);
            this.preloadLegendStats(this.legendIdsRows);
        });

        // TODO: Remove, used for testing
        // const getMozambiqueherePlatform = (hw?: PlatformHardware): MozambiqueherePlatform => {
        //     switch (hw) {
        //         case PlatformHardware.PlayStation:
        //             return MozambiqueherePlatform.PS4;
        //         case PlatformHardware.Xbox:
        //             return MozambiqueherePlatform.X1;
        //         case PlatformHardware.Switch:
        //             return MozambiqueherePlatform.Switch;
        //         default:
        //             return MozambiqueherePlatform.PC;
        //     }
        // };
        // this.matchRoster.matchRoster$
        //     .pipe(
        //         takeUntil(this.destroy$),
        //         map((matchRoster) => {
        //             return matchRoster.allPlayers.map((p) => ({
        //                 playerName: p.name,
        //                 platform: getMozambiqueherePlatform(p.platformHardware),
        //             }));
        //         }),
        //         switchMap((players) => this.playerAccountStats.getBulkPlayerAccountStats$(players))
        //     )
        //     .subscribe((accountStatsArr: PlayerAccountStats[]) => {
        //         console.log(">>> Received Array of Player Account Stats");
        //         console.log(accountStatsArr);
        //     });
    }

    public getLegendName = (legendId?: string): Optional<string> => Legend.getName(legendId);

    //#region Lifecycle Hooks
    public ngOnInit(): void {
        this.setupPlayerName();
        this.loadPlayerBattleRoyaleStats();
        this.loadPlayerArenasStats();
        this.loadPlayerComplimentaryLegends();
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
            this.getArenasLegendStats$(legendId).pipe(
                startWith(undefined),
                filter(() => legendId === this.focusedLegendId),
                tap((legendArenasStats) => (this.legendArenasStats = legendArenasStats))
            ),
            this.getComplimentaryLegends$(legendId).pipe(
                startWith([]),
                filter(() => legendId === this.focusedLegendId),
                tap((legendComplimentaryLegendWeights) => (this.legendComplimentaryLegendWeights = legendComplimentaryLegendWeights))
            ),
        ])
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.refreshUI());
        this.googleAnalytics.sendEvent("Dashboard", "Legend Icon Hover", legendId);
    }

    public unhoverLegend(): void {
        this.focusedLegendId = undefined;
        this.legendBattleRoyaleStats = undefined;
        this.legendArenasStats = undefined;
        this.legendComplimentaryLegendWeights = undefined;
        this.refreshUI();
    }
    //#endregion

    //#region Intermediate Methods
    private setupPlayerName(): void {
        this.player.myName$.pipe(takeUntil(this.destroy$)).subscribe((myName) => {
            this.playerName = myName;
            this.refreshUI();
        });
    }

    private loadPlayerBattleRoyaleStats(): void {
        this.getPlayerBattleRoyaleStats$(true)
            .pipe(takeUntil(this.destroy$))
            .subscribe((avgStats) => {
                this.playerBattleRoyaleStats = avgStats;
                this.refreshUI();
            });
    }

    private loadPlayerArenasStats(): void {
        this.getPlayerArenasStats$(true)
            .pipe(takeUntil(this.destroy$))
            .subscribe((avgStats) => {
                this.playerArenasStats = avgStats;
                this.refreshUI();
            });
    }

    private loadPlayerComplimentaryLegends(): void {
        this.getPlayerComplimentaryLegendWeights$(true)
            .pipe(takeUntil(this.destroy$))
            .subscribe((legendWeights) => {
                const limitedLegendWeights = legendWeights.slice(0, NUM_MY_SUGGESTED_LEGENDS);
                this.playerComplimentaryLegendWeights = limitedLegendWeights;
                this.refreshUI();
            });
    }

    private watchLocalDatabaseMatchChanges(): void {
        this.localDatabase.onChanges$
            .pipe(
                takeUntil(this.destroy$),
                map((changes) => changes.find((c) => c.table === this.localDatabase.matches.name)),
                map((change) => (change as any)?.obj),
                filter((value) => value != null)
            )
            .subscribe(() => {
                this.loadPlayerBattleRoyaleStats();
                this.loadPlayerArenasStats();
                this.loadPlayerComplimentaryLegends();
                this.preloadLegendStats(this.legendIdsRows);
            });
    }

    private preloadLegendStats(legendIdsRows: LegendIdsRow[]): void {
        const allLegendIds = legendIdsRows.flatMap((row) => row);
        console.info(`[DashboardPage] Preloading Legend Stats for ${allLegendIds.length} legends`);

        const stopwatch = new Stopwatch();
        stopwatch.start();
        from(allLegendIds)
            .pipe(
                takeUntil(this.destroy$),
                concatMap((legendId) =>
                    combineLatest([
                        this.getBattleRoyaleLegendStats$(legendId, true),
                        this.getArenasLegendStats$(legendId, true),
                        this.getComplimentaryLegends$(legendId, true),
                    ])
                ),
                finalize(() => {
                    stopwatch.stop();
                    console.info(`[DashboardPage] Finished Preloading Legend Stats in ${stopwatch.result()}ms`);
                    this.refreshUI();
                })
            )
            .subscribe();
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

    private getArenasLegendStats$(legendId: string, breakCache = false): Observable<AvgMatchStats> {
        return this.playerLocalStats.getLegendGameModeGenericStats$(legendId, [MatchGameModeGenericId.Arenas], undefined, breakCache);
    }

    private getComplimentaryLegends$(legendId: string, breakCache = false): Observable<{ legendId: string; weightScore: number }[]> {
        return this.playerLocalStats
            .getLegendComplimentaryLegendWeights$(legendId, undefined, breakCache)
            .pipe(map((legendWeights) => legendWeights.slice(0, NUM_LEGEND_SUGGESTED_LEGENDS)));
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

    private getPlayerArenasStats$(breakCache = false): Observable<AvgMatchStats> {
        return this.playerLocalStats.getPlayerGameModeGenericStats$([MatchGameModeGenericId.Arenas], undefined, breakCache);
    }

    private getPlayerComplimentaryLegendWeights$(breakCache = false): Observable<{ legendId: string; weightScore: number }[]> {
        return this.playerLocalStats.getPlayerComplimentaryLegendWeights$(undefined, breakCache);
    }
    //#endregion
    private refreshUI(): void {
        this.cdr.detectChanges();
        // setTimeout(() => this.cdr.detectChanges(), 1000);
        // setTimeout(() => this.cdr.detectChanges(), 2000);
        // setTimeout(() => this.cdr.detectChanges(), 3000);
    }
}

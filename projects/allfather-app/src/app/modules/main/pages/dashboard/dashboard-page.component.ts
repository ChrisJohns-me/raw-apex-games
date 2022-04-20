import { Legend } from "@allfather-app/app/common/legend/legend";
import { MatchGameModeGenericId } from "@allfather-app/app/common/match/game-mode/game-mode.enum";
import { AvgMatchStats } from "@allfather-app/app/common/utilities/match-stats";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { GoogleAnalyticsService } from "@allfather-app/app/modules/core/google-analytics.service";
import { LocalDatabaseService } from "@allfather-app/app/modules/core/local-database/local-database.service";
import { MatchRosterService } from "@allfather-app/app/modules/core/match/match-roster.service";
import { PlayerAccountStatsService } from "@allfather-app/app/modules/core/player-account-stats/player-account-stats.service";
import { PlayerLocalStatsService } from "@allfather-app/app/modules/core/player-local-stats.service";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Stopwatch } from "common/utilities";
import { combineLatest, concat, from, Observable, of, Subject, Subscription } from "rxjs";
import { concatMap, filter, finalize, map, shareReplay, startWith, switchMap, take, takeUntil, tap } from "rxjs/operators";

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
    public legendIdsRows$: Observable<LegendIdsRow[]>;
    public playerBattleRoyaleStats?: AvgMatchStats;
    public playerArenasStats?: AvgMatchStats;
    public legendBattleRoyaleStats?: AvgMatchStats;
    public legendArenasStats?: AvgMatchStats;
    public playerComplimentaryLegendWeights?: { legendId: string; weightScore: number }[];
    public playerComplimentaryWeaponAvgEliminations?: { weaponId: string; avgEliminations: number }[];
    public legendComplimentaryLegendWeights?: { legendId: string; weightScore: number }[];
    public legendComplimentaryWeaponAvgEliminations?: { weaponId: string; avgEliminations: number }[];
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
    public get minShowComplimentaryLegendsMatches$(): Observable<Optional<number>> {
        return this.configuration.config$.pipe(
            map((config) => config.featureConfigs.legendSelectAssist.minShowComplimentaryLegendsMatches)
        );
    }
    private hoverLegendSubscription?: Subscription;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly configuration: ConfigurationService,
        private readonly googleAnalytics: GoogleAnalyticsService,
        private readonly localDatabase: LocalDatabaseService,
        private readonly matchRoster: MatchRosterService,
        private readonly player: PlayerService,
        private readonly playerLocalStats: PlayerLocalStatsService,
        private readonly playerAccountStats: PlayerAccountStatsService
    ) {
        this.legendIdsRows$ = this.configuration.config$.pipe(
            map((config) => config.featureConfigs.legendSelectAssist.legendRows.map((iconRows) => iconRows.legendIds)),
            shareReplay(1)
        );

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

        // const getTrackerPlatform = (pfHW?: PlatformSoftware): "xbl" | "origin" | "psn" => {
        //     switch (pfHW) {
        //         case PlatformSoftware.PlayStation:
        //             return "psn";
        //         case PlatformSoftware.Xbox:
        //             return "xbl";
        //         case PlatformSoftware.Origin:
        //         default:
        //             return "origin";
        //     }
        // };

        // this.matchRoster.matchRoster$
        //     .pipe(
        //         takeUntil(this.destroy$),
        //         map((matchRoster) => {
        //             return matchRoster.allPlayers.map((p) => {
        //                 return {
        //                     platform: getTrackerPlatform(p.platformSoftware),
        //                     nickname: p.name,
        //                 };
        //             });
        //         }),
        //         switchMap((reqBody) => this.getTrackerStats$(reqBody))
        //     )
        //     .subscribe();
    }

    private getTrackerStats$(reqBody: { platform: "xbl" | "origin" | "psn"; nickname: string }[]): Observable<any> {
        // TODO HERE
        return of([]);
    }

    public getLegendName = (legendId?: string): Optional<string> => Legend.getName(legendId);

    //#region Lifecycle Hooks
    public ngOnInit(): void {
        concat(
            this.loadPlayerName$().pipe(take(1)),
            this.loadPlayerBattleRoyaleStats$(),
            this.loadPlayerArenasStats$(),
            this.loadPlayerComplimentaryLegends$(),
            this.loadPlayerComplimentaryWeapons$(),
            this.preloadAllLegendStats$()
        )
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
            this.getComplimentaryWeapons$(legendId).pipe(
                startWith([]),
                filter(() => legendId === this.focusedLegendId),
                tap(
                    (legendComplimentaryWeaponAvgEliminations) =>
                        (this.legendComplimentaryWeaponAvgEliminations = legendComplimentaryWeaponAvgEliminations)
                )
            ),
        ])
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.refreshUI());
    }

    public unhoverLegend(): void {
        this.focusedLegendId = undefined;
        this.legendBattleRoyaleStats = undefined;
        this.legendArenasStats = undefined;
        this.legendComplimentaryLegendWeights = undefined;
        this.legendComplimentaryWeaponAvgEliminations = undefined;
        this.refreshUI();
    }
    //#endregion

    //#region Intermediate Methods
    private loadPlayerName$(): Observable<string> {
        return this.player.myName$.pipe(
            filter((playerName) => !!playerName),
            map((playerName) => playerName as string),
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

    private loadPlayerArenasStats$(): Observable<AvgMatchStats> {
        return this.getPlayerArenasStats$(true).pipe(
            tap((avgStats) => {
                this.playerArenasStats = avgStats;
                this.refreshUI();
            })
        );
    }

    private loadPlayerComplimentaryLegends$(): Observable<
        {
            legendId: string;
            weightScore: number;
        }[]
    > {
        return this.getPlayerComplimentaryLegendWeights$(true).pipe(
            tap((legendWeights) => {
                const limitedLegendWeights = legendWeights.slice(0, NUM_MY_SUGGESTED_LEGENDS);
                this.playerComplimentaryLegendWeights = limitedLegendWeights;
                this.refreshUI();
            })
        );
    }

    private loadPlayerComplimentaryWeapons$(): Observable<
        {
            weaponId: string;
            avgEliminations: number;
        }[]
    > {
        return this.getPlayerComplimentaryWeaponAvgEliminations$(true).pipe(
            tap((weaponAvgEliminations) => {
                const limitedWeaponAvgEliminations = weaponAvgEliminations.slice(0, NUM_SUGGESTED_WEAPONS);
                this.playerComplimentaryWeaponAvgEliminations = limitedWeaponAvgEliminations;
                this.refreshUI();
            })
        );
    }

    private watchLocalDatabaseMatchChanges(): void {
        this.localDatabase.onChanges$
            .pipe(
                tap(() => console.info(`>>> Local Database Match Changed`)),
                takeUntil(this.destroy$),
                map((changes) => changes.find((c) => c.table === this.localDatabase.matches.name)),
                map((change) => (change as any)?.obj),
                filter((value) => value != null),
                switchMap(() => this.loadPlayerBattleRoyaleStats$()),
                switchMap(() => this.loadPlayerComplimentaryLegends$()),
                switchMap(() => this.loadPlayerComplimentaryWeapons$()),
                switchMap(() => this.loadPlayerArenasStats$()),
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
            concatMap((legendId) =>
                combineLatest([
                    this.getBattleRoyaleLegendStats$(legendId, true),
                    this.getArenasLegendStats$(legendId, true),
                    this.getComplimentaryLegends$(legendId, true),
                    this.getComplimentaryWeapons$(legendId, true),
                ])
            ),
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

    private getArenasLegendStats$(legendId: string, breakCache = false): Observable<AvgMatchStats> {
        return this.playerLocalStats.getLegendGameModeGenericStats$(legendId, [MatchGameModeGenericId.Arenas], undefined, breakCache);
    }

    private getComplimentaryLegends$(legendId: string, breakCache = false): Observable<{ legendId: string; weightScore: number }[]> {
        return this.playerLocalStats
            .getLegendComplimentaryLegendWeights$(legendId, undefined, breakCache)
            .pipe(map((legendWeights) => legendWeights.slice(0, NUM_LEGEND_SUGGESTED_LEGENDS)));
    }

    private getComplimentaryWeapons$(legendId: string, breakCache = false): Observable<{ weaponId: string; avgEliminations: number }[]> {
        return this.playerLocalStats
            .getLegendComplimentaryAvgWeaponEliminations$(legendId, undefined, breakCache)
            .pipe(map((weaponAvgEliminations) => weaponAvgEliminations.slice(0, NUM_SUGGESTED_WEAPONS)));
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

    private getPlayerComplimentaryWeaponAvgEliminations$(breakCache = false): Observable<{ weaponId: string; avgEliminations: number }[]> {
        return this.playerLocalStats.getPlayerComplimentaryWeaponAvgEliminations$(undefined, breakCache);
    }
    //#endregion

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
}

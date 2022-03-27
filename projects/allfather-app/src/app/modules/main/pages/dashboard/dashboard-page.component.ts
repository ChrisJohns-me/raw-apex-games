import { Legend } from "@allfather-app/app/common/legend/legend";
import { MatchGameModeGenericId } from "@allfather-app/app/common/match/game-mode/game-mode.enum";
import { GoogleAnalyticsService } from "@allfather-app/app/common/services/google-analytics.service";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { LocalDatabaseService } from "@allfather-app/app/modules/core/local-database/local-database.service";
import { PlayerLocalStatsService } from "@allfather-app/app/modules/core/player-local-stats.service";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { AvgMatchStats } from "@allfather-app/app/modules/core/utilities/match-stats";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { combineLatest, Observable, Subject, Subscription } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";

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
export class DashboardPageComponent implements OnInit {
    public focusedLegendId?: string;
    public legendIdsRows: LegendIdsRow[] = [];
    public myBattleRoyaleStats?: AvgMatchStats;
    public myArenasStats?: AvgMatchStats;
    public legendBattleRoyaleStats?: AvgMatchStats;
    public legendArenasStats?: AvgMatchStats;
    public myComplimentaryLegendWeights?: { legendId: string; weightScore: number }[];
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
        private readonly playerStats: PlayerLocalStatsService
    ) {
        this.configuration.config$.pipe(takeUntil(this.destroy$)).subscribe((config) => {
            this.legendIdsRows = config.featureConfigs.legendSelectAssist.legendRows.map((iconRows) => iconRows.legendIds);
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

    public ngOnInit(): void {
        this.setupPlayerName();
        this.refreshMyStats();
        this.refreshMyComplimentaryLegends();
        this.watchLocalDatabase();
    }

    public hoverLegend(legendId: string): void {
        this.focusedLegendId = legendId;
        this.hoverLegendSubscription?.unsubscribe();
        this.hoverLegendSubscription = combineLatest([
            this.getBattleRoyaleLegendStats$(legendId),
            this.getArenasLegendStats$(legendId),
            this.getComplimentaryLegends$(legendId),
        ])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([legendBattleRoyaleStats, legendArenasStats, legendComplimentaryLegendWeights]) => {
                // this.focusedLegendId = legendId;
                if (legendId !== this.focusedLegendId) return;
                this.legendBattleRoyaleStats = legendBattleRoyaleStats;
                this.legendArenasStats = legendArenasStats;
                this.legendComplimentaryLegendWeights = legendComplimentaryLegendWeights;
                this.cdr.detectChanges();
            });
        this.googleAnalytics.sendEvent("Dashboard", "Legend Icon Hover", legendId);
    }

    public unhoverLegend(): void {
        this.focusedLegendId = undefined;
        this.legendBattleRoyaleStats = undefined;
        this.legendArenasStats = undefined;
        this.legendComplimentaryLegendWeights = undefined;
        this.cdr.detectChanges();
    }

    public getBattleRoyaleLegendStats$(legendId: string): Observable<AvgMatchStats> {
        return this.playerStats.getLegendGameModeGenericStats$(legendId, [
            MatchGameModeGenericId.BattleRoyale_Duos,
            MatchGameModeGenericId.BattleRoyale_Trios,
            MatchGameModeGenericId.BattleRoyale_Ranked,
        ]);
    }

    public getArenasLegendStats$(legendId: string): Observable<AvgMatchStats> {
        return this.playerStats.getLegendGameModeGenericStats$(legendId, [MatchGameModeGenericId.Arenas]);
    }

    public getComplimentaryLegends$(legendId: string): Observable<{ legendId: string; weightScore: number }[]> {
        return this.playerStats
            .getLegendComplimentaryLegendWeights$(legendId)
            .pipe(map((legendWeights) => legendWeights.slice(0, NUM_LEGEND_SUGGESTED_LEGENDS)));
    }

    private refreshMyStats(): void {
        // Battle Royale Stats
        this.playerStats
            .getPlayerGameModeGenericStats$(
                [
                    MatchGameModeGenericId.BattleRoyale_Duos,
                    MatchGameModeGenericId.BattleRoyale_Trios,
                    MatchGameModeGenericId.BattleRoyale_Ranked,
                ],
                undefined,
                true
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((avgStats) => {
                this.myBattleRoyaleStats = avgStats;
                this.cdr.detectChanges();
            });

        // Arena Stats
        this.playerStats
            .getPlayerGameModeGenericStats$([MatchGameModeGenericId.Arenas], undefined, true)
            .pipe(takeUntil(this.destroy$))
            .subscribe((avgStats) => {
                this.myArenasStats = avgStats;
                this.cdr.detectChanges();
            });
    }

    private refreshMyComplimentaryLegends(): void {
        this.playerStats
            .getPlayerComplimentaryLegendWeights$(undefined, true)
            .pipe(takeUntil(this.destroy$))
            .subscribe((legendWeights) => {
                const limitedLegendWeights = legendWeights.slice(0, NUM_MY_SUGGESTED_LEGENDS);
                this.myComplimentaryLegendWeights = limitedLegendWeights;
                this.cdr.detectChanges();
            });
    }

    private setupPlayerName(): void {
        this.player.myName$.pipe(takeUntil(this.destroy$)).subscribe((myName) => {
            this.playerName = myName;
            this.cdr.detectChanges();
        });
    }

    private watchLocalDatabase(): void {
        this.localDatabase.onChanges$
            .pipe(
                takeUntil(this.destroy$),
                map((changes) => changes.find((c) => c.table === this.localDatabase.matches.name)),
                map((change) => (change as any)?.obj),
                filter((value) => value != null)
            )
            .subscribe(() => {
                this.refreshMyStats();
                this.refreshMyComplimentaryLegends();
                this.playerStats.clearLegendCache();
            });
    }
}

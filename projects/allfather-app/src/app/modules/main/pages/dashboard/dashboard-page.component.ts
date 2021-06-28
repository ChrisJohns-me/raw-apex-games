import { Legend } from "@allfather-app/app/common/legend/legend";
import { AvgMatchStats } from "@allfather-app/app/common/utilities/match-stats";
import { GoogleAnalyticsService } from "@allfather-app/app/modules/core/google-analytics.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { ConfigurationService } from "../../../core/configuration.service";
import { LocalDatabaseService } from "../../../core/local-database/local-database.service";
import { PlayerLocalStatsService } from "../../../core/player-local-stats.service";
import { PlayerService } from "../../../core/player.service";

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
    public myStats?: AvgMatchStats;
    public legendStats?: AvgMatchStats;
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
        avgAssists: 0,
        avgKnockdowns: 0,
        avgPlacement: 0,
        avgWins: 0,
        numMatches: 0,
    };

    private legendStatsSubscription?: Subscription;
    private complimentaryLegendsSubscription?: Subscription;
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
    }

    public getLegendName = (legendId?: string): Optional<string> => Legend.getName(legendId);

    public ngOnInit(): void {
        this.setupPlayerName();
        this.refreshMyStats();
        this.refreshMyComplimentaryLegends();
        this.watchLocalDatabase();
    }

    public hoverLegend(legendId: string): void {
        this.showLegendStats(legendId);
        this.showComplimentaryLegends(legendId);
        this.focusedLegendId = legendId;
        this.googleAnalytics.sendEvent("Dashboard", "Legend Icon Hover", legendId);
        this.cdr.detectChanges();
    }

    public unhoverLegend(): void {
        this.focusedLegendId = undefined;
        this.legendStats = undefined;
        this.legendComplimentaryLegendWeights = undefined;
        this.cdr.detectChanges();
    }

    public showLegendStats(legendId: string): void {
        this.legendStatsSubscription?.unsubscribe();
        this.legendStatsSubscription = this.playerStats
            .getLegendStats$(legendId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((avgStats) => {
                this.legendStats = avgStats;
                this.cdr.detectChanges();
            });
    }

    public showComplimentaryLegends(legendId: string): void {
        this.complimentaryLegendsSubscription?.unsubscribe();
        this.complimentaryLegendsSubscription = this.playerStats
            .getLegendComplimentaryLegendWeights$(legendId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((legendWeights) => {
                const limitedLegendWeights = legendWeights.slice(0, NUM_LEGEND_SUGGESTED_LEGENDS);
                this.legendComplimentaryLegendWeights = limitedLegendWeights;
                this.cdr.detectChanges();
            });
    }

    private refreshMyStats(): void {
        this.playerStats
            .getPlayerStats$(undefined, true)
            .pipe(takeUntil(this.destroy$))
            .subscribe((avgStats) => {
                this.myStats = avgStats;
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

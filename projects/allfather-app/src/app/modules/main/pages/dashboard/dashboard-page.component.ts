import { Legend } from "@allfather-app/app/common/legend/legend";
import { AvgMatchStats } from "@allfather-app/app/common/utilities/match-stats";
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
    public legendIdsRows: LegendIdsRow[] = this.getLegendIdsRows();
    public myStats?: AvgMatchStats;
    public legendStats?: AvgMatchStats;
    public myComplimentaryLegendWeights?: { legendId: string; weightScore: number }[];
    public legendComplimentaryLegendWeights?: { legendId: string; weightScore: number }[];
    public get isLegendStatsEnabled(): boolean {
        return this._configIsLegendStatsEnabled && this._settingIsLegendStatsEnabled;
    }
    public get isComplimentaryLegendsEnabled(): boolean {
        return this._configIsComplimentaryLegendsEnabled && this._settingIsComplimentaryLegendsEnabled;
    }
    public get focusedLegendName(): Optional<string> {
        return this.focusedLegendId ? Legend.getName(this.focusedLegendId) : undefined;
    }
    public playerName?: string;
    public emptyStats: AvgMatchStats = {
        avgDamage: 0,
        avgDuration: 0,
        avgEliminations: 0,
        avgKnockdowns: 0,
        avgPlacement: 0,
        avgWins: 0,
        numMatches: 0,
    };

    private legendStatsSubscription?: Subscription;
    private complimentaryLegendsSubscription?: Subscription;
    private _configIsLegendStatsEnabled = this.config.featureFlags.legendSelectAssist.legendStats;
    private _configIsComplimentaryLegendsEnabled = this.config.featureFlags.legendSelectAssist.complimentaryLegends;
    private _settingIsLegendStatsEnabled = false;
    private _settingIsComplimentaryLegendsEnabled = false;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly config: ConfigurationService,
        private readonly localDatabase: LocalDatabaseService,
        private readonly player: PlayerService,
        private readonly playerStats: PlayerLocalStatsService
    ) {}

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

    /**
     * Uses just the legendIds of legend rows from the config file.
     */
    private getLegendIdsRows(): LegendIdsRow[] {
        const legendSelectIconRows = this.config.featureConfigs.legendSelectAssist.legendRows;
        return legendSelectIconRows.map((iconRows) => iconRows.legendIds);
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

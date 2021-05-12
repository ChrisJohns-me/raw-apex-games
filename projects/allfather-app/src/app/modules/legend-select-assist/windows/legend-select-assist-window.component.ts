import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { Legend } from "@allfather-app/app/shared/models/legend";
import { AvgMatchStats } from "@allfather-app/app/shared/models/utilities/match-stats";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { LegendIconRow } from "../legend-icon-row.interface";
import { LegendSelectAssistService } from "../legend-select-assist.service";

@Component({
    selector: "app-legend-select-assist-window",
    templateUrl: "./legend-select-assist-window.component.html",
    styleUrls: ["./legend-select-assist-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegendSelectAssistWindowComponent implements OnInit, OnDestroy {
    public isVisible = false;
    public focusedLegendId?: string;
    public legendStats?: AvgMatchStats;
    public legendIconRows: LegendIconRow[] = [];
    public complimentaryLegendWeights: { legendId: string; weightScore: number }[] = [];
    public isComplimentaryLegendsEnabled = this.config.featureFlags.legendSelectAssist.complimentaryLegends;
    public isLegendStatsEnabled = this.config.featureFlags.legendSelectAssist.legendStats;
    public minLegendStatsMatches = this.config.featureConfigs.legendSelectAssist.minLegendStatsMatches;
    public minShowComplimentaryLegendsMatches = this.config.featureConfigs.legendSelectAssist.minShowComplimentaryLegendsMatches;

    public get focusedLegendName(): Optional<string> {
        return this.focusedLegendId ? Legend.getName(this.focusedLegendId) : undefined;
    }

    private legendStatsSubscription?: Subscription;
    private complimentaryLegendsSubscription?: Subscription;
    private isDestroyed$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly config: ConfigurationService,
        private readonly legendSelectAssist: LegendSelectAssistService
    ) {
        this.legendIconRows = this.config.featureConfigs.legendSelectAssist.legendRows;
    }

    public ngOnInit(): void {}

    public ngOnDestroy(): void {
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
    }

    public focusLegend(legendId: string): void {
        this.showComplimentaryLegends(legendId);
        this.showLegendStats(legendId);
        this.focusedLegendId = legendId;
    }

    public showLegendStats(legendId: string): void {
        this.legendStatsSubscription?.unsubscribe();
        this.legendStatsSubscription = this.legendSelectAssist
            .getLegendStats(legendId)
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((avgStats) => {
                this.legendStats = avgStats;
                this.cdr.detectChanges();
            });
    }

    public showComplimentaryLegends(legendId: string): void {
        this.complimentaryLegendsSubscription?.unsubscribe();
        this.complimentaryLegendsSubscription = this.legendSelectAssist
            .getComplimentaryLegendWeights(legendId)
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((legendWeights) => {
                const limitedLegendWeights = legendWeights.slice(0, this.config.featureConfigs.legendSelectAssist.maxComplimentaryLegends);
                this.complimentaryLegendWeights = limitedLegendWeights;
                this.cdr.detectChanges();
            });
    }
}

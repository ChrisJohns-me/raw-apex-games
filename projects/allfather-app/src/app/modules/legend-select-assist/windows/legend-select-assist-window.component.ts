import { ConfigurationService } from "@allfather-app/app/modules/core/configuration/configuration.service";
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
    public legendStats?: AvgMatchStats;
    public legendIconRows: LegendIconRow[] = [];
    public complimentaryLegendWeights: { legendId: string; weightScore: number }[] = [];

    private numShowComplimentaryLegends = this.config.featureConfigs.legendSelectAssist.maxComplimentaryLegends;
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
                const limitedLegendWeights = legendWeights.slice(0, this.numShowComplimentaryLegends);
                this.complimentaryLegendWeights = limitedLegendWeights;
                this.cdr.detectChanges();
            });
    }
}

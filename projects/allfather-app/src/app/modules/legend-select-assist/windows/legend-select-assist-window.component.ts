import { ConfigurationService } from "@allfather-app/app/modules/core/configuration/configuration.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { AvgMatchStats } from "@allfather-app/app/shared/models/utilities/match-stats";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { unique } from "shared/utilities/primitives/array";
import { LegendSelectAssistService } from "../legend-select-assist.service";

@Component({
    selector: "app-legend-select-assist-window",
    templateUrl: "./legend-select-assist-window.component.html",
    styleUrls: ["./legend-select-assist-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegendSelectAssistWindowComponent implements OnInit, OnDestroy {
    public isVisible = false;
    public complimentaryLegendWeights: { legendId: string; weightScore: number }[] = [];
    public legendSelectedForm = new FormControl("Empty");
    public legendOpts: string[] = [];
    public legendStats?: AvgMatchStats;

    private numShowComplimentaryLegends = this.config.featureConfigs.legendSelectAssist.maxComplimentaryLegends;
    private isDestroyed$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly config: ConfigurationService,
        private readonly legendSelectAssist: LegendSelectAssistService,
        private readonly match: MatchService
    ) {}

    public ngOnInit(): void {
        this.loadLegendOpts();
    }

    public ngOnDestroy(): void {
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
    }

    // temp
    public selectLegend(legendId: string): void {
        this.legendSelectAssist
            .getLegendStats(legendId)
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((avgStats) => {
                this.legendStats = avgStats;
            });

        this.legendSelectAssist
            .getComplimentaryLegendWeights(legendId)
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((legendWeights) => {
                const limitedLegendWeights = legendWeights.slice(0, this.numShowComplimentaryLegends);
                this.complimentaryLegendWeights = limitedLegendWeights;
                this.cdr.detectChanges();
            });
    }

    // temp
    private loadLegendOpts(): void {
        this.match
            .getAllMatchData()
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((matchList) => {
                this.legendOpts = unique(matchList, (m) => m.legendId).map((m) => m.legendId);
                this.cdr.detectChanges();
            });
    }
}

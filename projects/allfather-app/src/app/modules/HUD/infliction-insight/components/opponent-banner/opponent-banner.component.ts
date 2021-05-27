import { MatchInflictionEventAccum } from "@allfather-app/app/common/match/infliction-event";
import { MatchRosterPlayer } from "@allfather-app/app/common/match/roster-player";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from "@angular/core";
import { interval, Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";

export interface OpponentBanner {
    isIndirectBanner: boolean;
    rosterPlayer: MatchRosterPlayer;
    latestInflictionAccum?: MatchInflictionEventAccum;
    maybeMaxShield: number;
    maybeShieldAmount: number;
    maybeHealthAmount: number;
}

@Component({
    selector: "app-opponent-banner",
    templateUrl: "./opponent-banner.component.html",
    styleUrls: ["./opponent-banner.component.scss"],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class OpponentBannerComponent implements AfterViewInit, OnDestroy {
    @Input("bannerData") public bannerData: Optional<OpponentBanner>;
    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly config: ConfigurationService) {}

    public ngAfterViewInit(): void {
        this.setupRefreshTimer();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupRefreshTimer() {
        const shouldRefresh = () =>
            !!this.bannerData?.latestInflictionAccum?.isKnocked || !!this.bannerData?.latestInflictionAccum?.isEliminated;
        interval(this.config.featureConfigs.inflictionInsight.refreshTime)
            .pipe(
                takeUntil(this.destroy$),
                filter(() => shouldRefresh())
            )
            .subscribe(() => this.cdr.detectChanges());
    }
}

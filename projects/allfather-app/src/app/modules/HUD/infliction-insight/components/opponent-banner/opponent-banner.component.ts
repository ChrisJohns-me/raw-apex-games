import { MatchInflictionEventAccum } from "@allfather-app/app/common/match/infliction-event";
import { MatchRosterPlayer } from "@allfather-app/app/common/match/roster-player";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { Configuration } from "@allfather-app/configs/config.interface";
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

const REFRESHTIME = 1000;

@Component({
    selector: "app-opponent-banner",
    templateUrl: "./opponent-banner.component.html",
    styleUrls: ["./opponent-banner.component.scss"],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class OpponentBannerComponent implements AfterViewInit, OnDestroy {
    @Input("bannerData") public bannerData: Optional<OpponentBanner>;
    @Input() public teamColor?: string;

    public config?: Configuration;
    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly configuration: ConfigurationService) {
        this.configuration.config$.pipe(takeUntil(this.destroy$)).subscribe((config) => (this.config = config));
    }

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
        interval(REFRESHTIME)
            .pipe(
                takeUntil(this.destroy$),
                filter(() => shouldRefresh())
            )
            .subscribe(() => this.cdr.detectChanges());
    }
}

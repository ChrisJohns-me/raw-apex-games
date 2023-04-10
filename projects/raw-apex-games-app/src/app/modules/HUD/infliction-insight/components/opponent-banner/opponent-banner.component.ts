import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from "@angular/core";
import { MatchInflictionEventAccum } from "@raw-apex-games-app/app/common/match/infliction-event";
import { MatchRosterPlayer } from "@raw-apex-games-app/app/common/match/roster-player";
import { ConfigurationService } from "@raw-apex-games-app/app/modules/core/configuration.service";
import { SettingsService } from "@raw-apex-games-app/app/modules/core/settings.service";
import { Configuration } from "@raw-apex-games-app/configs/config.interface";
import { Subject, combineLatest, interval } from "rxjs";
import { filter, takeUntil, tap } from "rxjs/operators";
import { InflictionInsightType } from "../../windows/infliction-insight-window.component";

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

    public visualizeHealthUI = false;
    public config?: Configuration;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly configuration: ConfigurationService,
        private readonly settings: SettingsService
    ) {
        const configuration$ = this.configuration.config$.pipe(tap((config) => (this.config = config)));
        const settings$ = this.settings.streamAllSettings$();

        combineLatest([configuration$, settings$])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([config, settings]) => {
                this.visualizeHealthUI =
                    settings.inflictionInsightType === InflictionInsightType.Emulated &&
                    config.featureFlags.inflictionInsight.visualizeDamageUI;
                this.cdr.detectChanges();
            });
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

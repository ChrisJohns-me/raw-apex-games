import { ConfigurationService } from "@allfather-app/app/modules/core/configuration/configuration.service";
import { MatchInflictionEventAccum } from "@allfather-app/app/shared/models/match/match-infliction-event";
import { MatchRosterPlayer } from "@allfather-app/app/shared/models/match/match-roster-player";
import { ChangeDetectorRef, Component, Input, OnDestroy } from "@angular/core";
import { interval, Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

export interface OpponentBanner {
    isIndirectBanner: boolean;
    rosterPlayer: MatchRosterPlayer;
    latestInflictionAccum?: MatchInflictionEventAccum;
    maybeShieldMax: number;
    maybeShieldAmount: number;
    maybeHealthAmount: number;
}

@Component({
    selector: "app-opponent-banner",
    templateUrl: "./opponent-banner.component.html",
    styleUrls: ["./opponent-banner.component.scss"],
    // changeDetection: ChangeDetectionStrategy.OnPush, // TODO
})
export class OpponentBannerComponent implements OnDestroy {
    @Input("bannerData") public set banner(value: Optional<OpponentBanner>) {
        this.bannerData = value;
        this.setupRefresh();
        this.cdr.detectChanges();
    }
    public get banner(): Optional<OpponentBanner> {
        return this.bannerData;
    }

    private bannerData: Optional<OpponentBanner>;
    private refreshTimerSubscription?: Subscription;
    private _unsubscribe$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly config: ConfigurationService) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    private setupRefresh() {
        const inflAccum = this.banner?.latestInflictionAccum;
        const requiresRefresh = inflAccum?.isKnocked || inflAccum?.isEliminated;
        if (!requiresRefresh) {
            if (this.refreshTimerSubscription) this.refreshTimerSubscription = undefined;
            return;
        }

        this.refreshTimerSubscription = interval(this.config.featureConfigs.inflictionInsight.refreshTime)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe(() => {
                this.cdr.detectChanges();
            });
    }
}

import { ChangeDetectorRef, Component, Input, OnDestroy } from "@angular/core";
import { MatchInflictionEventAccum } from "@shared/models/match/match-infliction-event";
import { MatchRosterPlayer } from "@shared/models/match/match-roster-player";
import { Subject } from "rxjs";

export interface OpponentBanner {
    isVictimTeammate: boolean;
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
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpponentBannerComponent implements OnDestroy {
    @Input("bannerData") public banner: Optional<OpponentBanner>;

    public primaryTitle = "Player Damage Box";
    public secondaryTitle = "";

    private _unsubscribe$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }
}

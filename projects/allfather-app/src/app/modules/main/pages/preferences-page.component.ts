import { environment } from "@allfather-app/environments/environment";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { MatchMapService } from "../../core/match/match-map.service";
import { MatchPlayerLegendService } from "../../core/match/match-player-legend.service";
import { MatchPlayerLocationService } from "../../core/match/match-player-location.service";
import { MatchPlayerStatsService } from "../../core/match/match-player-stats.service";
import { MatchRosterService } from "../../core/match/match-roster.service";
import { MatchService } from "../../core/match/match.service";
import { PlayerService } from "../../core/player.service";
import { ReportingService } from "../../core/reporting/reporting.service";

@Component({
    selector: "app-preferences-page",
    templateUrl: "./preferences-page.component.html",
    styleUrls: ["./preferences-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreferencesPageComponent implements OnInit, AfterViewInit, OnDestroy {
    public ENABLE_DEBUG_TOOLS = environment.DEV && false; // Debug tools

    private isDestroyed$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly match: MatchService,
        private readonly matchMap: MatchMapService,
        private readonly matchPlayerLegend: MatchPlayerLegendService,
        private readonly matchPlayerLocation: MatchPlayerLocationService,
        private readonly matchPlayerStats: MatchPlayerStatsService,
        private readonly matchRoster: MatchRosterService,
        private readonly player: PlayerService,
        private readonly reportingService: ReportingService
    ) {}

    //#region Lifecycle Methods
    public ngOnInit(): void {}

    public ngAfterViewInit(): void {}

    public ngOnDestroy(): void {
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
    }
    //#endregion
}

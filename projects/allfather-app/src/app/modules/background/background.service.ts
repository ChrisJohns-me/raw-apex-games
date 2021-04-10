import { GameProcessService } from "@allfather-app/app/modules/core/game-process.service";
import { GameService } from "@allfather-app/app/modules/core/game.service";
import { GoogleFormsMatchSummaryTrackerService } from "@allfather-app/app/modules/core/google-forms-match-summary-tracker.service";
import { MatchActivityService } from "@allfather-app/app/modules/core/match/match-activity.service";
import { MatchLegendSelectService } from "@allfather-app/app/modules/core/match/match-legend-select.service";
import { MatchMapService } from "@allfather-app/app/modules/core/match/match-map.service";
import { MatchPlayerInflictionService } from "@allfather-app/app/modules/core/match/match-player-infliction.service";
import { MatchPlayerInventoryService } from "@allfather-app/app/modules/core/match/match-player-inventory.service";
import { MatchPlayerLegendService } from "@allfather-app/app/modules/core/match/match-player-legend.service";
import { MatchPlayerLocationService } from "@allfather-app/app/modules/core/match/match-player-location.service";
import { MatchPlayerStatsService } from "@allfather-app/app/modules/core/match/match-player-stats.service";
import { MatchPlayerService } from "@allfather-app/app/modules/core/match/match-player.service";
import { MatchRosterService } from "@allfather-app/app/modules/core/match/match-roster.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { OverwolfGameDataService } from "@allfather-app/app/modules/core/overwolf";
import { ExposedOverwolfGameDataService } from "@allfather-app/app/modules/core/overwolf-exposed-data.service";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root",
    deps: [
        ExposedOverwolfGameDataService,
        GameService,
        GameProcessService,
        GoogleFormsMatchSummaryTrackerService,
        MatchService,
        MatchActivityService,
        MatchLegendSelectService,
        MatchMapService,
        MatchPlayerService,
        MatchPlayerInflictionService,
        MatchPlayerInventoryService,
        MatchPlayerLegendService,
        MatchPlayerLocationService,
        MatchPlayerStatsService,
        MatchRosterService,
        OverwolfGameDataService,
        PlayerService,
    ],
    useFactory: (...deps: any[]) => SingletonServiceProviderFactory("BackgroundService", BackgroundService, deps),
})
export class BackgroundService implements OnDestroy {
    private readonly _unsubscribe$ = new Subject<void>();

    constructor(
        private readonly exposedOverwolfData: ExposedOverwolfGameDataService,
        private readonly game: GameService,
        private readonly gameProcess: GameProcessService,
        private readonly googleFormsMatchSummaryTracker: GoogleFormsMatchSummaryTrackerService,
        private readonly match: MatchService,
        private readonly matchActivity: MatchActivityService,
        private readonly matchLegendSelect: MatchLegendSelectService,
        private readonly matchMap: MatchMapService,
        private readonly matchPlayer: MatchPlayerService,
        private readonly matchPlayerInfliction: MatchPlayerInflictionService,
        private readonly matchPlayerInventory: MatchPlayerInventoryService,
        private readonly matchPlayerLegend: MatchPlayerLegendService,
        private readonly matchPlayerLocation: MatchPlayerLocationService,
        private readonly matchPlayerStats: MatchPlayerStatsService,
        private readonly matchRoster: MatchRosterService,
        private readonly overwolfGameData: OverwolfGameDataService,
        private readonly player: PlayerService
    ) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public startBackgroundServices(): void {
        console.debug(`[${this.constructor.name}] Starting Background Services`);
        this.overwolfGameData.start();

        this.exposedOverwolfData.start();
        this.game.start();
        this.gameProcess.start();
        this.googleFormsMatchSummaryTracker.start();
        this.match.start();
        this.matchActivity.start();
        this.matchLegendSelect.start();
        this.matchMap.start();
        this.matchPlayer.start();
        this.matchPlayerInfliction.start();
        this.matchPlayerInventory.start();
        this.matchPlayerLegend.start();
        this.matchPlayerLocation.start();
        this.matchPlayerStats.start();
        this.matchRoster.start();
        this.player.start();
    }
}

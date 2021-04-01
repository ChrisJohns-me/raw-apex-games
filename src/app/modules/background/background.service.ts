import { Injectable, OnDestroy } from "@angular/core";
import { GameProcessService } from "@core/game-process.service";
import { GameService } from "@core/game.service";
import { GoogleFormsMatchSummaryTrackerService } from "@core/google-forms-match-summary-tracker.service";
import { MatchActivityService } from "@core/match/match-activity.service";
import { MatchLegendSelectService } from "@core/match/match-legend-select.service";
import { MatchMapService } from "@core/match/match-map.service";
import { MatchPlayerInflictionService } from "@core/match/match-player-infliction.service";
import { MatchPlayerInventoryService } from "@core/match/match-player-inventory.service";
import { MatchPlayerLegendService } from "@core/match/match-player-legend.service";
import { MatchPlayerLocationService } from "@core/match/match-player-location.service";
import { MatchPlayerStatsService } from "@core/match/match-player-stats.service";
import { MatchPlayerService } from "@core/match/match-player.service";
import { MatchRosterService } from "@core/match/match-roster.service";
import { MatchService } from "@core/match/match.service";
import { OverwolfDataProviderService } from "@core/overwolf-data-provider";
import { OverwolfExposedDataService } from "@core/overwolf-exposed-data.service";
import { PlayerService } from "@core/player.service";
import { Subject } from "rxjs";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";

@Injectable({
    providedIn: "root",
    deps: [
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
        OverwolfDataProviderService,
        OverwolfExposedDataService,
        PlayerService,
    ],
    useFactory: (...deps: any[]) => SingletonServiceProviderFactory("BackgroundService", BackgroundService, deps),
})
export class BackgroundService implements OnDestroy {
    private readonly _unsubscribe$ = new Subject<void>();

    constructor(
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
        private readonly overwolfDataProvider: OverwolfDataProviderService,
        private readonly overwolfExposedData: OverwolfExposedDataService,
        private readonly player: PlayerService
    ) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public startBackgroundServices(): void {
        console.debug(`[${this.constructor.name}] Starting Background Services`);
        this.overwolfDataProvider.start();

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
        this.overwolfExposedData.start();
        this.player.start();
    }
}

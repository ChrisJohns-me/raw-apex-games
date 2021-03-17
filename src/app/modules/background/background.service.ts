import { Injectable, OnDestroy } from "@angular/core";
import { GameProcessService } from "@core/game-process.service";
import { GameService } from "@core/game.service";
import { GoogleFormsMatchSummaryTrackerService } from "@core/google-forms-match-summary-tracker.service";
import { MatchRosterService } from "@core/match-roster.service";
import { MatchService } from "@core/match.service";
import { OverwolfDataProviderService } from "@core/overwolf-data-provider";
import { OverwolfExposedDataService } from "@core/overwolf-exposed-data.service";
import { PlayerActivityService } from "@core/player-activity.service";
import { PlayerInventoryService } from "@core/player-inventory.service";
import { PlayerLegendService } from "@core/player-legend.service";
import { PlayerLocationService } from "@core/player-location.service";
import { PlayerService } from "@core/player.service";
import { TeammateService } from "@core/teammate.service";
import { Subject } from "rxjs";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";

@Injectable({
    providedIn: "root",
    deps: [
        GameService,
        GameProcessService,
        GoogleFormsMatchSummaryTrackerService,
        MatchService,
        MatchRosterService,
        OverwolfDataProviderService,
        OverwolfExposedDataService,
        PlayerService,
        PlayerActivityService,
        PlayerInventoryService,
        PlayerLegendService,
        PlayerLocationService,
        TeammateService,
    ],
    useFactory: (...deps: any[]) => SingletonServiceProviderFactory("BackgroundService", BackgroundService, deps),
})
export class BackgroundService implements OnDestroy {
    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly game: GameService,
        private readonly gameProcess: GameProcessService,
        private readonly googleFormsMatchSummaryTracker: GoogleFormsMatchSummaryTrackerService,
        private readonly match: MatchService,
        private readonly matchRoster: MatchRosterService,
        private readonly overwolfDataProvider: OverwolfDataProviderService,
        private readonly overwolfExposedData: OverwolfExposedDataService,
        private readonly player: PlayerService,
        private readonly playerActivity: PlayerActivityService,
        private readonly playerInventory: PlayerInventoryService,
        private readonly playerLegend: PlayerLegendService,
        private readonly playerLocation: PlayerLocationService,
        private readonly teammate: TeammateService
    ) {}

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public startBackgroundServices(): void {
        console.debug(`[${this.constructor.name}] Starting Background Services`);
        this.overwolfDataProvider.start();

        this.game.start();
        this.gameProcess.start();
        this.googleFormsMatchSummaryTracker.start();
        this.match.start();
        this.matchRoster.start();
        this.overwolfExposedData.start();
        this.player.start();
        this.playerActivity.start();
        this.playerInventory.start();
        this.playerLegend.start();
        this.playerLocation.start();
        this.teammate.start();
    }
}

import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { AllfatherService } from "../core/allfather-service.abstract";
import { GameProcessService } from "../core/game-process.service";
import { GameService } from "../core/game.service";
import { LocalDatabaseService } from "../core/local-database/local-database.service";
import { LocalStorageService } from "../core/local-storage/local-storage.service";
import { MatchActivityService } from "../core/match/match-activity.service";
import { MatchLegendSelectService } from "../core/match/match-legend-select.service";
import { MatchMapService } from "../core/match/match-map.service";
import { MatchPlayerInflictionService } from "../core/match/match-player-infliction.service";
import { MatchPlayerInventoryService } from "../core/match/match-player-inventory.service";
import { MatchPlayerLegendService } from "../core/match/match-player-legend.service";
import { MatchPlayerLocationService } from "../core/match/match-player-location.service";
import { MatchPlayerStatsService } from "../core/match/match-player-stats.service";
import { MatchPlayerService } from "../core/match/match-player.service";
import { MatchRosterService } from "../core/match/match-roster.service";
import { MatchService } from "../core/match/match.service";
import { OverwolfGameDataService } from "../core/overwolf";
import { ExposedOverwolfGameDataService } from "../core/overwolf-exposed-data.service";
import { OverwolfExtensionService } from "../core/overwolf/overwolf-extension.service";
import { PlayerService } from "../core/player.service";
import { ReportableDataManagerService } from "../core/reporting/reporting-engine/reportable-data-manager";
import { ReportingService } from "../core/reporting/reporting.service";

@Injectable({
    providedIn: "root",
    deps: [
        ExposedOverwolfGameDataService,
        GameService,
        GameProcessService,
        LocalDatabaseService,
        LocalStorageService,
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
        OverwolfExtensionService,
        OverwolfGameDataService,
        PlayerService,
        ReportableDataManagerService,
        ReportingService,
    ],
    useFactory: (...deps: any[]) => SingletonServiceProviderFactory("BackgroundService", BackgroundService, deps),
})
export class BackgroundService extends AllfatherService {
    constructor(
        private readonly exposedOverwolfData: ExposedOverwolfGameDataService,
        private readonly game: GameService,
        private readonly gameProcess: GameProcessService,
        private readonly localDatabase: LocalDatabaseService,
        private readonly localStorage: LocalStorageService,
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
        private readonly overwolfExtensions: OverwolfExtensionService,
        private readonly overwolfGameData: OverwolfGameDataService,
        private readonly player: PlayerService,
        private readonly reportableDataManager: ReportableDataManagerService,
        private readonly reporting: ReportingService
    ) {
        super();
    }

    public init(): void {}

    public startBackgroundServices(): void {
        console.debug(`[${this.constructor.name}] Starting Background Services`);
        this.overwolfExtensions.init();
        this.overwolfGameData.init();

        this.exposedOverwolfData.init();
        this.game.init();
        this.gameProcess.init();
        this.localDatabase.init();
        this.localStorage.init();
        this.match.init();
        this.matchActivity.init();
        this.matchLegendSelect.init();
        this.matchMap.init();
        this.matchPlayer.init();
        this.matchPlayerInfliction.init();
        this.matchPlayerInventory.init();
        this.matchPlayerLegend.init();
        this.matchPlayerLocation.init();
        this.matchPlayerStats.init();
        this.matchRoster.init();
        this.player.init();
        this.reportableDataManager.init();
        this.reporting.init();
    }
}

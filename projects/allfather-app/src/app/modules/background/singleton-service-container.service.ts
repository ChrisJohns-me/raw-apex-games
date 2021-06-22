import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "../core/configuration.service";
import { FileService } from "../core/file.service";
import { GameProcessService } from "../core/game-process.service";
import { GameService } from "../core/game.service";
import { LocalDatabaseService } from "../core/local-database/local-database.service";
import { LocalStorageService } from "../core/local-storage/local-storage.service";
import { MapRotationService } from "../core/map-rotation/map-rotation.service";
import { MatchArenasScoreboardService } from "../core/match/match-arenas-scoreboard.service";
import { MatchKillfeedService } from "../core/match/match-killfeed.service";
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
import { OverwolfExtensionsService } from "../core/overwolf/overwolf-extensions.service";
import { OverwolfFeatureStatusService } from "../core/overwolf/overwolf-feature-status.service";
import { OverwolfInputTrackingService } from "../core/overwolf/overwolf-input-tracking.service";
import { OverwolfSystemTrayService } from "../core/overwolf/overwolf-system-tray.service";
import { PlayerAccountStatsService } from "../core/player-account-stats/player-account-stats.service";
import { PlayerLocalStatsService } from "../core/player-local-stats.service";
import { PlayerService } from "../core/player.service";
import { ReportableDataManagerService } from "../core/reporting/reporting-engine/reportable-data-manager";
import { ReportingService } from "../core/reporting/reporting.service";
import { SettingsService } from "../core/settings.service";
import { DevelopmentToolsWindowService } from "../development-tools/windows/development-tools-window.service";
import { InflictionInsightWindowService } from "../HUD/infliction-insight/windows/infliction-insight-window.service";
import { MatchTimerWindowService } from "../HUD/match-timer/windows/match-timer-window.service";
import { UltTimerWindowService } from "../HUD/ult-timer/windows/ult-timer-window.service";
import { LegendSelectAssistWindowService } from "../legend-select-assist/windows/legend-select-assist-window.service";
import { MainWindowService } from "../main/windows/main-window.service";
import { HUDWindowControllerService } from "./hud-window-controller.service";
import { SystemTrayService } from "./system-tray.service";

/**
 * Keep a reference of Singleton services that need
 *  to persist throughout the lifetime of the app.
 */
@Injectable({
    providedIn: "root",
    deps: [
        ConfigurationService,
        DevelopmentToolsWindowService,
        FileService,
        GameProcessService,
        GameService,
        HUDWindowControllerService,
        InflictionInsightWindowService,
        LegendSelectAssistWindowService,
        LocalDatabaseService,
        LocalStorageService,
        MainWindowService,
        MatchArenasScoreboardService,
        MapRotationService,
        MatchKillfeedService,
        MatchLegendSelectService,
        MatchMapService,
        MatchPlayerInflictionService,
        MatchPlayerInventoryService,
        MatchPlayerLegendService,
        MatchPlayerLocationService,
        MatchPlayerService,
        MatchPlayerStatsService,
        MatchRosterService,
        MatchService,
        MatchTimerWindowService,
        OverwolfExtensionsService,
        OverwolfFeatureStatusService,
        OverwolfGameDataService,
        OverwolfInputTrackingService,
        OverwolfSystemTrayService,
        PlayerAccountStatsService,
        PlayerLocalStatsService,
        PlayerService,
        ReportableDataManagerService,
        ReportingService,
        SettingsService,
        SystemTrayService,
        UltTimerWindowService,
    ],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("SingletonServiceContainerService", SingletonServiceContainerService, deps),
})
export class SingletonServiceContainerService {
    constructor(
        public readonly ConfigurationService: ConfigurationService,
        public readonly DevelopmentToolsWindowService: DevelopmentToolsWindowService,
        public readonly FileService: FileService,
        public readonly GameProcessService: GameProcessService,
        public readonly GameService: GameService,
        public readonly HUDWindowControllerService: HUDWindowControllerService,
        public readonly InflictionInsightWindowService: InflictionInsightWindowService,
        public readonly LegendSelectAssistWindowService: LegendSelectAssistWindowService,
        public readonly LocalDatabaseService: LocalDatabaseService,
        public readonly LocalStorageService: LocalStorageService,
        public readonly MainWindowService: MainWindowService,
        public readonly MapRotationService: MapRotationService,
        public readonly MatchArenasScoreboardService: MatchArenasScoreboardService,
        public readonly MatchKillfeedService: MatchKillfeedService,
        public readonly MatchLegendSelectService: MatchLegendSelectService,
        public readonly MatchMapService: MatchMapService,
        public readonly MatchPlayerInflictionService: MatchPlayerInflictionService,
        public readonly MatchPlayerInventoryService: MatchPlayerInventoryService,
        public readonly MatchPlayerLegendService: MatchPlayerLegendService,
        public readonly MatchPlayerLocationService: MatchPlayerLocationService,
        public readonly MatchPlayerService: MatchPlayerService,
        public readonly MatchPlayerStatsService: MatchPlayerStatsService,
        public readonly MatchRosterService: MatchRosterService,
        public readonly MatchService: MatchService,
        public readonly MatchTimerWindowService: MatchTimerWindowService,
        public readonly OverwolfExtensionsService: OverwolfExtensionsService,
        public readonly OverwolfFeatureStatusService: OverwolfFeatureStatusService,
        public readonly OverwolfGameDataService: OverwolfGameDataService,
        public readonly OverwolfInputTrackingService: OverwolfInputTrackingService,
        public readonly OverwolfSystemTrayService: OverwolfSystemTrayService,
        public readonly PlayerAccountStatsService: PlayerAccountStatsService,
        public readonly PlayerLocalStatsService: PlayerLocalStatsService,
        public readonly PlayerService: PlayerService,
        public readonly ReportableDataManagerService: ReportableDataManagerService,
        public readonly ReportingService: ReportingService,
        public readonly SettingsService: SettingsService,
        public readonly SystemTrayService: SystemTrayService,
        public readonly UltTimerWindowService: UltTimerWindowService
    ) {}
}

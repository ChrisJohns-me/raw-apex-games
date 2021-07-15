import { MapRotationService } from "@allfather-app/app/modules/core/map-rotation/map-rotation.service";
import { MatchKillfeedService } from "@allfather-app/app/modules/core/match/match-killfeed.service";
import { MatchPlayerService } from "@allfather-app/app/modules/core/match/match-player.service";
import { MatchRosterService } from "@allfather-app/app/modules/core/match/match-roster.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { SettingsService } from "@allfather-app/app/modules/core/settings.service";
import { Injectable } from "@angular/core";
import { FileService } from "@shared-app/services/file.service";
import { GameProcessService } from "@shared-app/services/game-process.service";
import { GoogleAnalyticsService } from "@shared-app/services/google-analytics.service";
import { OverwolfGameDataService } from "@shared-app/services/overwolf";
import { OverwolfExtensionsService } from "@shared-app/services/overwolf/overwolf-extensions.service";
import { OverwolfFeatureStatusService } from "@shared-app/services/overwolf/overwolf-feature-status.service";
import { OverwolfInputTrackingService } from "@shared-app/services/overwolf/overwolf-input-tracking.service";
import { OverwolfProfileService } from "@shared-app/services/overwolf/overwolf-profile.service";
import { OverwolfStreamingService } from "@shared-app/services/overwolf/overwolf-streaming.service";
import { OverwolfSystemTrayService } from "@shared-app/services/overwolf/overwolf-system-tray.service";
import { PlayerAccountStatsService } from "@shared-app/services/player-account-stats/player-account-stats.service";
import { VideoRecordingService } from "@shared-app/services/video-recording/video-recording.service";
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { ConfigurationService } from "../core/configuration.service";
import { GameService } from "../core/game.service";
import { LocalDatabaseService } from "../core/local-database/local-database.service";
import { LocalStorageService } from "../core/local-storage/local-storage.service";
import { MatchArenasScoreboardService } from "../core/match/match-arenas-scoreboard.service";
import { MatchLegendSelectService } from "../core/match/match-legend-select.service";
import { MatchMapService } from "../core/match/match-map.service";
import { MatchPlayerInflictionService } from "../core/match/match-player-infliction.service";
import { MatchPlayerInventoryService } from "../core/match/match-player-inventory.service";
import { MatchPlayerLegendService } from "../core/match/match-player-legend.service";
import { MatchPlayerLocationService } from "../core/match/match-player-location.service";
import { MatchPlayerStatsService } from "../core/match/match-player-stats.service";
import { PlayerLocalStatsService } from "../core/player-local-stats.service";
import { PlayerService } from "../core/player.service";
import { ReportableDataManagerService } from "../core/reporting/reporting-engine/reportable-data-manager";
import { ReportingService } from "../core/reporting/reporting.service";
import { DevelopmentToolsWindowService } from "../development-tools/windows/development-tools-window.service";
import { InflictionInsightWindowService } from "../HUD/infliction-insight/windows/infliction-insight-window.service";
import { MatchTimerWindowService } from "../HUD/match-timer/windows/match-timer-window.service";
import { UltTimerWindowService } from "../HUD/ult-timer/windows/ult-timer-window.service";
import { LegendSelectAssistWindowService } from "../legend-select-assist/windows/legend-select-assist-window.service";
import { MainWindowService } from "../main/windows/main-window.service";
import { CaptureControllerService } from "./capture-controller.service";
import { HUDWindowControllerService } from "./hud-window-controller.service";
import { SystemTrayService } from "./system-tray.service";

/**
 * Keep a reference of Singleton services that need
 *  to persist throughout the lifetime of the app.
 */
@Injectable({
    providedIn: "root",
    deps: [
        CaptureControllerService,
        ConfigurationService,
        DevelopmentToolsWindowService,
        FileService,
        GameProcessService,
        GameService,
        GoogleAnalyticsService,
        HUDWindowControllerService,
        InflictionInsightWindowService,
        LegendSelectAssistWindowService,
        LocalDatabaseService,
        LocalStorageService,
        MainWindowService,
        MapRotationService,
        MatchArenasScoreboardService,
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
        OverwolfProfileService,
        OverwolfStreamingService,
        OverwolfSystemTrayService,
        PlayerAccountStatsService,
        PlayerLocalStatsService,
        PlayerService,
        ReportableDataManagerService,
        ReportingService,
        SettingsService,
        SystemTrayService,
        UltTimerWindowService,
        VideoRecordingService,
    ],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("SingletonServiceContainerService", SingletonServiceContainerService, deps),
})
export class SingletonServiceContainerService {
    constructor(
        public readonly CaptureControllerService: CaptureControllerService,
        public readonly ConfigurationService: ConfigurationService,
        public readonly DevelopmentToolsWindowService: DevelopmentToolsWindowService,
        public readonly FileService: FileService,
        public readonly GameProcessService: GameProcessService,
        public readonly GameService: GameService,
        public readonly GoogleAnalyticsService: GoogleAnalyticsService,
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
        public readonly OverwolfProfileService: OverwolfProfileService,
        public readonly OverwolfStreamingService: OverwolfStreamingService,
        public readonly OverwolfSystemTrayService: OverwolfSystemTrayService,
        public readonly PlayerAccountStatsService: PlayerAccountStatsService,
        public readonly PlayerLocalStatsService: PlayerLocalStatsService,
        public readonly PlayerService: PlayerService,
        public readonly ReportableDataManagerService: ReportableDataManagerService,
        public readonly ReportingService: ReportingService,
        public readonly SettingsService: SettingsService,
        public readonly SystemTrayService: SystemTrayService,
        public readonly UltTimerWindowService: UltTimerWindowService,
        public readonly VideoRecordingService: VideoRecordingService
    ) {}
}

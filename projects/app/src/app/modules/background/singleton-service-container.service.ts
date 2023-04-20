import { Injectable } from "@angular/core";
import { ConfigurationService } from "@app/modules/core/configuration.service.js";
import { GameService } from "@app/modules/core/game.service.js";
import { LocalDatabaseService } from "@app/modules/core/local-database/local-database.service.js";
import { MatchService } from "@app/modules/core/match/match.service.js";
import { OverwolfProfileService } from "@app/modules/core/overwolf/overwolf-profile.service.js";
import { SessionStorageService } from "@app/modules/core/session-storage/session-storage.service.js";
import { SettingsService } from "@app/modules/core/settings.service.js";
import { InGameWindowService } from "@app/modules/in-game/windows/in-game-window.service.js";
import { SingletonServiceProviderFactory } from "@app/singleton-service.provider.factory.js";
import { FileService } from "../core/file.service.js";
import { GameProcessService } from "../core/game-process.service.js";
import { GameplayInputService } from "../core/gameplay-input.service.js";
import { GoogleAnalyticsService } from "../core/google-analytics.service.js";
import { LocalStorageService } from "../core/local-storage/local-storage.service.js";
import { MatchKillfeedService } from "../core/match/match-killfeed.service.js";
import { MatchLegendSelectService } from "../core/match/match-legend-select.service.js";
import { MatchMapService } from "../core/match/match-map.service.js";
import { MatchPlayerInflictionService } from "../core/match/match-player-infliction.service.js";
import { MatchPlayerInventoryService } from "../core/match/match-player-inventory.service.js";
import { MatchPlayerLegendService } from "../core/match/match-player-legend.service.js";
import { MatchPlayerLocationService } from "../core/match/match-player-location.service.js";
import { MatchPlayerStatsService } from "../core/match/match-player-stats.service.js";
import { MatchPlayerService } from "../core/match/match-player.service.js";
import { MatchRingService } from "../core/match/match-ring.service.js";
import { MatchRosterService } from "../core/match/match-roster.service.js";
import { OverwolfGameDataService } from "../core/overwolf/index.js";
import { OverwolfExtensionsService } from "../core/overwolf/overwolf-extensions.service.js";
import { OverwolfFeatureStatusService } from "../core/overwolf/overwolf-feature-status.service.js";
import { OverwolfHotKeyService } from "../core/overwolf/overwolf-hotkey.service.js";
import { OverwolfInputTrackingService } from "../core/overwolf/overwolf-input-tracking.service.js";
import { OverwolfStreamingService } from "../core/overwolf/overwolf-streaming.service.js";
import { OverwolfSystemTrayService } from "../core/overwolf/overwolf-system-tray.service.js";
import { PlayerLocalStatsService } from "../core/player-local-stats.service.js";
import { PlayerService } from "../core/player.service.js";
import { RawGamesOrganizerService } from "../core/raw-games/organizer.service.js";
import { RawGamesPlayerService } from "../core/raw-games/player.service.js";
import { ReportableDataManagerService } from "../core/reporting/reporting-engine/reportable-data-manager.js";
import { ReportingService } from "../core/reporting/reporting.service.js";
import { VersionService } from "../core/version.service.js";
import { VideoRecordingService } from "../core/video-recording/video-recording.service.js";
import { DesktopWindowService } from "../desktop/windows/desktop-window.service.js";
import { DevelopmentToolsWindowService } from "../development-tools/windows/development-tools-window.service.js";
import { CaptureControllerService } from "./capture-controller.service.js";
import { HotkeyService } from "./hotkey.service.js";
import { HUDWindowControllerService } from "./hud-window-controller.service.js";
import { SystemTrayService } from "./system-tray.service.js";

/**
 * Keep a reference of Singleton services that need
 *  to persist throughout the lifetime of the app.
 */
@Injectable({
    providedIn: "root",
    deps: [
        CaptureControllerService,
        ConfigurationService,
        DesktopWindowService,
        DevelopmentToolsWindowService,
        FileService,
        GameplayInputService,
        GameProcessService,
        GameService,
        GoogleAnalyticsService,
        HotkeyService,
        HUDWindowControllerService,
        InGameWindowService,
        LocalDatabaseService,
        LocalStorageService,
        MatchKillfeedService,
        MatchLegendSelectService,
        MatchMapService,
        MatchPlayerInflictionService,
        MatchPlayerInventoryService,
        MatchPlayerLegendService,
        MatchPlayerLocationService,
        MatchPlayerService,
        MatchPlayerStatsService,
        MatchRingService,
        MatchRosterService,
        MatchService,
        OverwolfExtensionsService,
        OverwolfFeatureStatusService,
        OverwolfGameDataService,
        OverwolfHotKeyService,
        OverwolfInputTrackingService,
        OverwolfProfileService,
        OverwolfStreamingService,
        OverwolfSystemTrayService,
        PlayerLocalStatsService,
        PlayerService,
        RawGamesOrganizerService,
        RawGamesPlayerService,
        ReportableDataManagerService,
        ReportingService,
        SessionStorageService,
        SettingsService,
        SystemTrayService,
        VersionService,
        VideoRecordingService,
    ],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("SingletonServiceContainerService", SingletonServiceContainerService, deps),
})
export class SingletonServiceContainerService {
    constructor(
        public readonly CaptureControllerService: CaptureControllerService,
        public readonly ConfigurationService: ConfigurationService,
        public readonly DesktopWindowService: DesktopWindowService,
        public readonly DevelopmentToolsWindowService: DevelopmentToolsWindowService,
        public readonly FileService: FileService,
        public readonly GameplayInputService: GameplayInputService,
        public readonly GameProcessService: GameProcessService,
        public readonly GameService: GameService,
        public readonly GoogleAnalyticsService: GoogleAnalyticsService,
        public readonly HotkeyService: HotkeyService,
        public readonly HUDWindowControllerService: HUDWindowControllerService,
        public readonly InGameWindowService: InGameWindowService,
        public readonly LocalDatabaseService: LocalDatabaseService,
        public readonly LocalStorageService: LocalStorageService,
        public readonly MatchKillfeedService: MatchKillfeedService,
        public readonly MatchLegendSelectService: MatchLegendSelectService,
        public readonly MatchMapService: MatchMapService,
        public readonly MatchPlayerInflictionService: MatchPlayerInflictionService,
        public readonly MatchPlayerInventoryService: MatchPlayerInventoryService,
        public readonly MatchPlayerLegendService: MatchPlayerLegendService,
        public readonly MatchPlayerLocationService: MatchPlayerLocationService,
        public readonly MatchPlayerService: MatchPlayerService,
        public readonly MatchPlayerStatsService: MatchPlayerStatsService,
        public readonly MatchRingService: MatchRingService,
        public readonly MatchRosterService: MatchRosterService,
        public readonly MatchService: MatchService,
        public readonly OverwolfExtensionsService: OverwolfExtensionsService,
        public readonly OverwolfFeatureStatusService: OverwolfFeatureStatusService,
        public readonly OverwolfGameDataService: OverwolfGameDataService,
        public readonly OverwolfHotKeyService: OverwolfHotKeyService,
        public readonly OverwolfInputTrackingService: OverwolfInputTrackingService,
        public readonly OverwolfProfileService: OverwolfProfileService,
        public readonly OverwolfStreamingService: OverwolfStreamingService,
        public readonly OverwolfSystemTrayService: OverwolfSystemTrayService,
        public readonly PlayerLocalStatsService: PlayerLocalStatsService,
        public readonly PlayerService: PlayerService,
        public readonly RawGamesOrganizerService: RawGamesOrganizerService,
        public readonly RawGamesPlayerService: RawGamesPlayerService,
        public readonly ReportableDataManagerService: ReportableDataManagerService,
        public readonly ReportingService: ReportingService,
        public readonly SessionStorageService: SessionStorageService,
        public readonly SettingsService: SettingsService,
        public readonly SystemTrayService: SystemTrayService,
        public readonly VersionService: VersionService,
        public readonly VideoRecordingService: VideoRecordingService
    ) {}
}

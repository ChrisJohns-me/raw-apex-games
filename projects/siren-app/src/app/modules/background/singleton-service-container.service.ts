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
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { MatchService } from "@siren-app/app/modules/core/match/match.service";
import { ConfigurationService } from "../core/configuration.service";
import { GameService } from "../core/game.service";
import { LocalDatabaseService } from "../core/local-database/local-database.service";
import { LocalStorageService } from "../core/local-storage/local-storage.service";
import { MatchKillfeedService } from "../core/match/match-killfeed.service";
import { MatchPlayerService } from "../core/match/match-player.service";
import { MatchRosterService } from "../core/match/match-roster.service";
import { PlayerService } from "../core/player.service";
import { ReportedPlayersService } from "../core/report-list/report-list.service";
import { SettingsService } from "../core/settings.service";
import { DevelopmentToolsWindowService } from "../development-tools/windows/development-tools-window.service";
import { HUDNotificationWindowService } from "../hud-notification/windows/hud-notification-window.service";
import { HUDNotificationService } from "../hud-notification/windows/hud-notification.service";
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
        GoogleAnalyticsService,
        HUDNotificationService,
        HUDNotificationWindowService,
        HUDWindowControllerService,
        LocalDatabaseService,
        LocalStorageService,
        MainWindowService,
        MatchKillfeedService,
        MatchPlayerService,
        MatchRosterService,
        MatchService,
        OverwolfExtensionsService,
        OverwolfFeatureStatusService,
        OverwolfGameDataService,
        OverwolfInputTrackingService,
        OverwolfProfileService,
        OverwolfStreamingService,
        OverwolfSystemTrayService,
        PlayerService,
        ReportedPlayersService,
        SettingsService,
        SystemTrayService,
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
        public readonly GoogleAnalyticsService: GoogleAnalyticsService,
        public readonly HUDNotificationService: HUDNotificationService,
        public readonly HUDNotificationWindowService: HUDNotificationWindowService,
        public readonly HUDWindowControllerService: HUDWindowControllerService,
        public readonly LocalDatabaseService: LocalDatabaseService,
        public readonly LocalStorageService: LocalStorageService,
        public readonly MainWindowService: MainWindowService,
        public readonly MatchKillfeedService: MatchKillfeedService,
        public readonly MatchPlayerService: MatchPlayerService,
        public readonly MatchRosterService: MatchRosterService,
        public readonly MatchService: MatchService,
        public readonly OverwolfExtensionsService: OverwolfExtensionsService,
        public readonly OverwolfFeatureStatusService: OverwolfFeatureStatusService,
        public readonly OverwolfGameDataService: OverwolfGameDataService,
        public readonly OverwolfInputTrackingService: OverwolfInputTrackingService,
        public readonly OverwolfProfileService: OverwolfProfileService,
        public readonly OverwolfStreamingService: OverwolfStreamingService,
        public readonly OverwolfSystemTrayService: OverwolfSystemTrayService,
        public readonly PlayerService: PlayerService,
        public readonly ReportedPlayersService: ReportedPlayersService,
        public readonly SettingsService: SettingsService,
        public readonly SystemTrayService: SystemTrayService
    ) {}
}

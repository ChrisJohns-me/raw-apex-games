import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { BackgroundService } from "@allfather-app/app/modules/background/background.service";
import { HUDWindowControllerService } from "@allfather-app/app/modules/background/hud-window-controller.service";
import { SystemTrayService } from "@allfather-app/app/modules/background/system-tray.service";
import { InflictionInsightWindowService } from "@allfather-app/app/modules/HUD/infliction-insight/windows/infliction-insight-window.service";
import { MatchTimerWindowService } from "@allfather-app/app/modules/HUD/match-timer/windows/match-timer-window.service";
import { UltTimerWindowService } from "@allfather-app/app/modules/HUD/ult-timer/windows/ult-timer-window.service";
import { LegendSelectAssistWindowService } from "@allfather-app/app/modules/legend-select-assist/windows/legend-select-assist-window.service";
import { MainWindowService } from "@allfather-app/app/modules/main/windows/main-window.service";
import { ConfigurationService } from "../../configuration.service";
import { FileService } from "../../file.service";
import { GameProcessService } from "../../game-process.service";
import { GameService } from "../../game.service";
import { LocalDatabaseService } from "../../local-database/local-database.service";
import { LocalStorageService } from "../../local-storage/local-storage.service";
import { MatchActivityService } from "../../match/match-activity.service";
import { MatchLegendSelectService } from "../../match/match-legend-select.service";
import { MatchMapService } from "../../match/match-map.service";
import { MatchPlayerInflictionService } from "../../match/match-player-infliction.service";
import { MatchPlayerInventoryService } from "../../match/match-player-inventory.service";
import { MatchPlayerLegendService } from "../../match/match-player-legend.service";
import { MatchPlayerLocationService } from "../../match/match-player-location.service";
import { MatchPlayerStatsService } from "../../match/match-player-stats.service";
import { MatchPlayerService } from "../../match/match-player.service";
import { MatchRosterService } from "../../match/match-roster.service";
import { MatchService } from "../../match/match.service";
import { OverwolfGameDataService } from "../../overwolf";
import { OverwolfExtensionsService } from "../../overwolf/overwolf-extensions.service";
import { OverwolfFeatureStatusService } from "../../overwolf/overwolf-feature-status.service";
import { PlayerLocalStatsService } from "../../player-local-stats.service";
import { PlayerService } from "../../player.service";
import { ReportableDataManagerService } from "../../reporting/reporting-engine/reportable-data-manager";
import { ReportingService } from "../../reporting/reporting.service";
import { SettingsService } from "../../settings.service";

export class MockBackgroundService implements MockedClass<BackgroundService> {
    public relaunchApp(): void {}

    public exitApp(): void {}

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }

    // Singleton service references
    public readonly configuration!: ConfigurationService;
    public readonly file!: FileService;
    public readonly game!: GameService;
    public readonly gameProcess!: GameProcessService;
    public readonly hudWindowController!: HUDWindowControllerService;
    public readonly inflictionInsightWindow!: InflictionInsightWindowService;
    public readonly legendSelectAssistWindow!: LegendSelectAssistWindowService;
    public readonly localDatabase!: LocalDatabaseService;
    public readonly localStorage!: LocalStorageService;
    public readonly mainWindow!: MainWindowService;
    public readonly match!: MatchService;
    public readonly matchActivity!: MatchActivityService;
    public readonly matchLegendSelect!: MatchLegendSelectService;
    public readonly matchMap!: MatchMapService;
    public readonly matchPlayer!: MatchPlayerService;
    public readonly matchPlayerInfliction!: MatchPlayerInflictionService;
    public readonly matchPlayerInventory!: MatchPlayerInventoryService;
    public readonly matchPlayerLegend!: MatchPlayerLegendService;
    public readonly matchPlayerLocation!: MatchPlayerLocationService;
    public readonly matchPlayerStats!: MatchPlayerStatsService;
    public readonly matchRoster!: MatchRosterService;
    public readonly matchTimerWindow!: MatchTimerWindowService;
    public readonly overwolfExtensions!: OverwolfExtensionsService;
    public readonly overwolfFeatureStatus!: OverwolfFeatureStatusService;
    public readonly overwolfGameData!: OverwolfGameDataService;
    public readonly player!: PlayerService;
    public readonly playerStats!: PlayerLocalStatsService;
    public readonly reportableDataManager!: ReportableDataManagerService;
    public readonly reporting!: ReportingService;
    public readonly settings!: SettingsService;
    public readonly systemTray!: SystemTrayService;
    public readonly ultTimerWindow!: UltTimerWindowService;
}

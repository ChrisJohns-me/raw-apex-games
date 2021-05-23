import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { from, Observable, of } from "rxjs";
import { catchError, concatAll, delay, map, mergeMap, switchMap, takeUntil } from "rxjs/operators";
import { AllfatherService } from "../core/allfather-service.abstract";
import { ConfigurationService } from "../core/configuration.service";
import { FileService } from "../core/file.service";
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
import { OverwolfExtensionsService } from "../core/overwolf/overwolf-extensions.service";
import { OverwolfFeatureStatusService } from "../core/overwolf/overwolf-feature-status.service";
import { PlayerStatsService } from "../core/player-stats.service";
import { PlayerService } from "../core/player.service";
import { ReportableDataManagerService } from "../core/reporting/reporting-engine/reportable-data-manager";
import { ReportingService } from "../core/reporting/reporting.service";
import { SettingsService } from "../core/settings.service";
import { UIWindow, WindowName } from "../core/_refactor/ui-window";
import { InflictionInsightWindowService } from "../HUD/infliction-insight/windows/infliction-insight-window.service";
import { MatchTimerWindowService } from "../HUD/match-timer/windows/match-timer-window.service";
import { UltTimerWindowService } from "../HUD/ult-timer/windows/ult-timer-window.service";
import { LegendSelectAssistWindowService } from "../legend-select-assist/windows/legend-select-assist-window.service";
import { MainWindowService } from "../main/windows/main-window.service";
import { HUDWindowControllerService } from "./hud-window-controller.service";
import { SystemTrayService } from "./system-tray.service";

const BACKGROUND_EXIT_DELAY = 1000;

@Injectable({
    providedIn: "root",
    deps: [
        ConfigurationService,
        FileService,
        GameService,
        GameProcessService,
        HUDWindowControllerService,
        InflictionInsightWindowService,
        LegendSelectAssistWindowService,
        LocalDatabaseService,
        LocalStorageService,
        MainWindowService,
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
        MatchTimerWindowService,
        OverwolfExtensionsService,
        OverwolfFeatureStatusService,
        OverwolfGameDataService,
        PlayerService,
        PlayerStatsService,
        ReportableDataManagerService,
        ReportingService,
        SettingsService,
        SystemTrayService,
        UltTimerWindowService,
    ],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("BackgroundService", BackgroundService, deps),
})
export class BackgroundService extends AllfatherService {
    /**
     * Keep a reference of Singleton services that need
     *  to persist throughout the lifetime of the app.
     */
    constructor(
        public readonly configuration: ConfigurationService,
        public readonly file: FileService,
        public readonly game: GameService,
        public readonly gameProcess: GameProcessService,
        public readonly hudWindowController: HUDWindowControllerService,
        public readonly inflictionInsightWindow: InflictionInsightWindowService,
        public readonly legendSelectAssistWindow: LegendSelectAssistWindowService,
        public readonly localDatabase: LocalDatabaseService,
        public readonly localStorage: LocalStorageService,
        public readonly mainWindow: MainWindowService,
        public readonly match: MatchService,
        public readonly matchActivity: MatchActivityService,
        public readonly matchLegendSelect: MatchLegendSelectService,
        public readonly matchMap: MatchMapService,
        public readonly matchPlayer: MatchPlayerService,
        public readonly matchPlayerInfliction: MatchPlayerInflictionService,
        public readonly matchPlayerInventory: MatchPlayerInventoryService,
        public readonly matchPlayerLegend: MatchPlayerLegendService,
        public readonly matchPlayerLocation: MatchPlayerLocationService,
        public readonly matchPlayerStats: MatchPlayerStatsService,
        public readonly matchRoster: MatchRosterService,
        public readonly matchTimerWindow: MatchTimerWindowService,
        public readonly overwolfExtensions: OverwolfExtensionsService,
        public readonly overwolfFeatureStatus: OverwolfFeatureStatusService,
        public readonly overwolfGameData: OverwolfGameDataService,
        public readonly player: PlayerService,
        public readonly playerStats: PlayerStatsService,
        public readonly reportableDataManager: ReportableDataManagerService,
        public readonly reporting: ReportingService,
        public readonly settings: SettingsService,
        public readonly systemTray: SystemTrayService,
        public readonly ultTimerWindow: UltTimerWindowService
    ) {
        super();
    }

    public relaunchApp(): void {
        this.overwolfExtensions.relaunchApp();
    }

    public exitApp(): void {
        const backgroundWindow = new UIWindow(WindowName.Background);
        const closeBackgroundWindow$ = of(undefined).pipe(
            delay(BACKGROUND_EXIT_DELAY),
            switchMap(() => backgroundWindow.close())
        );
        from([this.closeAllWindows$(), closeBackgroundWindow$]).pipe(takeUntil(this.isDestroyed$), concatAll()).subscribe();
    }

    /** Closes all windows except Background */
    private closeAllWindows$(): Observable<void> {
        const allWindowNames = Object.values(WindowName).filter((name) => name !== WindowName.Background);
        const allWindows$ = from(allWindowNames);
        return allWindows$.pipe(
            takeUntil(this.isDestroyed$),
            map((winName) => new UIWindow(winName)),
            mergeMap((uiWindow) => uiWindow.close()),
            catchError(() => of(undefined))
        );
    }
}

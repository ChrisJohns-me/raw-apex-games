import { GamePhase } from "@allfather-app/app/common/game-phase";
import { SettingKey, SettingValue } from "@allfather-app/app/common/settings";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { combineLatest, merge, Observable, Subscription } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";
import { AllfatherService } from "../core/allfather-service.abstract";
import { GameService } from "../core/game.service";
import { SettingsService } from "../core/settings.service";
import { InflictionInsightWindowService } from "../HUD/infliction-insight/windows/infliction-insight-window.service";
import { MatchTimerWindowService } from "../HUD/match-timer/windows/match-timer-window.service";
import { UltTimerWindowService } from "../HUD/ult-timer/windows/ult-timer-window.service";
import { LegendSelectAssistWindowService } from "../legend-select-assist/windows/legend-select-assist-window.service";

type HUDTriggers = {
    windowService: { open: () => Observable<void>; close: () => Observable<void> };
    requiredGamePhases: GamePhase[];
    requiredSettings: SettingKey[];
};

@Injectable({
    providedIn: "root",
    deps: [
        GameService,
        InflictionInsightWindowService,
        LegendSelectAssistWindowService,
        MatchTimerWindowService,
        SettingsService,
        UltTimerWindowService,
    ],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("HUDWindowControllerService", HUDWindowControllerService, deps),
})
export class HUDWindowControllerService extends AllfatherService {
    private HUDWindows: HUDTriggers[] = [
        {
            windowService: this.inflictionInsightWindow,
            requiredGamePhases: [GamePhase.InGame],
            requiredSettings: [SettingKey.EnableAllInGameHUD, SettingKey.EnableInGameInflictionInsightHUD],
        },
        {
            windowService: this.legendSelectAssistWindow,
            requiredGamePhases: [GamePhase.LegendSelection],
            requiredSettings: [SettingKey.EnableAllLegendSelectHUD],
        },
        {
            windowService: this.matchTimerWindow,
            requiredGamePhases: [GamePhase.InGame],
            requiredSettings: [SettingKey.EnableAllInGameHUD, SettingKey.EnableInGameMatchTimerHUD],
        },
        {
            windowService: this.ultTimerWindow,
            requiredGamePhases: [GamePhase.InGame],
            requiredSettings: [SettingKey.EnableAllInGameHUD, SettingKey.EnableInGameUltimateTimerHUD],
        },
    ];

    private watchEventsSubscription?: Subscription;

    constructor(
        private readonly game: GameService,
        private readonly inflictionInsightWindow: InflictionInsightWindowService,
        private readonly legendSelectAssistWindow: LegendSelectAssistWindowService,
        private readonly matchTimerWindow: MatchTimerWindowService,
        private readonly settingsService: SettingsService,
        private readonly ultTimerWindow: UltTimerWindowService
    ) {
        super();
    }

    public startWatchEvents(): void {
        combineLatest([this.settingsService.streamAllSettings$(), this.game.phase$])
            .pipe(
                takeUntil(this.destroy$),
                switchMap(([settings, gamePhase]) => merge(...this.fireHUDRequirements(settings, gamePhase)))
            )
            .subscribe();
    }

    public stop(): void {
        this.watchEventsSubscription?.unsubscribe();
        this.watchEventsSubscription = undefined;
    }

    /**
     * Creates a list of actions (open or close) fro all HUD windows (based on each window's requirements)
     * @returns Array of observable actions
     */
    private fireHUDRequirements(settings: { [key: string]: SettingValue }, gamePhase: GamePhase): Observable<void>[] {
        return this.HUDWindows.map((hud) => {
            const meetsGamePhase = Object.values(hud.requiredGamePhases).includes(gamePhase);
            const meetsSettings = hud.requiredSettings.every((reqSettingKey) => {
                const keyExists = reqSettingKey in settings;
                const savedValue = settings[reqSettingKey];
                return keyExists ? savedValue : true;
            });

            if (meetsGamePhase && meetsSettings) return hud.windowService.open();
            else return hud.windowService.close();
        });
    }
}

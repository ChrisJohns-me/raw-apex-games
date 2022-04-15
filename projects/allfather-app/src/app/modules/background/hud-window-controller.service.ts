import { GamePhase } from "@allfather-app/app/common/game-phase";
import { MatchGameModeGenericId } from "@allfather-app/app/common/match/game-mode/game-mode.enum";
import { SettingKey, SettingValue } from "@allfather-app/app/common/settings";
import { aXNWSVA } from "@allfather-app/app/common/vip";
import { SettingsService } from "@allfather-app/app/modules/core/settings.service";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Configuration } from "@allfather-app/configs/config.interface";
import { Injectable } from "@angular/core";
import { isEmpty } from "common/utilities";
import { combineLatest, merge, Observable, Subscription } from "rxjs";
import { filter, map, switchMap, take, takeUntil } from "rxjs/operators";
import { BaseService } from "../core/base-service.abstract";
import { ConfigurationService } from "../core/configuration.service";
import { GameService } from "../core/game.service";
import { MatchService } from "../core/match/match.service";
import { OverwolfProfileService } from "../core/overwolf/overwolf-profile.service";
import { HealingHelperWindowService } from "../HUD/healing-helper/windows/healing-helper-window.service";
import { InflictionInsightType } from "../HUD/infliction-insight/windows/infliction-insight-window.component";
import { InflictionInsightWindowService } from "../HUD/infliction-insight/windows/infliction-insight-window.service";
import { MatchTimerWindowService } from "../HUD/match-timer/windows/match-timer-window.service";
import { MiniInventoryWindowService } from "../HUD/mini-inventory/windows/mini-inventory-window.service";
import { ReticleHelperWindowService } from "../HUD/reticle-helper/windows/reticle-helper-window.service";
import { UltimateTimerType } from "../HUD/ult-timer/windows/ult-timer-window.component";
import { UltTimerWindowService } from "../HUD/ult-timer/windows/ult-timer-window.service";
import { LegendSelectAssistWindowService } from "../legend-select-assist/windows/legend-select-assist-window.service";

type HUDTriggers = {
    windowService: { open: () => Observable<void>; close: () => Observable<void> };
    requiredGamePhases: GamePhase[];
    requiredConfigurations: [(configuration: Configuration) => boolean];
    requiredSettings: { key: SettingKey; predicate?: (value: SettingValue) => boolean }[];
    requiredGameModes: MatchGameModeGenericId[];
};

@Injectable({
    providedIn: "root",
    deps: [
        ConfigurationService,
        GameService,
        HealingHelperWindowService,
        InflictionInsightWindowService,
        LegendSelectAssistWindowService,
        MatchService,
        MatchTimerWindowService,
        MiniInventoryWindowService,
        OverwolfProfileService,
        ReticleHelperWindowService,
        SettingsService,
        UltTimerWindowService,
    ],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("HUDWindowControllerService", HUDWindowControllerService, deps),
})
export class HUDWindowControllerService extends BaseService {
    private HUDWindows: HUDTriggers[] = [
        {
            windowService: this.inflictionInsightWindow,
            requiredGamePhases: [GamePhase.InGame],
            requiredConfigurations: [(config) => config.featureFlags.enableInflictionInsightWindow],
            requiredSettings: [
                { key: SettingKey.EnableAllInGameHUD },
                { key: SettingKey.InflictionInsightType, predicate: (value) => value !== InflictionInsightType.Disabled },
            ],
            requiredGameModes: [
                MatchGameModeGenericId.Arenas,
                MatchGameModeGenericId.BattleRoyale_Duos,
                MatchGameModeGenericId.BattleRoyale_Trios,
                MatchGameModeGenericId.BattleRoyale_Ranked,
            ],
        },
        {
            windowService: this.legendSelectAssistWindow,
            requiredGamePhases: [GamePhase.LegendSelection],
            requiredConfigurations: [(config) => config.featureFlags.enableLegendSelectAssistWindow],
            requiredSettings: [{ key: SettingKey.EnableAllLegendSelectHUD }],
            requiredGameModes: [
                MatchGameModeGenericId.BattleRoyale_Duos,
                MatchGameModeGenericId.BattleRoyale_Trios,
                MatchGameModeGenericId.BattleRoyale_Ranked,
            ],
        },
        {
            windowService: this.matchTimerWindow,
            requiredGamePhases: [GamePhase.InGame],
            requiredConfigurations: [(config) => config.featureFlags.enableMatchTimerWindow],
            requiredSettings: [{ key: SettingKey.EnableAllInGameHUD }, { key: SettingKey.EnableInGameMatchTimerHUD }],
            requiredGameModes: [
                MatchGameModeGenericId.Training,
                MatchGameModeGenericId.FiringRange,
                MatchGameModeGenericId.Arenas,
                MatchGameModeGenericId.Control,
                MatchGameModeGenericId.BattleRoyale_Duos,
                MatchGameModeGenericId.BattleRoyale_Trios,
                MatchGameModeGenericId.BattleRoyale_Ranked,
            ],
        },
        {
            windowService: this.miniInventoryWindow,
            requiredGamePhases: [GamePhase.InGame],
            requiredConfigurations: [(config) => config.featureFlags.enableMiniInventoryWindow],
            requiredSettings: [{ key: SettingKey.EnableAllInGameHUD }, { key: SettingKey.EnableInGameMatchTimerHUD }],
            requiredGameModes: [
                MatchGameModeGenericId.Training,
                MatchGameModeGenericId.FiringRange,
                MatchGameModeGenericId.Arenas,
                MatchGameModeGenericId.BattleRoyale_Duos,
                MatchGameModeGenericId.BattleRoyale_Trios,
                MatchGameModeGenericId.BattleRoyale_Ranked,
            ],
        },
        {
            windowService: this.ultTimerWindow,
            requiredGamePhases: [GamePhase.InGame],
            requiredConfigurations: [(config) => config.featureFlags.enableUltTimerWindow],
            requiredSettings: [
                { key: SettingKey.EnableAllInGameHUD },
                { key: SettingKey.UltimateTimerType, predicate: (value) => value !== UltimateTimerType.Disabled },
            ],
            requiredGameModes: [
                MatchGameModeGenericId.Training,
                MatchGameModeGenericId.FiringRange,
                MatchGameModeGenericId.BattleRoyale_Duos,
                MatchGameModeGenericId.BattleRoyale_Trios,
                MatchGameModeGenericId.BattleRoyale_Ranked,
            ],
        },
        {
            windowService: this.healingHelperWindow,
            requiredGamePhases: [GamePhase.InGame],
            requiredConfigurations: [(config) => config.featureFlags.enableHealingHelperWindow],
            requiredSettings: [{ key: SettingKey.EnableAllInGameHUD }, { key: SettingKey.EnableInGameHealingHelperHUD }],
            requiredGameModes: [
                MatchGameModeGenericId.BattleRoyale_Duos,
                MatchGameModeGenericId.BattleRoyale_Trios,
                MatchGameModeGenericId.BattleRoyale_Ranked,
            ],
        },
        {
            windowService: this.reticleHelperWindow,
            requiredGamePhases: [GamePhase.InGame],
            requiredConfigurations: [(config) => config.featureFlags.enableReticleHelperWindow],
            requiredSettings: [{ key: SettingKey.EnableInGameAimingReticle }],
            requiredGameModes: [
                MatchGameModeGenericId.Training,
                MatchGameModeGenericId.FiringRange,
                MatchGameModeGenericId.Arenas,
                MatchGameModeGenericId.Control,
                MatchGameModeGenericId.BattleRoyale_Duos,
                MatchGameModeGenericId.BattleRoyale_Trios,
                MatchGameModeGenericId.BattleRoyale_Ranked,
            ],
        },
    ];

    /** isVIP */
    private aXNWSVA = false;
    private watchEventsSubscription?: Subscription;

    constructor(
        private readonly configuration: ConfigurationService,
        private readonly game: GameService,
        private readonly healingHelperWindow: HealingHelperWindowService,
        private readonly inflictionInsightWindow: InflictionInsightWindowService,
        private readonly legendSelectAssistWindow: LegendSelectAssistWindowService,
        private readonly match: MatchService,
        private readonly matchTimerWindow: MatchTimerWindowService,
        private readonly miniInventoryWindow: MiniInventoryWindowService,
        private readonly overwolfProfile: OverwolfProfileService,
        private readonly reticleHelperWindow: ReticleHelperWindowService,
        private readonly settings: SettingsService,
        private readonly ultTimerWindow: UltTimerWindowService
    ) {
        super();

        // Setup VIP
        this.overwolfProfile
            .getCurrentUser()
            .pipe(
                takeUntil(this.destroy$),
                filter((userData) => !isEmpty(userData?.username)),
                map((userData) => userData.username),
                take(1)
            )
            .subscribe((un) => (this.aXNWSVA = aXNWSVA(un!)));
    }

    public startWatchEvents(): void {
        const genericGameModeId$ = this.match.gameMode$.pipe(
            filter((gameMode) => !!gameMode?.gameModeGenericId && !!gameMode.isAFSupported),
            map((gameMode) => gameMode!.gameModeGenericId as MatchGameModeGenericId)
        );
        combineLatest([this.configuration.config$, this.settings.streamAllSettings$(), this.game.phase$, genericGameModeId$])
            .pipe(
                takeUntil(this.destroy$),
                switchMap(([configuration, settings, gamePhase, genericGameModeId]) =>
                    merge(...this.fireHUDRequirements(configuration, settings, gamePhase, genericGameModeId))
                )
            )
            .subscribe();
    }

    public stop(): void {
        this.watchEventsSubscription?.unsubscribe();
        this.watchEventsSubscription = undefined;
    }

    /**
     * Performs an action (open or close) for each HUD windows (based on the window's requirements)
     * VIPs are exempt from configuration flag checks
     */
    private fireHUDRequirements(
        configuration: Configuration,
        settings: { [key: string]: SettingValue },
        gamePhase: GamePhase,
        genericGameModeId: MatchGameModeGenericId
    ): Observable<void>[] {
        return this.HUDWindows.map((hud) => {
            const meetsGameMode = hud.requiredGameModes.includes(genericGameModeId);
            const meetsGamePhase = Object.values(hud.requiredGamePhases).includes(gamePhase);
            const meetsConfigurations = this.aXNWSVA || hud.requiredConfigurations.every((reqConfigFn) => reqConfigFn(configuration));
            const meetsSettings = hud.requiredSettings.every((reqSetting) => {
                const keyExists = reqSetting.key in settings;
                const savedValue = settings[reqSetting.key];
                const predicate = typeof reqSetting.predicate === "function" ? reqSetting.predicate(savedValue) : savedValue;

                return keyExists ? predicate : true;
            });

            if (meetsConfigurations && meetsSettings && meetsGameMode && meetsGamePhase) return hud.windowService.open();
            else return hud.windowService.close();
        });
    }
}

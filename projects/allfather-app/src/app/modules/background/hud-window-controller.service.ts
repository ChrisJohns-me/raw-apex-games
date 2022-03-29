import { GamePhase } from "@allfather-app/app/common/game-phase";
import { MatchGameModeGenericId } from "@allfather-app/app/common/match/game-mode/game-mode.enum";
import { BaseService } from "@allfather-app/app/common/services/base-service.abstract";
import { SettingKey, SettingValue } from "@allfather-app/app/common/settings";
import { SettingsService } from "@allfather-app/app/modules/core/settings.service";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { combineLatest, merge, Observable, Subscription } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";
import { GameService } from "../core/game.service";
import { MatchService } from "../core/match/match.service";
import { InflictionInsightWindowService } from "../HUD/infliction-insight/windows/infliction-insight-window.service";
import { MatchTimerWindowService } from "../HUD/match-timer/windows/match-timer-window.service";
import { MiniInventoryWindowService } from "../HUD/mini-inventory/windows/mini-inventory-window.service";
import { ReticleHelperWindowService } from "../HUD/reticle-helper/windows/reticle-helper-window.service";
import { UltTimerWindowService } from "../HUD/ult-timer/windows/ult-timer-window.service";
import { LegendSelectAssistWindowService } from "../legend-select-assist/windows/legend-select-assist-window.service";

type HUDTriggers = {
    windowService: { open: () => Observable<void>; close: () => Observable<void> };
    requiredGamePhases: GamePhase[];
    requiredSettings: SettingKey[];
    requiredGameModes: MatchGameModeGenericId[];
};

@Injectable({
    providedIn: "root",
    deps: [
        GameService,
        InflictionInsightWindowService,
        LegendSelectAssistWindowService,
        MatchService,
        MatchTimerWindowService,
        MiniInventoryWindowService,
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
            requiredSettings: [SettingKey.EnableAllInGameHUD, SettingKey.EnableInGameInflictionInsightHUD],
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
            requiredSettings: [SettingKey.EnableAllLegendSelectHUD],
            requiredGameModes: [
                MatchGameModeGenericId.Arenas,
                MatchGameModeGenericId.BattleRoyale_Duos,
                MatchGameModeGenericId.BattleRoyale_Trios,
                MatchGameModeGenericId.BattleRoyale_Ranked,
            ],
        },
        {
            windowService: this.matchTimerWindow,
            requiredGamePhases: [GamePhase.InGame],
            requiredSettings: [SettingKey.EnableAllInGameHUD, SettingKey.EnableInGameMatchTimerHUD],
            requiredGameModes: [
                MatchGameModeGenericId.Arenas,
                MatchGameModeGenericId.BattleRoyale_Duos,
                MatchGameModeGenericId.BattleRoyale_Trios,
                MatchGameModeGenericId.BattleRoyale_Ranked,
            ],
        },
        {
            windowService: this.miniInventoryWindow,
            requiredGamePhases: [GamePhase.InGame],
            requiredSettings: [SettingKey.EnableAllInGameHUD, SettingKey.EnableInGameMatchTimerHUD],
            requiredGameModes: [
                MatchGameModeGenericId.Arenas,
                MatchGameModeGenericId.BattleRoyale_Duos,
                MatchGameModeGenericId.BattleRoyale_Trios,
                MatchGameModeGenericId.BattleRoyale_Ranked,
            ],
        },
        {
            windowService: this.ultTimerWindow,
            requiredGamePhases: [GamePhase.InGame],
            requiredSettings: [SettingKey.EnableAllInGameHUD, SettingKey.EnableInGameUltimateTimerHUD],
            requiredGameModes: [
                MatchGameModeGenericId.BattleRoyale_Duos,
                MatchGameModeGenericId.BattleRoyale_Trios,
                MatchGameModeGenericId.BattleRoyale_Ranked,
            ],
        },
        {
            windowService: this.reticleHelperWindow,
            requiredGamePhases: [GamePhase.InGame],
            requiredSettings: [SettingKey.EnableInGameAimingReticle],
            requiredGameModes: [
                MatchGameModeGenericId.Arenas,
                MatchGameModeGenericId.BattleRoyale_Duos,
                MatchGameModeGenericId.BattleRoyale_Trios,
                MatchGameModeGenericId.BattleRoyale_Ranked,
            ],
        },
    ];

    private watchEventsSubscription?: Subscription;

    constructor(
        private readonly game: GameService,
        private readonly inflictionInsightWindow: InflictionInsightWindowService,
        private readonly legendSelectAssistWindow: LegendSelectAssistWindowService,
        private readonly match: MatchService,
        private readonly matchTimerWindow: MatchTimerWindowService,
        private readonly miniInventoryWindow: MiniInventoryWindowService,
        private readonly reticleHelperWindow: ReticleHelperWindowService,
        private readonly settingsService: SettingsService,
        private readonly ultTimerWindow: UltTimerWindowService
    ) {
        super();
    }

    public startWatchEvents(): void {
        const genericGameModeId$ = this.match.gameMode$.pipe(
            filter((gameMode) => !!gameMode?.gameModeGenericId && !!gameMode.isAFSupported),
            map((gameMode) => gameMode!.gameModeGenericId as MatchGameModeGenericId)
        );
        combineLatest([this.settingsService.streamAllSettings$(), this.game.phase$, genericGameModeId$])
            .pipe(
                takeUntil(this.destroy$),
                switchMap(([settings, gamePhase, genericGameModeId]) =>
                    merge(...this.fireHUDRequirements(settings, gamePhase, genericGameModeId))
                )
            )
            .subscribe();
    }

    public stop(): void {
        this.watchEventsSubscription?.unsubscribe();
        this.watchEventsSubscription = undefined;
    }

    /**
     * Creates a list of actions (open or close) for all HUD windows (based on each window's requirements)
     * @returns Array of observable actions
     */
    private fireHUDRequirements(
        settings: { [key: string]: SettingValue },
        gamePhase: GamePhase,
        genericGameModeId: MatchGameModeGenericId
    ): Observable<void>[] {
        return this.HUDWindows.map((hud) => {
            const meetsGameMode = hud.requiredGameModes.includes(genericGameModeId);
            const meetsGamePhase = Object.values(hud.requiredGamePhases).includes(gamePhase);
            const meetsSettings = hud.requiredSettings.every((reqSettingKey) => {
                const keyExists = reqSettingKey in settings;
                const savedValue = settings[reqSettingKey];
                return keyExists ? savedValue : true;
            });

            if (meetsGameMode && meetsGamePhase && meetsSettings) return hud.windowService.open();
            else return hud.windowService.close();
        });
    }
}

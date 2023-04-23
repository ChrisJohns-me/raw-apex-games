import { Configuration } from "#app/../configs/config.interface.js";
import { GamePhase } from "#app/models/game-phase.js";
import { MatchGameModeGenericId } from "#app/models/match/game-mode/game-mode.enum.js";
import { SettingKey, SettingValue } from "#app/models/settings.js";
import { BaseService } from "#app/modules/core/base-service.abstract.js";
import { ConfigurationService } from "#app/modules/core/configuration.service.js";
import { GameService } from "#app/modules/core/game.service.js";
import { MatchService } from "#app/modules/core/match/match.service.js";
import { SettingsService } from "#app/modules/core/settings.service.js";
import { MiniInventoryWindowService } from "#app/modules/HUD/mini-inventory/windows/mini-inventory-window.service.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { isEmpty } from "#shared/utilities/primitives/boolean.js";
import { Injectable } from "@angular/core";
import { combineLatest, merge, Observable, Subscription } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";
import { LobbyStatusWindowService } from "../lobby-status/windows/lobby-status-window.service.js";

type HUDTriggers = {
    windowService: { open: () => Observable<void>; close: () => Observable<void> };
    requiredGamePhases: GamePhase[];
    requiredConfigurations: ((configuration: Configuration) => boolean)[];
    requiredSettings: { key: SettingKey; predicate?: (value: SettingValue) => boolean }[];
    requiredGameModes: MatchGameModeGenericId[];
};

@Injectable({
    providedIn: "root",
    deps: [ConfigurationService, GameService, LobbyStatusWindowService, MatchService, MiniInventoryWindowService, SettingsService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("HUDWindowControllerService", HUDWindowControllerService, deps),
})
export class HUDWindowControllerService extends BaseService {
    private HUDWindows: HUDTriggers[] = [
        {
            windowService: this.lobbyStatusWindow,
            requiredGamePhases: [GamePhase.Lobby],
            requiredConfigurations: [],
            requiredSettings: [],
            requiredGameModes: [],
        },
        {
            windowService: this.miniInventoryWindow,
            requiredGamePhases: [GamePhase.InGame],
            requiredConfigurations: [(config) => config.featureFlags.enableMiniInventoryWindow],
            requiredSettings: [{ key: SettingKey.EnableAllInGameHUD }, { key: SettingKey.EnableInGameMiniInventoryHUD }],
            requiredGameModes: [
                MatchGameModeGenericId.Training,
                MatchGameModeGenericId.FiringRange,
                MatchGameModeGenericId.BattleRoyale_Duos,
                MatchGameModeGenericId.BattleRoyale_Trios,
                MatchGameModeGenericId.BattleRoyale_Ranked,
                MatchGameModeGenericId.Control,
            ],
        },
    ];

    private watchEventsSubscription?: Subscription;

    constructor(
        private readonly configuration: ConfigurationService,
        private readonly game: GameService,
        private readonly lobbyStatusWindow: LobbyStatusWindowService,
        private readonly match: MatchService,
        private readonly miniInventoryWindow: MiniInventoryWindowService,
        private readonly settings: SettingsService
    ) {
        super();
    }

    public startWatchEvents(): void {
        const genericGameModeId$ = this.match.gameMode$.pipe(
            filter((gameMode) => !!gameMode?.gameModeGenericId),
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
     */
    private fireHUDRequirements(
        configuration: Configuration,
        settings: { [key: string]: SettingValue },
        gamePhase: GamePhase,
        genericGameModeId: MatchGameModeGenericId
    ): Observable<void>[] {
        return this.HUDWindows.map((hud) => {
            const meetsGameMode = isEmpty(hud.requiredGameModes) || hud.requiredGameModes.includes(genericGameModeId);
            const meetsGamePhase = isEmpty(hud.requiredGamePhases) || hud.requiredGamePhases.includes(gamePhase);
            const meetsConfigurations = hud.requiredConfigurations.every((reqConfigFn) => reqConfigFn(configuration));
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

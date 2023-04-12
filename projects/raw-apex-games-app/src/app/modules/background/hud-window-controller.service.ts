import { Injectable } from "@angular/core";
import { GamePhase } from "@raw-apex-games-app/app/common/game-phase";
import { MatchGameModeGenericId } from "@raw-apex-games-app/app/common/match/game-mode/game-mode.enum";
import { SettingKey, SettingValue } from "@raw-apex-games-app/app/common/settings";
import { aXNWSVA } from "@raw-apex-games-app/app/common/vip";
import { SettingsService } from "@raw-apex-games-app/app/modules/core/settings.service";
import { SingletonServiceProviderFactory } from "@raw-apex-games-app/app/singleton-service.provider.factory";
import { Configuration } from "@raw-apex-games-app/configs/config.interface";
import { isEmpty } from "common/utilities";
import { Observable, Subscription, combineLatest, merge } from "rxjs";
import { filter, map, switchMap, take, takeUntil } from "rxjs/operators";
import { MatchTimerWindowService } from "../HUD/match-timer/windows/match-timer-window.service";
import { MiniInventoryWindowService } from "../HUD/mini-inventory/windows/mini-inventory-window.service";
import { BaseService } from "../core/base-service.abstract";
import { ConfigurationService } from "../core/configuration.service";
import { GameService } from "../core/game.service";
import { MatchService } from "../core/match/match.service";
import { OverwolfProfileService } from "../core/overwolf/overwolf-profile.service";
import { LobbyStatusWindowService } from "../lobby-status/windows/lobby-status-window.service";
import { MatchSummaryWindowService } from "../match-summary/windows/match-summary-window.service";

type HUDTriggers = {
    windowService: { open: () => Observable<void>; close: () => Observable<void> };
    requiredGamePhases: GamePhase[];
    requiredConfigurations: ((configuration: Configuration) => boolean)[];
    requiredSettings: { key: SettingKey; predicate?: (value: SettingValue) => boolean }[];
    requiredGameModes: MatchGameModeGenericId[];
};

@Injectable({
    providedIn: "root",
    deps: [
        ConfigurationService,
        GameService,
        LobbyStatusWindowService,
        MatchService,
        MatchSummaryWindowService,
        MatchTimerWindowService,
        MiniInventoryWindowService,
        OverwolfProfileService,
        SettingsService,
    ],
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
            windowService: this.matchSummaryWindow,
            requiredGamePhases: [GamePhase.Lobby],
            requiredConfigurations: [(config) => config.featureFlags.enableMatchSummaryWindow],
            requiredSettings: [],
            requiredGameModes: [],
        },
        {
            windowService: this.matchTimerWindow,
            requiredGamePhases: [GamePhase.InGame],
            requiredConfigurations: [(config) => config.featureFlags.enableMatchTimerWindow],
            requiredSettings: [{ key: SettingKey.EnableAllInGameHUD }, { key: SettingKey.EnableInGameMatchTimerHUD }],
            requiredGameModes: [
                MatchGameModeGenericId.Training,
                MatchGameModeGenericId.FiringRange,
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
            requiredSettings: [{ key: SettingKey.EnableAllInGameHUD }, { key: SettingKey.EnableInGameMiniInventoryHUD }],
            requiredGameModes: [
                MatchGameModeGenericId.Training,
                MatchGameModeGenericId.FiringRange,
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
        private readonly lobbyStatusWindow: LobbyStatusWindowService,
        private readonly match: MatchService,
        private readonly matchSummaryWindow: MatchSummaryWindowService,
        private readonly matchTimerWindow: MatchTimerWindowService,
        private readonly miniInventoryWindow: MiniInventoryWindowService,
        private readonly overwolfProfile: OverwolfProfileService,
        private readonly settings: SettingsService
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
     * VIPs are exempt from configuration flag checks
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

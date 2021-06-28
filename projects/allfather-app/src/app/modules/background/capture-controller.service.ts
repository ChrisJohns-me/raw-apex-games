import { GamePhase } from "@allfather-app/app/common/game-phase";
import { MatchGameModeGenericId } from "@allfather-app/app/common/match/game-mode/game-mode.enum";
import { AllSettings, SettingKey, SettingValue } from "@allfather-app/app/common/settings";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { combineLatest, merge, Observable, Subscription } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";
import { AllfatherService } from "../core/allfather-service.abstract";
import { VideoRecordingService } from "../core/video-recording/video-recording.service";
import { GameService } from "../core/game.service";
import { MatchService } from "../core/match/match.service";
import { SettingsService } from "../core/settings.service";
import { InflictionInsightWindowService } from "../HUD/infliction-insight/windows/infliction-insight-window.service";
import { MatchTimerWindowService } from "../HUD/match-timer/windows/match-timer-window.service";
import { ReticleHelperWindowService } from "../HUD/reticle-helper/windows/reticle-helper-window.service";
import { UltTimerWindowService } from "../HUD/ult-timer/windows/ult-timer-window.service";
import { LegendSelectAssistWindowService } from "../legend-select-assist/windows/legend-select-assist-window.service";

export enum VideoCaptureMode {
    Manual = "manual",
    Highlights = "highlights",
    FullMatch = "fullmatch",
}

export enum CaptureEvent {
    Assist = "assist",
    Damage = "damage",
    Elimination = "elimination",
    Knockdown = "knockdown",
    PlayerDeath = "playerdeath",
    PlayerKnocked = "playerknocked",
    PlayerRespawn = "playerrespawn",
    PlayerRevived = "playerrevived",
    Victory = "victory",
}

@Injectable({
    providedIn: "root",
    deps: [
        GameService,
        MatchService,
        SettingsService,
        VideoRecordingService,
    ],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("CaptureControllerService", CaptureControllerService, deps),
})
export class CaptureControllerService extends AllfatherService {
    private watchEventsSubscription?: Subscription;

    constructor(
        private readonly game: GameService,
        private readonly match: MatchService,
        private readonly settingsService: SettingsService,
        private readonly videoRecording: VideoRecordingService,
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

    private setupSettingsListener(): void {
        this.settingsService
            .streamAllSettings$()
            .pipe(takeUntil(this.destroy$))
            .subscribe((allSettings) => {

            });
    }
}

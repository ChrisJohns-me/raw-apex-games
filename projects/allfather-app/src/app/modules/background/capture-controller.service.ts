import { BaseService } from "@allfather-app/app/common/services/base-service.abstract";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";

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
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("CaptureControllerService", CaptureControllerService, deps),
})
export class CaptureControllerService extends BaseService {
    // private watchEventsSubscription?: Subscription;

    constructor() {
        // private readonly videoRecording: VideoRecordingService, // private readonly settings: SettingsService, // private readonly match: MatchService, // private readonly game: GameService,
        super();
    }

    public startWatchEvents(): void {
        //     const genericGameModeId$ = this.match.gameMode$.pipe(
        //         filter((gameMode) => !!gameMode?.gameModeGenericId && !!gameMode.isAFSupported),
        //         map((gameMode) => gameMode!.gameModeGenericId as MatchGameModeGenericId)
        //     );
        //     combineLatest([this.settings.streamAllSettings$(), this.game.phase$, genericGameModeId$])
        //         .pipe(
        //             takeUntil(this.destroy$),
        //             switchMap(([settings, gamePhase, genericGameModeId]) =>
        //                 merge(...this.fireHUDRequirements(settings, gamePhase, genericGameModeId))
        //             )
        //         )
        //         .subscribe();
    }

    // public stop(): void {
    //     this.watchEventsSubscription?.unsubscribe();
    //     this.watchEventsSubscription = undefined;
    // }

    // private setupSettingsListener(): void {
    //     this.settings
    //         .streamAllSettings$()
    //         .pipe(takeUntil(this.destroy$))
    //         .subscribe((allSettings) => {

    //         });
    // }
}

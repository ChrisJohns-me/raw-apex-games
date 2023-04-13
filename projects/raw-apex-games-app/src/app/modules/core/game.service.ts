import { Injectable } from "@angular/core";
import { OverwolfFeatureDep } from "@raw-apex-games-app/app/common/feature-status";
import { GamePhase } from "@raw-apex-games-app/app/common/game-phase";
import { MatchGameModeGenericId } from "@raw-apex-games-app/app/common/match/game-mode/game-mode.enum";
import { MatchLocationPhase } from "@raw-apex-games-app/app/common/match/location";
import { SingletonServiceProviderFactory } from "@raw-apex-games-app/app/singleton-service.provider.factory";
import { exhaustiveEnumSwitch } from "common/utilities/switch";
import { BehaviorSubject } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";
import { BaseService } from "./base-service.abstract";
import { MatchService } from "./match/match.service";
import { OverwolfGameDataService } from "./overwolf";
import { OverwolfFeatureStatusService } from "./overwolf/overwolf-feature-status.service";

/**
 * @classdesc Provides general information about the game and it's meta state
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfGameDataService, OverwolfFeatureStatusService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("GameService", GameService, deps),
})
export class GameService extends BaseService {
    protected allFeatureDeps: OverwolfFeatureDep[] = [OverwolfFeatureDep.LegendSelect];

    public readonly phase$ = new BehaviorSubject<GamePhase>(GamePhase.Lobby);

    constructor(
        private readonly match: MatchService,
        private readonly overwolfGameData: OverwolfGameDataService,
        public readonly overwolfGameDataStatus: OverwolfFeatureStatusService
    ) {
        super(overwolfGameDataStatus);
        this.setupPhase();
    }

    private setupPhase(): void {
        this.overwolfGameData.infoUpdates$
            .pipe(
                takeUntil(this.destroy$),
                filter((infoUpdate) => infoUpdate.feature === "game_info" && !!infoUpdate.info.game_info?.phase),
                map((infoUpdate) => infoUpdate.info.game_info?.phase as GamePhase | MatchLocationPhase)
            )
            .subscribe((newPhase) => {
                if (newPhase && newPhase === this.phase$.value) return;
                switch (newPhase) {
                    case GamePhase.Lobby:
                    case GamePhase.LoadingScreen:
                    case GamePhase.LegendSelection:
                    case GamePhase.MatchSummary:
                        this.phase$.next(newPhase);
                        return;
                    case GamePhase.InGame: // This does not exist in Overwolf
                    case MatchLocationPhase.Aircraft:
                    case MatchLocationPhase.Freefly:
                    case MatchLocationPhase.Landed:
                        this.phase$.next(GamePhase.InGame);
                        return;
                    default:
                        exhaustiveEnumSwitch(newPhase);
                }
            });

        // On training or firingrange modes, emit InGame phase
        this.match.startedEvent$
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.match.gameMode$),
                filter(
                    (gm) =>
                        gm?.gameModeGenericId === MatchGameModeGenericId.Training ||
                        gm?.gameModeGenericId === MatchGameModeGenericId.FiringRange
                )
            )
            .subscribe(() => this.phase$.next(GamePhase.InGame));
    }
}

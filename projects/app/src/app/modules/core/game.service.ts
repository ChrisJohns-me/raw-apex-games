import { OverwolfFeatureDep } from "#app/models/feature-status.js";
import { GamePhase } from "#app/models/game-phase.js";
import { MatchGameModeGenericId } from "#app/models/match/game-mode/game-mode.enum.js";
import { MatchLocationPhase } from "#app/models/match/location.js";
import { BaseService } from "#app/modules/core/base-service.abstract.js";
import { MatchService } from "#app/modules/core/match/match.service.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { exhaustiveEnumSwitch } from "#shared/utilities/switch.js";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";
import { OverwolfGameDataService } from "./overwolf/index.js";
import { OverwolfFeatureStatusService } from "./overwolf/overwolf-feature-status.service.js";

/**
 * @classdesc Provides general information about the game and it's meta state
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfGameDataService, OverwolfFeatureStatusService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("GameService", GameService, deps),
})
export class GameService extends BaseService {
    protected allFeatureDeps: OverwolfFeatureDep[] = [OverwolfFeatureDep.LegendSelect, OverwolfFeatureDep.Phase];

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
                map((infoUpdate) => infoUpdate.info.game_info?.phase as GamePhase | MatchLocationPhase),
                filter((newPhase) => !!newPhase)
            )
            .subscribe((newPhase) => {
                if (newPhase === this.phase$.value) return;
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

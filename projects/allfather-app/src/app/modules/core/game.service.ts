import { GamePhase } from "@allfather-app/app/common/game-phase";
import { MatchGameModeType } from "@allfather-app/app/common/match/game-mode";
import { MatchRoster } from "@allfather-app/app/common/match/roster";
import { MatchState } from "@allfather-app/app/common/match/state";
import { TriggerConditions } from "@allfather-app/app/common/utilities/trigger-conditions";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { findValueByKeyRegEx, isEmpty } from "shared/utilities";
import { AllfatherService } from "./allfather-service.abstract";
import { MatchRosterService } from "./match/match-roster.service";
import { MatchService } from "./match/match.service";
import { OverwolfGameDataService, OWInfoUpdates2Event } from "./overwolf";
import { OverwolfFeatureDep, OverwolfFeatureStatusService } from "./overwolf/overwolf-feature-status.service";

/** Amount of time to set GamePhase to "Pregame". */
const PREGAME_DELAY = 4500;

/**
 * @classdesc Provides general information about the game and it's meta state
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, MatchRosterService, OverwolfGameDataService, OverwolfFeatureStatusService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("GameService", GameService, deps),
})
export class GameService extends AllfatherService {
    protected allFeatureDeps: OverwolfFeatureDep[] = [OverwolfFeatureDep.LegendSelect];

    public readonly phase$ = new BehaviorSubject<GamePhase>(GamePhase.Lobby);

    constructor(
        private readonly match: MatchService,
        private readonly matchRoster: MatchRosterService,
        private readonly overwolfGameData: OverwolfGameDataService,
        overwolfGameDataStatus: OverwolfFeatureStatusService
    ) {
        super(overwolfGameDataStatus);
        this.setupPhase();
    }

    private setupPhase(): void {
        const setNewPhaseFn = (newPhase?: GamePhase): void => {
            if (newPhase && newPhase !== this.phase$.value && super.areAllFeatureDepsAvailable()) {
                if (newPhase !== GamePhase.PreGame) this.phase$.next(newPhase);
                else setTimeout(() => this.phase$.next(newPhase), PREGAME_DELAY);
            }
        };

        const triggers = new TriggerConditions<GamePhase, [OWInfoUpdates2Event?, MatchState?, MatchRoster?]>("GamePhase", {
            [GamePhase.Lobby]: (infoUpdate, matchState) => matchState === MatchState.Inactive,
            [GamePhase.LegendSelection]: (infoUpdate, matchState, stagedMatchRoster) =>
                this.phase$.value !== GamePhase.LegendSelection &&
                this.phase$.value !== GamePhase.PreGame &&
                this.match.gameMode$.value?.baseType !== MatchGameModeType.FIRINGRANGE &&
                this.match.gameMode$.value?.baseType !== MatchGameModeType.TRAINING &&
                ((stagedMatchRoster?.allPlayers.length ?? 0) > 0 ||
                    (infoUpdate?.feature === "team" && !isEmpty(findValueByKeyRegEx(infoUpdate?.info?.match_info, /^legendSelect/)))),
            [GamePhase.PreGame]: (infoUpdate) =>
                !!infoUpdate?.info &&
                this.phase$.value === GamePhase.LegendSelection &&
                !!(
                    infoUpdate.info.match_info?.legendSelect_0?.lead ||
                    infoUpdate.info.match_info?.legendSelect_1?.lead ||
                    infoUpdate.info.match_info?.legendSelect_2?.lead
                ),
            [GamePhase.InGame]: (infoUpdate, matchState) => matchState === MatchState.Active,
        });

        this.overwolfGameData.infoUpdates$.pipe(takeUntil(this.isDestroyed$)).subscribe((infoUpdate) => {
            const newPhase = triggers.triggeredFirstKey(infoUpdate, undefined, undefined);
            setNewPhaseFn(newPhase);
        });

        this.match.state$.pipe(takeUntil(this.isDestroyed$)).subscribe((stateChanged) => {
            const newPhase = triggers.triggeredFirstKey(undefined, stateChanged.state, undefined);
            setNewPhaseFn(newPhase);
        });

        this.matchRoster.stagedMatchRoster$.pipe(takeUntil(this.isDestroyed$)).subscribe((stagedMatchRoster) => {
            const newPhase = triggers.triggeredFirstKey(undefined, undefined, stagedMatchRoster);
            setNewPhaseFn(newPhase);
        });
    }
}

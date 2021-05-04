import { GamePhase } from "@allfather-app/app/shared/models/game-phase";
import { MatchRoster } from "@allfather-app/app/shared/models/match/roster";
import { MatchState } from "@allfather-app/app/shared/models/match/state";
import { TriggerConditions } from "@allfather-app/app/shared/models/utilities/trigger-conditions";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { findValueByKeyRegEx, isEmpty } from "shared/utilities";
import { AllfatherService } from "./allfather-service.abstract";
import { MatchRosterService } from "./match/match-roster.service";
import { MatchService } from "./match/match.service";
import { OverwolfGameDataService, OWInfoUpdates2Event } from "./overwolf";

/** Amount of time to set GamePhase to "Pregame". */
const PREGAME_DELAY = 5000;

/**
 * @classdesc Provides general information about the game and it's meta state
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, MatchRosterService, OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("GameService", GameService, deps),
})
export class GameService extends AllfatherService {
    public readonly phase$ = new BehaviorSubject<GamePhase>(GamePhase.Lobby);

    constructor(
        private readonly match: MatchService,
        private readonly matchRoster: MatchRosterService,
        private readonly overwolfGameData: OverwolfGameDataService
    ) {
        super();
    }

    public init(): void {
        this.setupPhase();
    }

    private setupPhase(): void {
        const setNewPhaseFn = (newPhase?: GamePhase): void => {
            if (newPhase && newPhase !== this.phase$.value) {
                setTimeout(() => this.phase$.next(newPhase), newPhase === GamePhase.PreGame ? PREGAME_DELAY : 0);
            }
        };

        const triggers = new TriggerConditions<GamePhase, [OWInfoUpdates2Event?, MatchState?, GamePhase?, MatchRoster?]>("GamePhase", {
            [GamePhase.Lobby]: (infoUpdate, matchState) => matchState === MatchState.Inactive,
            [GamePhase.LegendSelection]: (infoUpdate, matchState, gamePhase, stagedMatchRoster) =>
                gamePhase !== GamePhase.LegendSelection &&
                gamePhase !== GamePhase.PreGame &&
                ((stagedMatchRoster?.allPlayers.length ?? 0) > 0 ||
                    (infoUpdate?.feature === "team" && !isEmpty(findValueByKeyRegEx(infoUpdate?.info?.match_info, /^legendSelect/)))),
            [GamePhase.PreGame]: (infoUpdate, matchState, gamePhase) =>
                !!infoUpdate?.info &&
                gamePhase === GamePhase.LegendSelection &&
                !!(
                    infoUpdate.info.match_info?.legendSelect_0?.lead ||
                    infoUpdate.info.match_info?.legendSelect_1?.lead ||
                    infoUpdate.info.match_info?.legendSelect_2?.lead
                ),
            [GamePhase.InGame]: (infoUpdate, matchState) => matchState === MatchState.Active,
        });

        this.overwolfGameData.infoUpdates$.pipe(takeUntil(this.isDestroyed$)).subscribe((infoUpdate) => {
            const newPhase = triggers.triggeredFirstKey(infoUpdate, undefined, this.phase$.value);
            setNewPhaseFn(newPhase);
        });

        this.match.state$.pipe(takeUntil(this.isDestroyed$)).subscribe((stateChanged) => {
            const newPhase = triggers.triggeredFirstKey(undefined, stateChanged.state, this.phase$.value);
            setNewPhaseFn(newPhase);
        });

        this.matchRoster.stagedMatchRoster$.pipe(takeUntil(this.isDestroyed$)).subscribe((stagedMatchRoster) => {
            const newPhase = triggers.triggeredFirstKey(undefined, undefined, this.phase$.value, stagedMatchRoster);
            setNewPhaseFn(newPhase);
        });
    }
}

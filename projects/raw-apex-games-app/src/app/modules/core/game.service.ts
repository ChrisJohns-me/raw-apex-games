import { Injectable } from "@angular/core";
import { OverwolfFeatureDep } from "@raw-apex-games-app/app/common/feature-status";
import { GamePhase } from "@raw-apex-games-app/app/common/game-phase";
import { MatchGameModeGenericId } from "@raw-apex-games-app/app/common/match/game-mode/game-mode.enum";
import { MatchRoster } from "@raw-apex-games-app/app/common/match/roster";
import { MatchState } from "@raw-apex-games-app/app/common/match/state";
import { TriggerConditions } from "@raw-apex-games-app/app/common/utilities/trigger-conditions";
import { SingletonServiceProviderFactory } from "@raw-apex-games-app/app/singleton-service.provider.factory";
import { findValueByKeyRegEx, isEmpty } from "common/utilities/";
import { BehaviorSubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { BaseService } from "./base-service.abstract";
import { MatchRosterService } from "./match/match-roster.service";
import { MatchService } from "./match/match.service";
import { OWInfoUpdates2Event, OverwolfGameDataService } from "./overwolf";
import { OverwolfFeatureStatusService } from "./overwolf/overwolf-feature-status.service";

/** Amount of delay time to set GamePhase to "Pregame", after first legend is selected */
const PREGAME_DELAY = 18500;

/**
 * @classdesc Provides general information about the game and it's meta state
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, MatchRosterService, OverwolfGameDataService, OverwolfFeatureStatusService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("GameService", GameService, deps),
})
export class GameService extends BaseService {
    protected allFeatureDeps: OverwolfFeatureDep[] = [OverwolfFeatureDep.LegendSelect];

    public readonly phase$ = new BehaviorSubject<GamePhase>(GamePhase.Lobby);

    constructor(
        private readonly match: MatchService,
        private readonly matchRoster: MatchRosterService,
        private readonly overwolfGameData: OverwolfGameDataService,
        public readonly overwolfGameDataStatus: OverwolfFeatureStatusService
    ) {
        super(overwolfGameDataStatus);
        this.setupPhase();
    }

    private setupPhase(): void {
        const setNewPhaseFn = (newPhase?: GamePhase): void => {
            if (newPhase && newPhase !== this.phase$.value && super.areAllFeatureDepsAvailable()) {
                // Delay setting PreGame to wait x seconds after first legend is selected
                if (newPhase === GamePhase.PreGame) {
                    setTimeout(() => {
                        if (this.phase$.value === GamePhase.LegendSelection) this.phase$.next(newPhase);
                    }, PREGAME_DELAY);
                } else {
                    this.phase$.next(newPhase);
                }
            }
        };

        const triggers = new TriggerConditions<GamePhase, [OWInfoUpdates2Event?, MatchState?, MatchRoster?]>("GamePhase", {
            [GamePhase.Lobby]: (infoUpdate, matchState) => matchState === MatchState.Inactive,
            [GamePhase.LegendSelection]: (infoUpdate, matchState, stagedMatchRoster) =>
                this.phase$.value !== GamePhase.LegendSelection &&
                this.phase$.value !== GamePhase.PreGame &&
                this.match.gameMode$.value?.gameModeGenericId !== MatchGameModeGenericId.FiringRange &&
                this.match.gameMode$.value?.gameModeGenericId !== MatchGameModeGenericId.Training &&
                ((stagedMatchRoster?.allPlayers.length ?? 0) > 0 ||
                    (infoUpdate?.feature === "team" && !isEmpty(findValueByKeyRegEx(infoUpdate?.info?.match_info, /^legendSelect/)))),
            [GamePhase.PreGame]: (infoUpdate) =>
                !!infoUpdate?.info &&
                this.phase$.value === GamePhase.LegendSelection &&
                !isEmpty(findValueByKeyRegEx(infoUpdate?.info?.match_info, /^legendSelect/)),
            [GamePhase.InGame]: (infoUpdate, matchState) => matchState === MatchState.Active,
        });

        this.overwolfGameData.infoUpdates$.pipe(takeUntil(this.destroy$)).subscribe((infoUpdate) => {
            const newPhase = triggers.triggeredFirstKey(infoUpdate, undefined, undefined);
            setNewPhaseFn(newPhase);
        });

        this.match.state$.pipe(takeUntil(this.destroy$)).subscribe((stateChanged) => {
            const newPhase = triggers.triggeredFirstKey(undefined, stateChanged.state, undefined);
            setNewPhaseFn(newPhase);
        });

        this.matchRoster.stagedMatchRoster$.pipe(takeUntil(this.destroy$)).subscribe((stagedMatchRoster) => {
            const newPhase = triggers.triggeredFirstKey(undefined, undefined, stagedMatchRoster);
            setNewPhaseFn(newPhase);
        });
    }
}

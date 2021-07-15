import { Injectable } from "@angular/core";
import { OverwolfFeatureDep } from "@shared-app/feature-status";
import { GamePhase } from "@shared-app/game-phase";
import { MatchGameModeGenericId } from "@shared-app/match/game-mode/game-mode.enum";
import { MatchRoster } from "@shared-app/match/roster";
import { MatchState } from "@shared-app/match/state";
import { BaseService } from "@shared-app/services/base-service.abstract";
import { OverwolfGameDataService, OWInfoUpdates2Event } from "@shared-app/services/overwolf";
import { OverwolfFeatureStatusService } from "@shared-app/services/overwolf/overwolf-feature-status.service";
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { TriggerConditions } from "@shared-app/utilities/trigger-conditions";
import { findValueByKeyRegEx, isEmpty } from "common/utilities/";
import { BehaviorSubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatchRosterService } from "./match/match-roster.service";
import { MatchService } from "./match/match.service";
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
                if (newPhase !== GamePhase.PreGame) this.phase$.next(newPhase);
                else
                    setTimeout(() => {
                        if (this.phase$.value === GamePhase.LegendSelection) this.phase$.next(newPhase);
                    }, PREGAME_DELAY);
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
                !!(
                    infoUpdate.info.match_info?.legendSelect_0?.lead ||
                    infoUpdate.info.match_info?.legendSelect_1?.lead ||
                    infoUpdate.info.match_info?.legendSelect_2?.lead
                ),
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

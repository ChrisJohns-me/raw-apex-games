import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatchState } from "../../../common/match/state";
import { PlayerState } from "../../../common/player-state";
import { TriggerConditions } from "../../../common/utilities/trigger-conditions";
import { SingletonServiceProviderFactory } from "../../../singleton-service.provider.factory";
import { BaseService } from "../base-service.abstract";
import { OverwolfGameDataService, OWGameEvent, OWInfoUpdates2Event } from "../overwolf";
import { MatchService } from "./match.service";

@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchPlayerService", MatchPlayerService, deps),
})
export class MatchPlayerService extends BaseService {
    /** Local player's state in the match. Resets on match start */
    public readonly myState$ = new BehaviorSubject<PlayerState>(PlayerState.Disconnected);
    /** Check if local player is currently alive */
    public get isAlive(): boolean {
        return this.myState$.value === PlayerState.Alive;
    }

    constructor(private readonly match: MatchService, private readonly overwolfGameData: OverwolfGameDataService) {
        super();
        this.setupOnMatchStart();
        this.setupMyState();
    }

    /**
     * Reset state on match start
     */
    private setupOnMatchStart(): void {
        this.match.startedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.myState$.next(PlayerState.Alive);
        });
    }

    private setupMyState(): void {
        const setNewStateFn = (newState?: PlayerState): void => {
            if (newState && newState !== this.myState$.value) this.myState$.next(newState);
        };

        const triggers = new TriggerConditions<PlayerState, [OWInfoUpdates2Event?, OWGameEvent?, MatchState?]>("PlayerState", {
            [PlayerState.Alive]: (infoUpdate, gameEvent, matchState) =>
                matchState === MatchState.Active ||
                gameEvent?.name === "healed_from_ko" ||
                gameEvent?.name === "respawn" ||
                gameEvent?.name === "match_start",
            [PlayerState.Knocked]: (infoUpdate, gameEvent) =>
                (infoUpdate?.feature === "inventory" && infoUpdate.info.me?.inUse?.inUse === "Knockdown Shield") ||
                gameEvent?.name === "knocked_out",
            [PlayerState.Eliminated]: (infoUpdate, gameEvent) => gameEvent?.name === "death",
            [PlayerState.Disconnected]: (infoUpdate, gameEvent, matchState) =>
                matchState === MatchState.Inactive || gameEvent?.name === "match_end",
        });

        this.overwolfGameData.infoUpdates$.pipe(takeUntil(this.destroy$)).subscribe((infoUpdate) => {
            const newState = triggers.triggeredFirstKey(infoUpdate, undefined, undefined);
            setNewStateFn(newState);
        });

        this.overwolfGameData.newGameEvent$.pipe(takeUntil(this.destroy$)).subscribe((gameEvent) => {
            const newState = triggers.triggeredFirstKey(undefined, gameEvent, undefined);
            setNewStateFn(newState);
        });

        this.match.state$.pipe(takeUntil(this.destroy$)).subscribe((stateChanged) => {
            const newState = triggers.triggeredFirstKey(undefined, undefined, stateChanged.state);
            setNewStateFn(newState);
        });
    }
}

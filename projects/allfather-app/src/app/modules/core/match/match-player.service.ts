import { MatchState } from "@allfather-app/app/common/match/state";
import { PlayerState } from "@allfather-app/app/common/player-state";
import { TriggerConditions } from "@allfather-app/app/common/utilities/trigger-conditions";
import { OverwolfGameDataService, OWGameEvent, OWInfoUpdates2Event } from "@allfather-app/app/modules/core/overwolf";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AllfatherService } from "../allfather-service.abstract";
import { MatchService } from "./match.service";

@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchPlayerService", MatchPlayerService, deps),
})
export class MatchPlayerService extends AllfatherService {
    /** Reset on match start */
    public readonly myState$ = new BehaviorSubject<PlayerState>(PlayerState.Disconnected);
    /** Immediately check if local player is alive */
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
        this.match.startedEvent$.pipe(takeUntil(this.isDestroyed$)).subscribe(() => {
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

        this.overwolfGameData.infoUpdates$.pipe(takeUntil(this.isDestroyed$)).subscribe((infoUpdate) => {
            const newState = triggers.triggeredFirstKey(infoUpdate, undefined, undefined);
            setNewStateFn(newState);
        });

        this.overwolfGameData.newGameEvent$.pipe(takeUntil(this.isDestroyed$)).subscribe((gameEvent) => {
            const newState = triggers.triggeredFirstKey(undefined, gameEvent, undefined);
            setNewStateFn(newState);
        });

        this.match.state$.pipe(takeUntil(this.isDestroyed$)).subscribe((stateChanged) => {
            const newState = triggers.triggeredFirstKey(undefined, undefined, stateChanged.state);
            setNewStateFn(newState);
        });
    }
}

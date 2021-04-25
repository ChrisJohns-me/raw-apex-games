import { OverwolfGameDataService, OWGameEvent, OWInfoUpdates2Event } from "@allfather-app/app/modules/core/overwolf";
import { MatchState } from "@allfather-app/app/shared/models/match/state";
import { PlayerState } from "@allfather-app/app/shared/models/player-state";
import { TriggerConditions } from "@allfather-app/app/shared/models/utilities/trigger-conditions";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatchService } from "./match.service";

@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchPlayerService", MatchPlayerService, deps),
})
export class MatchPlayerService implements OnDestroy {
    /** Reset on match start */
    public readonly myState$ = new BehaviorSubject<PlayerState>(PlayerState.Disconnected);
    /** Immediately check if local player is alive */
    public get isAlive(): boolean {
        return this.myState$.value === PlayerState.Alive;
    }

    private readonly _unsubscribe$ = new Subject<void>();

    constructor(private readonly match: MatchService, private readonly overwolfGameData: OverwolfGameDataService) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public init(): void {
        this.setupOnMatchStart();
        this.setupMyState();
    }

    /**
     * Reset state on match start
     */
    private setupOnMatchStart(): void {
        this.match.startedEvent$.pipe(takeUntil(this._unsubscribe$)).subscribe(() => {
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

        this.overwolfGameData.infoUpdates$.pipe(takeUntil(this._unsubscribe$)).subscribe((infoUpdate) => {
            const newState = triggers.triggeredFirstKey(infoUpdate, undefined, undefined);
            setNewStateFn(newState);
        });

        this.overwolfGameData.newGameEvent$.pipe(takeUntil(this._unsubscribe$)).subscribe((gameEvent) => {
            const newState = triggers.triggeredFirstKey(undefined, gameEvent, undefined);
            setNewStateFn(newState);
        });

        this.match.state$.pipe(takeUntil(this._unsubscribe$)).subscribe((stateChanged) => {
            const newState = triggers.triggeredFirstKey(undefined, undefined, stateChanged.state);
            setNewStateFn(newState);
        });
    }
}

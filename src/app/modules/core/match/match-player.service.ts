import { Injectable, OnDestroy } from "@angular/core";
import { SingletonServiceProviderFactory } from "@app/singleton-service.provider.factory";
import { OverwolfDataProviderService, OWGameEvent, OWInfoUpdates2Event } from "@core/overwolf-data-provider";
import { MatchState } from "@shared/models/match/match-state";
import { PlayerState } from "@shared/models/player-state";
import { TriggerConditions } from "@shared/models/utilities/trigger-conditions";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatchService } from "./match.service";

@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfDataProviderService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchPlayerService", MatchPlayerService, deps),
})
export class MatchPlayerService implements OnDestroy {
    /** Reset on match start */
    public readonly myState$ = new BehaviorSubject<Optional<PlayerState>>(undefined);
    /** Immediately check if local player is alive */
    public get isAlive(): boolean {
        return this.myState$.value === PlayerState.Alive;
    }

    private readonly _unsubscribe$ = new Subject<void>();

    constructor(private readonly match: MatchService, private readonly overwolfData: OverwolfDataProviderService) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public start(): void {
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

        const triggers = new TriggerConditions<PlayerState, [OWInfoUpdates2Event?, OWGameEvent?, MatchState?]>({
            [PlayerState.Alive]: (infoUpdate, gameEvent, matchState) =>
                matchState === MatchState.Active ||
                gameEvent?.name === "healed_from_ko" ||
                gameEvent?.name === "respawn" ||
                gameEvent?.name === "match_start",
            [PlayerState.Knocked]: (infoUpdate, gameEvent) =>
                (infoUpdate?.feature === "inventory" && infoUpdate.info.me?.inUse?.inUse === "Knockdown Shield") ||
                gameEvent?.name === "knocked_out",
            [PlayerState.Eliminated]: (infoUpdate, gameEvent, matchState) =>
                matchState === MatchState.Inactive || gameEvent?.name === "death" || gameEvent?.name === "match_end",
        });

        this.overwolfData.infoUpdates$.pipe(takeUntil(this._unsubscribe$)).subscribe((infoUpdate) => {
            const newState = triggers.triggeredFirstKey(infoUpdate, undefined, undefined);
            setNewStateFn(newState);
        });

        this.overwolfData.newGameEvent$.pipe(takeUntil(this._unsubscribe$)).subscribe((gameEvent) => {
            const newState = triggers.triggeredFirstKey(undefined, gameEvent, undefined);
            setNewStateFn(newState);
        });

        this.match.state$.pipe(takeUntil(this._unsubscribe$)).subscribe((stateChanged) => {
            const newState = triggers.triggeredFirstKey(undefined, undefined, stateChanged.state);
            setNewStateFn(newState);
        });
    }
}

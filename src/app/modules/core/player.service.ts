import { Injectable, OnDestroy } from "@angular/core";
import { MatchState } from "@common/match/match-state";
import { PlayerState } from "@common/player-state";
import { TriggerConditions } from "@common/trigger-conditions";
import { isPlayerNameEqual } from "@common/utilities/player";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { MatchService } from "./match.service";
import { OverwolfDataProviderService, OWGameEvent, OWGameEventKillFeed, OWInfoUpdates2Event } from "./overwolf-data-provider";

@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfDataProviderService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("PlayerService", PlayerService, deps),
})
export class PlayerService implements OnDestroy {
    /** Data gathered from Overwolf's "me" data. If empty during a match, attempts to infer from killfeed. */
    public readonly myName$ = new BehaviorSubject<Optional<string>>(undefined);
    /** Reset on match start */
    public readonly myState$ = new BehaviorSubject<Optional<PlayerState>>(undefined);
    /** Immediately check if local player is alive */
    public get isAlive(): boolean {
        return this.myState$.value === PlayerState.Alive;
    }

    private readonly _unsubscribe = new Subject<void>();

    constructor(private readonly match: MatchService, private readonly overwolf: OverwolfDataProviderService) {}

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupMatchReset();
        this.setupMyName();
        this.setupMyState();
    }

    /**
     * Reset state on match start
     */
    private setupMatchReset(): void {
        this.match.startedEvent$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this.myState$.next(PlayerState.Alive);
        });
    }

    // TODO: Get player name from storage
    private setupMyName(): void {
        const setNameFn = (name?: string): void => {
            if (!isPlayerNameEqual(name, this.myName$.value)) this.myName$.next(name);
        };

        this.overwolf.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((infoUpdate) => infoUpdate.feature === "me" && !!infoUpdate.info.me?.name),
                map((infoUpdate) => infoUpdate.info.me?.name)
            )
            .subscribe((myName) => setNameFn(myName));

        this.overwolf.newGameEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((gameEvent) => gameEvent.name === "kill_feed"),
                filter((gameEvent) => !!(gameEvent.data as OWGameEventKillFeed).local_player_name),
                map((gameEvent) => (gameEvent.data as OWGameEventKillFeed).local_player_name)
            )
            .subscribe((myName) => setNameFn(myName));
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

        this.overwolf.infoUpdates$.pipe(takeUntil(this._unsubscribe)).subscribe((infoUpdate) => {
            const newState = triggers.triggeredFirstKey(infoUpdate, undefined, undefined);
            setNewStateFn(newState);
        });

        this.overwolf.newGameEvent$.pipe(takeUntil(this._unsubscribe)).subscribe((gameEvent) => {
            const newState = triggers.triggeredFirstKey(undefined, gameEvent, undefined);
            setNewStateFn(newState);
        });

        this.match.currentState$.pipe(takeUntil(this._unsubscribe)).subscribe((matchStateChanged) => {
            const newState = triggers.triggeredFirstKey(undefined, undefined, matchStateChanged.state);
            setNewStateFn(newState);
        });
    }
}

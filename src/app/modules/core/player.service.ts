import { Injectable, OnDestroy } from "@angular/core";
import { TriggerConditions } from "@common/game-event-triggers";
import { MatchState } from "@common/match";
import { PlayerStatus } from "@common/player";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { MatchService } from "./match.service";
import {
    OverwolfDataProviderService,
    OWGameEvent,
    OWGameEventKillFeed,
    OWInfoUpdates2Event,
} from "./overwolf-data-provider";

@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfDataProviderService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("PlayerService", PlayerService, deps),
})
export class PlayerService implements OnDestroy {
    public readonly status$ = new BehaviorSubject<PlayerStatus>(PlayerStatus.Alive);
    public readonly playerName$ = new BehaviorSubject<string>("");

    private readonly _unsubscribe = new Subject<void>();

    constructor(private readonly match: MatchService, private readonly overwolf: OverwolfDataProviderService) {}

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupPlayerName();
        this.setupStatus();
    }

    // TODO: Get player name from storage
    //#region Player Name
    private setupPlayerName(): void {
        const checkNameFn = (name?: string): void => {
            if (name && name !== this.playerName$.value) this.playerName$.next(name);
        };

        this.overwolf.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((infoUpdate) => infoUpdate.feature === "me" && !!infoUpdate.info.me?.name),
                map((infoUpdate) => infoUpdate.info.me?.name)
            )
            .subscribe((localPlayerName) => checkNameFn(localPlayerName));

        this.overwolf.newGameEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((gameEvent) => gameEvent.name === "kill_feed"),
                filter((gameEvent) => !!(gameEvent.data as OWGameEventKillFeed).local_player_name),
                map((gameEvent) => (gameEvent.data as OWGameEventKillFeed).local_player_name)
            )
            .subscribe((localPlayerName) => checkNameFn(localPlayerName));
    }
    //#endregion

    //#region Player Status
    private setupStatus(): void {
        const setNewStatusFn = (newStatus?: PlayerStatus): void => {
            if (newStatus && newStatus !== this.status$.value) this.status$.next(newStatus);
        };

        const triggers = new TriggerConditions<PlayerStatus, [OWInfoUpdates2Event?, OWGameEvent?, MatchState?]>({
            [PlayerStatus.Alive]: (infoUpdate, gameEvent, matchState) =>
                matchState === MatchState.Active ||
                gameEvent?.name === "healed_from_ko" ||
                gameEvent?.name === "respawn" ||
                gameEvent?.name === "match_start",
            [PlayerStatus.Knocked]: (infoUpdate, gameEvent) =>
                (infoUpdate?.feature === "inventory" && infoUpdate.info.me?.inUse?.inUse === "Knockdown Shield") ||
                gameEvent?.name === "knocked_out",
            [PlayerStatus.Eliminated]: (infoUpdate, gameEvent, matchState) =>
                matchState === MatchState.Inactive || gameEvent?.name === "death" || gameEvent?.name === "match_end",
        });

        this.overwolf.infoUpdates$.pipe(takeUntil(this._unsubscribe)).subscribe((infoUpdate) => {
            const newStatus = triggers.triggeredFirstKey(infoUpdate, undefined, undefined);
            setNewStatusFn(newStatus);
        });

        this.overwolf.newGameEvent$.pipe(takeUntil(this._unsubscribe)).subscribe((gameEvent) => {
            const newStatus = triggers.triggeredFirstKey(undefined, gameEvent, undefined);
            setNewStatusFn(newStatus);
        });

        this.match.state$.pipe(takeUntil(this._unsubscribe)).subscribe((matchState) => {
            const newStatus = triggers.triggeredFirstKey(undefined, undefined, matchState);
            setNewStatusFn(newStatus);
        });
    }
    //#endregion
}

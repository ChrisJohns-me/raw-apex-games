import { Injectable, OnDestroy } from "@angular/core";
import { TriggerConditions } from "@common/game-event-triggers";
import { MatchState } from "@common/match";
import { Player, PlayerStatus } from "@common/player";
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
    // public readonly myStatus$ = new BehaviorSubject<PlayerStatus>(PlayerStatus.Alive);
    public readonly me$: BehaviorSubject<Player>;

    private readonly _unsubscribe = new Subject<void>();

    constructor(private readonly match: MatchService, private readonly overwolf: OverwolfDataProviderService) {
        this.me$ = new BehaviorSubject<Player>(new Player({ isMe: true }));
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupMyName();
        this.setupMyStatus();
    }

    public setMe(mePlayer: Player): void {
        this.me$.next(mePlayer);
    }

    // TODO: Get player name from storage
    //#region Player Name
    private setupMyName(): void {
        const checkNameFn = (name?: string): void => {
            if (name && name !== this.me$.value.name) {
                this.me$.value.name = name;
                this.me$.next(this.me$.value);
            }
        };

        this.overwolf.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((infoUpdate) => infoUpdate.feature === "me" && !!infoUpdate.info.me?.name),
                map((infoUpdate) => infoUpdate.info.me?.name)
            )
            .subscribe((myName) => checkNameFn(myName));

        this.overwolf.newGameEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((gameEvent) => gameEvent.name === "kill_feed"),
                filter((gameEvent) => !!(gameEvent.data as OWGameEventKillFeed).local_player_name),
                map((gameEvent) => (gameEvent.data as OWGameEventKillFeed).local_player_name)
            )
            .subscribe((myName) => checkNameFn(myName));
    }
    //#endregion

    //#region Player Status
    private setupMyStatus(): void {
        const setNewStatusFn = (newStatus?: PlayerStatus): void => {
            if (newStatus && newStatus !== this.me$.value.status) {
                this.me$.value.status = newStatus;
                this.me$.next(this.me$.value);
            }
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

        this.match.currentState$.pipe(takeUntil(this._unsubscribe)).subscribe((matchStateChanged) => {
            const newStatus = triggers.triggeredFirstKey(undefined, undefined, matchStateChanged.state);
            setNewStatusFn(newStatus);
        });
    }
    //#endregion
}

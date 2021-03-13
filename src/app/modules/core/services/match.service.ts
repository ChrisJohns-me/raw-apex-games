import { Injectable, OnDestroy } from "@angular/core";
import { TriggerConditions } from "@common/game-event-triggers";
import { GameMap } from "@common/game-map";
import { GameMapList } from "@common/game-map-list";
import { GameMode, getFriendlyGameModeName, MatchState, MatchTime } from "@common/match";
import { BehaviorSubject, interval, of, Subject } from "rxjs";
import { distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { parseBoolean } from "src/utilities";
import { OverwolfDataProviderService, OWGameEvent, OWInfoUpdates2Event } from "./overwolf-data-provider";
import { PlayerLocationService } from "./player-location.service";

@Injectable({
    providedIn: "root",
    deps: [OverwolfDataProviderService, PlayerLocationService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchService", MatchService, deps),
})
export class MatchService implements OnDestroy {
    /** Active/Inactive - Distinct until changed */
    public readonly state$ = new BehaviorSubject<MatchState>(MatchState.Inactive);
    /** @summary Provides match time details; emits updates. */
    public readonly time$ = new BehaviorSubject<MatchTime>({ durationMs: 0 });
    public readonly gameMode$ = new BehaviorSubject<GameMode>({ id: "", friendlyName: "" });
    public readonly map$ = new BehaviorSubject<GameMap>(GameMapList[0]);
    public readonly victory$ = new BehaviorSubject<boolean>(false);

    private matchStartDate?: Date;
    private matchEndDate?: Date;

    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly overwolf: OverwolfDataProviderService,
        private readonly playerLocation: PlayerLocationService
    ) {
        console.debug(`[${this.constructor.name}] Instantiated`);

        this.start();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private start(): void {
        this.setupState();
        this.setupTime();
        this.setupGameMode();
        this.setupMap();
        this.setupVictory();
    }

    //#region Match State
    private setupState(): void {
        const setNewStateFn = (newState?: MatchState): void => {
            if (newState && newState !== this.state$.value) this.state$.next(newState);
        };

        const triggers = new TriggerConditions<MatchState, [OWInfoUpdates2Event?, OWGameEvent?]>({
            // Playlist was selected on the lobby screen, or a game has just ended
            [MatchState.Inactive]: (infoUpdate, gameEvent) =>
                (infoUpdate?.feature === "match_info" && !!infoUpdate?.info?.match_info?.game_mode) ||
                (infoUpdate?.feature === "match_state" && infoUpdate?.info?.game_info?.match_state === "inactive") ||
                (infoUpdate?.feature === "team" && infoUpdate.info.match_info?.team_info?.team_state === "active") ||
                gameEvent?.name === "match_end",
            // Location data is being emitted, or a game has just begun
            [MatchState.Active]: (infoUpdate, gameEvent) =>
                infoUpdate?.feature === "location" ||
                (infoUpdate?.feature === "match_state" && infoUpdate?.info?.game_info?.match_state === "active") ||
                (infoUpdate?.feature === "team" &&
                    infoUpdate.info.match_info?.team_info?.team_state === "eliminated") ||
                (infoUpdate?.feature === "team" && infoUpdate.info.match_info?.team_info?.team_state == null) ||
                gameEvent?.name === "match_start",
        });

        this.overwolf.infoUpdates$.pipe(takeUntil(this._unsubscribe)).subscribe((infoUpdate) => {
            const newState = triggers.triggeredFirstKey(infoUpdate, undefined);
            setNewStateFn(newState);
        });

        this.overwolf.newGameEvent$.pipe(takeUntil(this._unsubscribe)).subscribe((gameEvent) => {
            const newState = triggers.triggeredFirstKey(undefined, gameEvent);
            setNewStateFn(newState);
        });
    }
    //#endregion

    //#region Match Time
    private setupTime(): void {
        const updateInterval = 1000;
        this.state$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((state) => {
                    if (state === MatchState.Active) {
                        this.matchStartDate = new Date();
                        delete this.matchEndDate;
                    } else if (state === MatchState.Inactive) {
                        this.matchEndDate = new Date();
                    }
                }),
                switchMap((state) => (state === MatchState.Active ? interval(updateInterval) : of(null))),
                map(() => ({
                    start: this.matchStartDate,
                    end: this.matchEndDate,
                    durationMs: Math.max(
                        0,
                        (this.matchEndDate ?? new Date()).getTime() - (this.matchStartDate ?? new Date()).getTime()
                    ),
                }))
            )
            .subscribe((matchTime) => this.time$.next(matchTime));
    }
    //#endregion

    //#region Game Mode
    private setupGameMode(): void {
        const blacklistedGameModes = [/nametext/];

        this.overwolf.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((infoUpdate) => infoUpdate.feature === "match_info"),
                filter((infoUpdate) => !!infoUpdate.info.match_info?.game_mode),
                map((infoUpdate) => infoUpdate.info.match_info?.game_mode)
            )
            .subscribe((gameModeId) => {
                if (!gameModeId) return;
                const isBlacklisted = !!blacklistedGameModes.find((blacklist) => blacklist.test(gameModeId));
                if (isBlacklisted) return;
                if (gameModeId === this.gameMode$.value.id) return;

                const newGameMode: GameMode = {
                    id: gameModeId,
                    friendlyName: getFriendlyGameModeName(gameModeId),
                };
                this.gameMode$.next(newGameMode);
            });
    }
    //#endregion

    //#region Map
    /**
     * Less than ideal logic to deduce the map based off of dropship's starting z-position
     */
    private setupMap(): void {
        this.playerLocation.startingCoordinates$.pipe(takeUntil(this._unsubscribe)).subscribe((startingCoordinates) => {
            const gameMap = GameMapList.find((map) => map.dropshipZStart == startingCoordinates?.z);
            if (!gameMap) return;
            this.map$.next(gameMap);
        });
    }
    //#endregion

    //#region Victory
    private setupVictory(): void {
        const setVictoryFn = (newValue: boolean): void => {
            if (newValue !== this.victory$.value) this.victory$.next(newValue);
        };

        this.state$
            .pipe(
                takeUntil(this._unsubscribe),
                distinctUntilChanged(),
                tap((matchState) => (matchState === MatchState.Active ? setVictoryFn(false) : null)),
                switchMap(() => this.overwolf.infoUpdates$),
                filter((infoUpdate) => infoUpdate.feature === "rank"),
                map((infoUpdate) => infoUpdate.info.match_info),
                filter((matchInfo) => !!matchInfo && !!Object.keys(matchInfo).includes("victory")),
                map((matchInfo) => parseBoolean(matchInfo?.victory))
            )
            .subscribe((isVictory) => {
                this.victory$.next(isVictory);
            });
    }
    //#endregion
}

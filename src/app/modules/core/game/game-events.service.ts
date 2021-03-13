import { Injectable, OnDestroy } from "@angular/core";
import {
    GameEvent,
    GameInfo,
    GameProcessUpdate,
    GameStage,
    GameTime,
    MapCoordinates,
    NewGameEvents,
    SquadmatePlayer,
    TeammateMatchInfo,
} from "@common/game";
import { GameMapName, GameMaps } from "@common/game-map";
import {
    BehaviorSubject,
    combineLatest,
    from,
    interval,
    Observable,
    of,
    ReplaySubject,
    Subject,
    throwError,
} from "rxjs";
import {
    catchError,
    delay,
    filter,
    map,
    mergeMap,
    retryWhen,
    share,
    switchMap,
    tap,
    throttleTime,
} from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { findValueByPropertyRegEx, JSONTryParse } from "src/utilities";

const OW_REQUIRED_FEATURES_RETRY_COUNT = 10;
const OW_REQUIRED_FEATURES_RETRY_DELAY = 1000 * 3;
const OW_REQUIRED_FEATURES = [
    "death",
    "kill",
    "match_state",
    "me",
    "revive",
    "team",
    "roster",
    "kill_feed",
    "rank",
    "match_summary",
    "location",
    "match_info",
    "phase",
    "victory",
    "damage",
    "inventory",
];

@Injectable({
    providedIn: "root",
    useFactory: () => SingletonServiceProviderFactory("GameEventsService", GameEventsService),
})
export class GameEventsService implements OnDestroy {
    public areFeaturesRegistered = false;
    public isFeatureRegistrationInProgress = false;

    /** */
    public gameInfo$: Observable<GameInfo>;
    /** */
    public gameEvent$: Observable<GameEvent>;
    /** */
    public gameProcessUpdate$: Observable<GameProcessUpdate>;
    /** */
    public gameStage$: Observable<GameStage>;
    /** */
    public gameMode$: Observable<string>;
    /** */
    public gameMapName$: Observable<GameMapName | "">;
    /** In milliseconds */
    public gameMatchTime$: Observable<GameTime>;
    /** */
    public playerName$ = new BehaviorSubject<string>("");
    /** Relies on playerNameEvent$ */
    public playerLegend$: Observable<string>;
    /** Player's location, once landed after dropship drop */
    public playerInGameLocation$: Observable<MapCoordinates>;
    public playerSquadmates$: Observable<SquadmatePlayer[]>;

    // Overwolf base events
    private readonly _gameInfo = new Subject<GameInfo>();
    private readonly _gameEvent = new Subject<GameEvent>();
    private readonly _gameProcessUpdate = new ReplaySubject<GameProcessUpdate>(1);
    // Inferred data
    private readonly _gameStage = new BehaviorSubject<GameStage>(GameStage.Lobby);
    private readonly _gameMode = new BehaviorSubject<string>("");
    private readonly _playerLegend = new BehaviorSubject<string>("");
    private readonly _rawPlayerLocation = new Subject<MapCoordinates>();
    private readonly _playerSquadmates = new BehaviorSubject<SquadmatePlayer[]>([]);

    // Assisting variables
    private matchStartDate?: Date;
    private matchEndDate?: Date;
    private startingDropshipPlayerLocation?: MapCoordinates;
    private hasLandedFromDropship = false;

    private readonly _unsubscribe = new Subject<void>();

    public tempIdentifier = String(Math.floor(Math.random() * 10000000));
    constructor() {
        console.debug(`[${this.constructor.name}:${this.tempIdentifier}] instantiated`);

        this.registerEvents();

        this.gameProcessUpdate$ = this._gameProcessUpdate.pipe(share());
        this.gameMode$ = this._gameMode.pipe(share());
        this.gameStage$ = this._gameStage.pipe(
            tap((gameStage) => {
                console.log(`[${this.constructor.name}](Game Stage): ${gameStage}`);
                if (gameStage === GameStage.Lobby) {
                    delete this.startingDropshipPlayerLocation;
                    this.hasLandedFromDropship = false;
                    this._playerSquadmates.next([]);
                }
            }),
            share()
        );
        this.gameMatchTime$ = combineLatest(this._gameInfo, this._gameEvent).pipe(
            map(([gameInfo, gameEvent]) => {
                const started1 =
                    gameInfo?.feature === "match_state" && gameInfo.info.game_info?.match_state === "active";
                const started2 = gameEvent?.name === "match_start";
                const ended1 =
                    gameInfo?.feature === "match_state" && gameInfo.info.game_info?.match_state === "inactive";
                const ended2 = gameEvent?.name === "match_end";
                return [started1 || started2, ended1 || ended2];
            }),
            filter(([started, ended]) => started || ended),
            map(([started]) => {
                const now = new Date();
                if (started) {
                    this.matchStartDate = now;
                    delete this.matchEndDate;
                    return true;
                } else {
                    this.matchEndDate = now;
                    return false;
                }
            }),
            switchMap((isInGame) => (isInGame ? interval(1000) : of(null))),
            map(() => ({
                start: this.matchStartDate,
                end: this.matchEndDate,
                durationMs: Math.max(
                    0,
                    (this.matchEndDate ?? new Date()).getTime() - (this.matchStartDate ?? new Date()).getTime()
                ),
            })),
            share()
        );

        this.gameMapName$ = this.gameStage$.pipe(
            filter((gameStage) => gameStage === GameStage.InGameDropship),
            switchMap(() => this._rawPlayerLocation.asObservable()),
            map((playerLocation) => {
                const startingZ = this.startingDropshipPlayerLocation?.z ?? playerLocation.z;
                const now = new Date();
                const gameMap = GameMaps.find((gameMap) => {
                    const isActive = gameMap.activeDates?.some((date) => date.to == null && date.from < now);
                    const matchesDropshipZ = gameMap.dropshipStartingZ === startingZ;

                    return isActive && matchesDropshipZ;
                });

                if (!gameMap)
                    console.warn(
                        `Unable to map the dropship's starting z-position to any known maps. (z: ${startingZ})`
                    );
                return gameMap?.name ?? "";
            }),
            share()
        );

        this.playerLegend$ = this._playerLegend.pipe(share());
        this.playerInGameLocation$ = this._rawPlayerLocation.pipe(
            tap((pos) => {
                if (!this.startingDropshipPlayerLocation) {
                    console.log(`[${this.constructor.name}](Starting Dropship Position):`, pos);
                    this.startingDropshipPlayerLocation = pos;
                }
                if (this._gameStage.value === GameStage.InGame) {
                    this.hasLandedFromDropship = true;
                }
            }),
            filter(() => !!this.hasLandedFromDropship), // output locations only after player has landed
            share()
        );
        this.playerSquadmates$ = this._playerSquadmates.pipe(share());
        this.gameEvent$ = this.gameProcessUpdate$.pipe(
            // Set features to listen for, if not already set.
            throttleTime(60000), // Avoid spamming set-feature requests
            filter((processInfo) => !!processInfo?.gameInfo?.isRunning),
            switchMap(() => this.setRequiredFeatures()),
            filter((isSuccessful) => !!isSuccessful),
            switchMap(() => this._gameEvent),
            tap((gameEvent) => {
                type KillFeed = overwolf.gep.ApexLegends.ApexLegendsGameEventKillFeed;
                // Ensure Player Name is set
                if (this.playerName$.value) return;
                if (gameEvent?.name !== "kill_feed" || !gameEvent.data) return;
                const killFeed = JSONTryParse<KillFeed>(gameEvent.data as string);
                const newPlayerName = killFeed?.local_player_name;
                if (newPlayerName) this.playerName$.next(newPlayerName);
            }),
            tap((gameEvent) => {
                // Determine game stage
                const gameStage = this.classifyGameStage(this._gameStage.value, undefined, gameEvent);
                if (gameStage && gameStage !== this._gameStage.value) this._gameStage.next(gameStage);
            }),
            share()
        );
        this.gameInfo$ = this._gameInfo.pipe(
            tap((infoData) => {
                // Determine game stage
                const gameStage = this.classifyGameStage(this._gameStage.value, infoData);
                if (gameStage && gameStage !== this._gameStage.value) this._gameStage.next(gameStage);
            }),
            tap((infoData) => {
                // Extract location data
                if (infoData?.feature !== "location") return;
                const locationData = JSONTryParse<MapCoordinates>(infoData.info.match_info?.location as string);
                const x = locationData ? parseInt((locationData.x as unknown) as string) : null;
                const y = locationData ? parseInt((locationData.y as unknown) as string) : null;
                const z = locationData ? parseInt((locationData.z as unknown) as string) : null;
                if (x != null && y != null && z != null) {
                    const newPlayerLocation: MapCoordinates = { x, y, z };
                    this._rawPlayerLocation.next(newPlayerLocation);
                }
            }),
            tap((infoData) => {
                // Extract player name
                const playerName = infoData?.info.me?.name?.trim();
                if (playerName) this.playerName$.next(playerName);
            }),
            tap((infoData) => {
                const matchInfo = infoData?.info.match_info;
                const rawSquadmateUpdate = findValueByPropertyRegEx<string>(matchInfo, /^legendSelect_/);
                let squadmateUpdate: SquadmatePlayer | undefined;

                if (
                    rawSquadmateUpdate?.length &&
                    (squadmateUpdate = JSONTryParse<SquadmatePlayer>(rawSquadmateUpdate)) != null
                ) {
                    // Extract squadmate
                    const smExists = this._playerSquadmates.value.some(
                        (knownSm) => knownSm?.playerName === squadmateUpdate?.playerName
                    );
                    let newPlayerSquadmates: SquadmatePlayer[] = [...this._playerSquadmates.value];
                    if (smExists) {
                        // Replace existing squadmate
                        newPlayerSquadmates = newPlayerSquadmates.filter(
                            (knownSm) => knownSm?.playerName !== squadmateUpdate?.playerName
                        );
                        newPlayerSquadmates.push(squadmateUpdate);
                    } else {
                        // New squadmate
                        newPlayerSquadmates = newPlayerSquadmates.concat(squadmateUpdate);
                    }
                    this._playerSquadmates.next(newPlayerSquadmates);

                    // Extract legend from squadmate update
                    const activePlayerLegend = this._playerSquadmates.value.find(
                        (sm) => sm?.playerName === this.playerName$.value
                    );
                    if (activePlayerLegend?.legendName && this._playerLegend.value !== activePlayerLegend.legendName) {
                        this._playerLegend.next(activePlayerLegend.legendName);
                    }
                }
            }),
            tap((infoData) => {
                // Extract game mode
                const gameMode = infoData?.info.match_info?.game_mode;
                if (gameMode && gameMode !== this._gameMode.value && gameMode.indexOf("nametext") == -1)
                    this._gameMode.next(gameMode);
            }),
            share()
        );
    }

    public ngOnDestroy(): void {
        this.unregisterEvents();
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public __debugInjectGameInfoEvent(event: Record<string, any> | Record<string, any>[], delayMs: number): void {
        if (Array.isArray(event)) {
            event.forEach((e, index) => {
                setTimeout(() => this.onInfoUpdates(e as any), delayMs * index);
            });
        } else {
            this.onInfoUpdates(event as any);
        }
    }

    public __debugInjectGameDataEvent(event: Record<string, any> | Record<string, any>[], delayMs: number): void {
        if (Array.isArray(event)) {
            event.forEach((e, index) => {
                setTimeout(() => this.onNewEvents({ events: [e as any] }), delayMs * index);
            });
        } else {
            this.onNewEvents({ events: [event as any] });
        }
    }

    /**
     * Set required event features
     * @returns true if successful. Completes after next.
     * @todo Handle "Not in a game."
     */
    private setRequiredFeatures(): Observable<boolean> {
        console.debug(`[${this.constructor.name}:${this.tempIdentifier}] setRequiredFeatures`);

        if (this.areFeaturesRegistered) return of(true);
        if (this.isFeatureRegistrationInProgress) return of(false);
        this.isFeatureRegistrationInProgress = true;

        const promise = new Promise<string[]>((resolve, reject) => {
            overwolf.games.events.setRequiredFeatures(OW_REQUIRED_FEATURES, (result?) => {
                if (result.success) {
                    resolve(result.supportedFeatures ?? []);
                } else {
                    reject(result.error || (result as any).reason);
                }
            });
        });

        return of(null).pipe(
            mergeMap(() => from(promise)),
            retryWhen((errors) =>
                errors.pipe(
                    mergeMap((error, count) => {
                        if (
                            error !== "Provider did not set features yet." &&
                            count >= OW_REQUIRED_FEATURES_RETRY_COUNT
                        ) {
                            return throwError(error);
                        }
                        return of(error).pipe(delay(OW_REQUIRED_FEATURES_RETRY_DELAY));
                    })
                )
            ),
            map((features) => !!features?.length),
            tap((success) => (this.areFeaturesRegistered = success)),
            tap(() => (this.isFeatureRegistrationInProgress = false)),
            catchError((error) => {
                console.error(
                    `Could not set required features: ${JSON.stringify(OW_REQUIRED_FEATURES)}, ` +
                        `error: ${error?.message ?? JSON.stringify(error)}`
                );
                return of(false);
            })
        );
    }

    /**
     * Game process information updates
     * @param update
     */
    private onGameInfoUpdated(update: GameProcessUpdate): void {
        console.debug(`[${this.constructor.name}:${this.tempIdentifier}] onGameInfoUpdated`);
        if (!update?.gameInfo) return;
        this._gameProcessUpdate.next(update);
    }

    /**
     * Meta match info, inventory, weapons, inUse, etc.
     * @param infoUpdate
     */
    private onInfoUpdates(infoUpdate: GameInfo): void {
        if (!infoUpdate) {
            console.warn("Unrecognized info.", infoUpdate);
            return;
        }
        this._gameInfo.next(infoUpdate);
    }

    /**
     * Feature events: Kill feed, damage, etc.
     * @param newGameEvent
     */
    private onNewEvents(newGameEvent: NewGameEvents): void {
        const events = newGameEvent?.events;
        if (!events || !Array.isArray(events)) {
            console.warn("Unrecognized event.", events);
            return;
        }
        newGameEvent?.events.forEach((e) => this._gameEvent.next(e));
    }

    private classifyGameStage(
        currentStage: GameStage,
        infoEvent?: GameInfo,
        gameEvent?: GameEvent
    ): GameStage | undefined {
        // Lobby
        if (
            (infoEvent?.feature === "match_info" && infoEvent?.info?.match_info?.game_mode) ||
            (infoEvent?.feature === "match_state" && infoEvent?.info?.game_info?.match_state === "inactive") ||
            gameEvent?.name === "match_end"
        ) {
            console.debug(`${[this.constructor.name]}(Game Stage): Lobby`);
            // Playlist was selected on the lobby screen, or a game has just ended
            return GameStage.Lobby;
        }

        // Legend Selection
        if (infoEvent?.feature === "team" && findValueByPropertyRegEx(infoEvent?.info?.match_info, /^legendSelect/)) {
            console.debug(`${[this.constructor.name]}(Game Stage): Legend Selection`);
            // A legend has been selected on the character selection screen
            return GameStage.LegendSelection;
        }

        // In Game Dropship
        if (
            gameEvent?.name === "match_start" ||
            (infoEvent?.feature === "match_state" && infoEvent?.info?.game_info?.match_state === "active")
        ) {
            console.debug(`${[this.constructor.name]}(Game Stage): In Game Dropship`);
            // Match has started
            return GameStage.InGameDropship;
        }

        // In Game Dropping
        if (
            currentStage === GameStage.InGameDropship &&
            infoEvent?.feature === "location" &&
            this.startingDropshipPlayerLocation &&
            infoEvent?.info?.match_info?.location
        ) {
            const locationData = JSONTryParse<MapCoordinates>(infoEvent?.info.match_info?.location as string);
            const locationZ = locationData ? parseInt((locationData.z as unknown) as string) : null;
            if (locationZ != null && locationZ < this.startingDropshipPlayerLocation.z) {
                console.debug(`${[this.constructor.name]}(Game Stage): In Game Dropping`);
                // Player has started dropping
                return GameStage.InGameDropping;
            }
        }

        // In Game
        if (
            currentStage === GameStage.InGameDropping &&
            infoEvent?.feature === "inventory" &&
            infoEvent?.info?.me?.inUse
        ) {
            console.debug(`${[this.constructor.name]}(Game Stage): In Game`);
            // Player has landed
            return GameStage.InGame;
        }

        // In Game Knocked, In Game Spectating
        if (
            (currentStage === GameStage.InGame ||
                currentStage === GameStage.InGameKnocked ||
                currentStage === GameStage.InGameSpectating) &&
            infoEvent?.feature === "team"
        ) {
            // Handle active player's status
            const activePlayerName = this.playerName$.value;
            const rawTeammateUpdate = findValueByPropertyRegEx<string>(infoEvent?.info?.match_info, /^teammate_/);
            let teammateUpdate: TeammateMatchInfo | undefined;

            if (
                rawTeammateUpdate &&
                (teammateUpdate = JSONTryParse<TeammateMatchInfo>(rawTeammateUpdate)) != null &&
                teammateUpdate.name === activePlayerName
            ) {
                if (teammateUpdate.state === "alive") {
                    console.debug(`${[this.constructor.name]}(Game Stage): In Game 2`);
                    // Active player has been revived
                    return GameStage.InGame;
                } else if (teammateUpdate.state === "knockedout") {
                    console.debug(`${[this.constructor.name]}(Game Stage): In Game Knocked`);
                    return GameStage.InGameKnocked;
                } else if (teammateUpdate.state === "dead") {
                    console.debug(`${[this.constructor.name]}(Game Stage): In Game Dead`);
                    return GameStage.InGameSpectating;
                }
            }
        }

        return;
    }

    private registerEvents(): void {
        overwolf.games.onGameInfoUpdated.addListener((event) => this.onGameInfoUpdated(event));
        overwolf.games.events.onInfoUpdates2.addListener((event) => this.onInfoUpdates(event));
        overwolf.games.events.onNewEvents.addListener((event) => this.onNewEvents(event as any));
    }

    private unregisterEvents(): void {
        overwolf.games.onGameInfoUpdated.removeListener((event) => this.onGameInfoUpdated(event));
        overwolf.games.events.onInfoUpdates2.removeListener((event) => this.onInfoUpdates(event));
        overwolf.games.events.onNewEvents.removeListener((event) => this.onNewEvents(event as any));
    }
}

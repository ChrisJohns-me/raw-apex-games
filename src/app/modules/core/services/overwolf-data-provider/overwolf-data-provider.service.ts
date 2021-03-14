import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, from, interval, Observable, of, Subject, throwError } from "rxjs";
import { catchError, delay, filter, map, mergeMap, retryWhen, switchMap, tap, throttleTime } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { InfoUpdatesHandler } from "./overwolf/games/events/info-updates-handler";
import { NewGameEventHandler } from "./overwolf/games/events/new-game-event-handler";
import { GameInfoUpdatedHandler } from "./overwolf/games/game-info-updated-handler";

// TODO: Handle minimizing, onfocus, launch, gameInfoUpdated events, isRunning checks

// Example:
// this.game.isRunning = GameService.isGameRunning(e, this.game.id);
// this.game.isInFocus = GameService.isGameInFocus(e, this.game.id);
// if (e.runningChanged || e.gameChanged) {
//   if (this.game.isRunning) {
//     eventService.register({
//       onNewEvent: this.onNewEvent,
//       onInfoUpdate: this.onInfoUpdate,
//     })
//   } else {
//     eventService.unregister();
//     this.game.isOtherGameRunning = GameService.isGameRunning(e);

//     if (!this.game.isOtherGameRunning) {
//       await h["a"].close(k.TOOLTIP),
//       await h["a"].close(k.PREGAME),
//       await h["a"].close(k.POSTGAME),
//       await h["a"].close(k.INGAME),
//       await h["a"].close(k.SECOND_SCREEN),
//       await h["a"].close(k.ROSTER),
//       await h["a"].close(k.EVENTS)
//     }
//   }
// }

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

/**
 * @class OverwolfDataProviderService
 * @classdesc Data directly from the Overwolf API.
 *            Data JSON parsed, but same structure to what Overwolf API provides.
 */
@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("OverwolfDataProviderService", OverwolfDataProviderService, deps),
})
export class OverwolfDataProviderService implements OnDestroy {
    public areFeaturesRegistered = false;
    public isFeatureRegistrationInProgress = false;

    //#region Handlers
    private readonly gameInfoUpdatedHandler = new GameInfoUpdatedHandler();
    private readonly infoUpdatesHandler = new InfoUpdatesHandler();
    private readonly newGameEventHandler = new NewGameEventHandler();
    public readonly gameInfoUpdated$ = this.gameInfoUpdatedHandler.gameInfoUpdated;
    public readonly infoUpdates$ = this.infoUpdatesHandler.infoUpdates;
    public readonly newGameEvent$ = this.newGameEventHandler.newGameEvent;
    //#endregion

    private readonly isRunning$ = new BehaviorSubject<boolean>(false);
    private readonly isInFocus$ = new BehaviorSubject<boolean>(false);

    private readonly _unsubscribe = new Subject<void>();

    constructor() {
        console.debug(`[${this.constructor.name}] Instantiated`);

        this.setupIsRunning();
        this.setupIsInFocus();

        this.registerGameHooks();
        this.unregisterEvents();
        this.registerEvents();
    }

    public ngOnDestroy(): void {
        this.unregisterEvents();

        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    //#region Overwolf callback listeners
    private registerEvents(): void {
        overwolf.games.onGameInfoUpdated.addListener((event) => this.gameInfoUpdatedHandler.onGameInfoUpdated(event));
        overwolf.games.events.onInfoUpdates2.addListener((event) => this.infoUpdatesHandler.onInfoUpdates(event));
        overwolf.games.events.onNewEvents.addListener((event) => this.newGameEventHandler.onNewGameEvents(event));
    }

    private unregisterEvents(): void {
        overwolf.games.onGameInfoUpdated.removeListener((event) =>
            this.gameInfoUpdatedHandler.onGameInfoUpdated(event)
        );
        overwolf.games.events.onInfoUpdates2.removeListener((event) => this.infoUpdatesHandler.onInfoUpdates(event));
        overwolf.games.events.onNewEvents.removeListener((event) => this.newGameEventHandler.onNewGameEvents(event));
    }
    //#endregion

    //#region Set features
    private registerGameHooks(): void {
        ;; LEFT OFF HERE ;;
        // TODO: Make this method a sort of "HUB" for listening (and error correcting) onto the Game Process.
        interval(10000).pipe(
            // Set features to listen for, if not already set.
            throttleTime(60000), // Avoid spamming set-feature requests
            filter((processInfo) => !!processInfo?.gameInfo?.isRunning),
            switchMap(() => this.setRequiredFeatures()),
            filter((isSuccessful) => !!isSuccessful)
        );
    }

    /**
     * Set required event features
     * @returns true if successful. Completes after next.
     * @todo Handle "Not in a game."
     */
    private setRequiredFeatures(): Observable<boolean> {
        console.debug(`[${this.constructor.name}] setRequiredFeatures`);

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
    //#endregion

    //#region Game Monitors
    private setupIsRunning(): void {
        overwolf.games.onGameInfoUpdated.addListener((event) => this.gameInfoUpdatedHandler.onGameInfoUpdated(event));

    }

    private setupIsInFocus(): void {

    }
    //#endregion
}

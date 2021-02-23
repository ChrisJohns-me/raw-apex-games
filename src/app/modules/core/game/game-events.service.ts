import { Injectable, OnDestroy } from "@angular/core";
import { from, Observable, of, ReplaySubject, Subject, throwError } from "rxjs";
import {
    catchError,
    delay,
    map,
    mergeMap,
    retryWhen,
    takeUntil,
} from "rxjs/operators";

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

export type GameProcessInfoEvent = overwolf.games.GameInfoUpdatedEvent;
export type GameDataInfo = overwolf.games.events.InfoUpdates2Event;
export type GameDataFeature = overwolf.games.events.GameEvent;

@Injectable({
    providedIn: "root",
})
export class GameEventsService implements OnDestroy {
    public gameProcessInfoEvent$: Observable<GameProcessInfoEvent>;
    public gameDataInfoEvent$: Observable<GameDataInfo>;
    public gameDataFeatureEvent$: Observable<GameDataFeature>;

    private readonly _gameProcessInfo = new ReplaySubject<GameProcessInfoEvent>(
        1
    );
    private readonly _gameDataInfo = new Subject<GameDataInfo>();
    private readonly _gameDataFeature = new Subject<GameDataFeature>();
    private readonly _unsubscribe = new Subject<void>();

    constructor() {
        console.debug(`[${this.constructor.name}] instantiated`);

        this.gameProcessInfoEvent$ = this._gameProcessInfo;
        this.gameDataInfoEvent$ = this._gameDataInfo;
        this.gameDataFeatureEvent$ = this._gameDataFeature;

        this.setRequiredFeatures()
            .pipe(takeUntil(this._unsubscribe))
            .subscribe(() => this.registerEvents());
    }

    public ngOnDestroy(): void {
        this.unregisterEvents();
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    /**
     * Set required event features
     * @returns true if successful
     * @todo Handle {error:"Not in a game."}
     */
    private setRequiredFeatures(): Observable<boolean> {
        console.debug(`[${this.constructor.name}] setRequiredFeatures`);

        const promise = new Promise<string[]>((resolve, reject) => {
            overwolf.games.events.setRequiredFeatures(
                OW_REQUIRED_FEATURES,
                (result?) => {
                    if (result.success) {
                        resolve(result.supportedFeatures ?? []);
                    } else {
                        reject(result.error || (result as any).reason);
                    }
                }
            );
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
                        return of(error).pipe(
                            delay(OW_REQUIRED_FEATURES_RETRY_DELAY)
                        );
                    })
                )
            ),
            map((features) => !!features?.length),
            catchError((error) => {
                console.error(
                    `Could not set required features: ${JSON.stringify(
                        OW_REQUIRED_FEATURES
                    )}, ` + `error: ${error?.message ?? JSON.stringify(error)}`
                );
                return of(false);
            })
        );
    }

    /**
     * Game process information updates
     * @param update
     */
    private onGameInfoUpdated(
        update: overwolf.games.GameInfoUpdatedEvent
    ): void {
        console.debug(`[${this.constructor.name}] onGameInfoUpdated`);
        if (!update?.gameInfo) return;
        this._gameProcessInfo.next(update);
    }

    /**
     * Meta match info, inventory, weapons, inUse, etc.
     * @param event
     */
    private onInfoUpdates(
        event: overwolf.games.events.InfoUpdates2Event
    ): void {
        console.debug(`[${this.constructor.name}] onInfoUpdates`);
        this._gameDataInfo.next(event);
    }

    /**
     * Feature events: Kill feed, damage, etc.
     * @param event
     */
    private onNewEvents(event: overwolf.games.events.NewGameEvents): void {
        console.debug(`[${this.constructor.name}] onNewEvents`);
        type OWGameEvent = overwolf.games.events.GameEvent;
        const eventsList: OWGameEvent[] = event.events;
        eventsList.forEach((event) => this._gameDataFeature.next(event));
    }

    private registerEvents(): void {
        console.debug(`[${this.constructor.name}] registerEvents`);
        overwolf.games.onGameInfoUpdated.addListener((event) =>
            this.onGameInfoUpdated(event)
        );
        overwolf.games.events.onInfoUpdates2.addListener((event) =>
            this.onInfoUpdates(event)
        );
        overwolf.games.events.onNewEvents.addListener((event) =>
            this.onNewEvents(event)
        );
    }

    private unregisterEvents(): void {
        console.debug(`[${this.constructor.name}] unregisterEvents`);
        overwolf.games.onGameInfoUpdated.removeListener((event) =>
            this.onGameInfoUpdated(event)
        );
        overwolf.games.events.onInfoUpdates2.removeListener((event) =>
            this.onInfoUpdates(event)
        );
        overwolf.games.events.onNewEvents.removeListener((event) =>
            this.onNewEvents(event)
        );
    }
}

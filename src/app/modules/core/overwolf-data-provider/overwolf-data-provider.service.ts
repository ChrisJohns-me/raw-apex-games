import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, from, Observable, of, ReplaySubject, Subject, throwError } from "rxjs";
import { catchError, delay, filter, map, mergeMap, retryWhen, switchMap, takeUntil, tap } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { OverwolfEventHookHandler } from "./overwolf-hook-handler";
import { OWGameEvent, OWGameInfoUpdatedEvent, OWInfoUpdates2Event, OWRunningGameInfo } from "./overwolf-types";
import { InfoUpdatesDelegate } from "./overwolf/games/events/info-updates-delegate";
import { NewGameEventDelegate } from "./overwolf/games/events/new-game-event-delegate";
import { GameInfoUpdatedDelegate } from "./overwolf/games/game-info-updated-delegate";
import { OWCONFIG } from "./overwolf/overwolf-config";

/**
 * @class OverwolfDataProviderService
 * @classdesc Data directly from the Overwolf API.
 *            Data JSON parsed, but same structure to what Overwolf API provides.
 * @todo When `isFocused` == true, should the Delegate Event Hooks be re-registered?
 * @todo Automatic or interval health-checks?
 */
@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("OverwolfDataProviderService", OverwolfDataProviderService, deps),
})
export class OverwolfDataProviderService implements OnDestroy {
    //#region Outputs
    public get gameInfoUpdated$(): ReplaySubject<OWGameInfoUpdatedEvent> {
        return this.gameInfoUpdatedDelegate.gameInfoUpdated;
    }
    public get infoUpdates$(): Subject<OWInfoUpdates2Event> {
        return this.infoUpdatesDelegate.infoUpdates;
    }
    public get newGameEvent$(): Subject<OWGameEvent> {
        return this.newGameEventDelegate.newGameEvent;
    }
    //#endregion

    //#region Delegates
    private readonly gameInfoUpdatedDelegate = new GameInfoUpdatedDelegate();
    private readonly infoUpdatesDelegate = new InfoUpdatesDelegate();
    private readonly newGameEventDelegate = new NewGameEventDelegate();
    //#endregion

    private areFeaturesRegistered = false;
    private isFeatureRegistrationInProgress = false;

    private readonly gameIsRunning$ = new BehaviorSubject<boolean>(false);
    private readonly gameIsInFocus$ = new BehaviorSubject<boolean>(false);

    private readonly delegateEventHooks: { [key: string]: OverwolfEventHookHandler } = {
        GAMEINFOUPDATED: new OverwolfEventHookHandler(
            overwolf.games.onGameInfoUpdated.addListener,
            overwolf.games.onGameInfoUpdated.removeListener,
            this.gameInfoUpdatedDelegate.onGameInfoUpdated
        ),
        INFOUPDATES2: new OverwolfEventHookHandler(
            overwolf.games.events.onInfoUpdates2.addListener,
            overwolf.games.events.onInfoUpdates2.removeListener,
            this.infoUpdatesDelegate.onInfoUpdates2
        ),
        NEWGAMEEVENT: new OverwolfEventHookHandler(
            overwolf.games.events.onNewEvents.addListener,
            overwolf.games.events.onNewEvents.removeListener,
            this.newGameEventDelegate.onNewGameEvents
        ),
    };

    private readonly gameStatusEventHooks: { [key: string]: OverwolfEventHookHandler } = {
        RUNNINGGAMEINFO: new OverwolfEventHookHandler(
            overwolf.games.getRunningGameInfo,
            undefined,
            this.onGameStatusGameInfoUpdated
        ),
        GAMEINFOUPDATED: new OverwolfEventHookHandler(
            overwolf.games.onGameInfoUpdated.addListener,
            overwolf.games.onGameInfoUpdated.removeListener,
            (updateEvent) => this.onGameStatusGameInfoUpdated(updateEvent.gameInfo)
        ),
        GAMELAUNCHED: new OverwolfEventHookHandler(
            overwolf.games.onGameLaunched.addListener,
            overwolf.games.onGameLaunched.removeListener,
            this.onGameStatusGameInfoUpdated
        ),
    };

    private readonly _unsubscribe = new Subject<void>();

    constructor() {
        console.debug(`[${this.constructor.name}] Instantiated`);
    }

    public ngOnDestroy(): void {
        this.unregisterDelegateEventHooks();
        this.unregisterGameStatusEventHooks();
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.registerGameStatusEventHooks();
        const gameIsNotRunningFn = () => {
            this.unregisterDelegateEventHooks();
            this.areFeaturesRegistered = false;
            this.isFeatureRegistrationInProgress = false;
        };

        this.gameIsRunning$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((gameIsRunning) =>
                    console.debug(
                        `[${this.constructor.name}] Game Status "${gameIsRunning ? "Is Running" : "Is Not Running"}"`
                    )
                ),
                tap((gameIsRunning) => {
                    if (!gameIsRunning) gameIsNotRunningFn();
                }),
                filter((gameIsRunning) => !!gameIsRunning),
                switchMap(() => this.registerRequiredFeatures())
            )
            .subscribe((areFeaturesRegistered) => {
                if (areFeaturesRegistered) {
                    console.debug(`[${this.constructor.name}] Overwolf Data Provider Service is ready.`);
                    this.registerDelegateEventHooks();
                } else {
                    console.warn(`[${this.constructor.name}] Overwolf Data Provider Service is not running.`);
                    this.unregisterDelegateEventHooks();
                }
            });
    }

    //#region Game status hooks
    private registerGameStatusEventHooks(): void {
        Object.values(this.gameStatusEventHooks).forEach((hook) => hook.activate());
    }

    private unregisterGameStatusEventHooks(): void {
        Object.values(this.gameStatusEventHooks).forEach((hook) => hook.deactivate());
    }

    private onGameStatusGameInfoUpdated(runningGameInfo?: OWRunningGameInfo): void {
        if (!runningGameInfo || runningGameInfo.classId !== OWCONFIG.APEXLEGENDSCLASSID) return;
        this.gameIsRunning$.next(runningGameInfo.isRunning);
        this.gameIsInFocus$.next(runningGameInfo.isInFocus);
    }
    //#endregion

    //#region Delegate event hooks
    private registerDelegateEventHooks(): void {
        Object.values(this.delegateEventHooks).forEach((hook) => hook.activate());
    }

    private unregisterDelegateEventHooks(): void {
        Object.values(this.delegateEventHooks).forEach((hook) => hook.deactivate());
    }
    //#endregion

    /**
     * Register required event features
     * @returns true and Completes the observable stream if successful.
     * @todo Handle "Not in a game." error
     */
    private registerRequiredFeatures(): Observable<boolean> {
        console.debug(`[${this.constructor.name}] Requesting Overwolf features:`, OWCONFIG.REQUIRED_FEATURES);

        if (this.areFeaturesRegistered) return of(true);
        if (this.isFeatureRegistrationInProgress) return of(false);
        this.isFeatureRegistrationInProgress = true;

        const promise = new Promise<string[]>((resolve, reject) => {
            overwolf.games.events.setRequiredFeatures(OWCONFIG.REQUIRED_FEATURES, (result?) => {
                if (result.success) resolve(result.supportedFeatures ?? []);
                else reject(result.error || (result as any).reason);
            });
        });

        return of(null).pipe(
            mergeMap(() => from(promise)),
            retryWhen((errors) =>
                errors.pipe(
                    mergeMap((error, count) => {
                        if (
                            error !== "Provider did not set features yet." &&
                            count >= OWCONFIG.REQUIRED_FEATURES_RETRY_COUNT
                        ) {
                            return throwError(error);
                        }
                        return of(error).pipe(delay(OWCONFIG.REQUIRED_FEATURES_RETRY_DELAY));
                    })
                )
            ),
            map((features) => !!features?.length),
            tap((success) => (this.areFeaturesRegistered = success)),
            tap(() => (this.isFeatureRegistrationInProgress = false)),
            catchError((error) => {
                console.error(
                    `Could not set required features: ${JSON.stringify(OWCONFIG.REQUIRED_FEATURES)}, ` +
                        `error: ${error?.message ?? JSON.stringify(error)}`
                );
                return of(false);
            })
        );
    }
}

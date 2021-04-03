import { Injectable, OnDestroy } from "@angular/core";
import { SingletonServiceProviderFactory } from "@app/singleton-service.provider.factory";
import { BehaviorSubject, defer, from, interval, merge, Observable, of, Subject, throwError } from "rxjs";
import {
    catchError,
    delay,
    distinctUntilChanged,
    filter,
    map,
    mergeMap,
    retryWhen,
    share,
    switchMap,
    takeUntil,
    tap,
} from "rxjs/operators";
import { OverwolfEventHookHandler } from "./overwolf-hook-handler";
import { OWGameEvent, OWInfoUpdates2Event, OWRunningGameInfo } from "./overwolf-types";
import { InfoUpdatesDelegate } from "./overwolf/games/events/info-updates-delegate";
import { NewGameEventDelegate } from "./overwolf/games/events/new-game-event-delegate";
import { GameInfoDelegate } from "./overwolf/games/game-info-delegate";
import { OWCONFIG } from "./overwolf/overwolf-config";

/**
 * @classdesc Data directly from the Overwolf API.
 *            Data JSON parsed, but same structure to what Overwolf API provides.
 */
@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("OverwolfDataProviderService", OverwolfDataProviderService, deps),
})
export class OverwolfDataProviderService implements OnDestroy {
    //#region Delegate Outputs
    public get gameInfo$(): BehaviorSubject<Optional<OWRunningGameInfo>> {
        return this.gameInfoDelegate.gameInfo$;
    }
    public get infoUpdates$(): Subject<OWInfoUpdates2Event> {
        return this.infoUpdatesDelegate.infoUpdates$;
    }
    public get newGameEvent$(): Subject<OWGameEvent> {
        return this.newGameEventDelegate.newGameEvent$;
    }

    private readonly gameInfoDelegate = new GameInfoDelegate();
    private readonly infoUpdatesDelegate = new InfoUpdatesDelegate();
    private readonly newGameEventDelegate = new NewGameEventDelegate();
    private readonly delegateEventHooks: { [key: string]: OverwolfEventHookHandler } = {
        RUNNINGGAMEINFO: new OverwolfEventHookHandler(overwolf.games.getRunningGameInfo, undefined, (e) =>
            this.gameInfoDelegate.onGameInfo(e)
        ),
        GAMEINFOUPDATED: new OverwolfEventHookHandler(
            overwolf.games.onGameInfoUpdated.addListener,
            overwolf.games.onGameInfoUpdated.removeListener,
            (e) => this.gameInfoDelegate.onGameInfo(e?.gameInfo)
        ),
        INFOUPDATES2: new OverwolfEventHookHandler(
            overwolf.games.events.onInfoUpdates2.addListener,
            overwolf.games.events.onInfoUpdates2.removeListener,
            (e) => this.infoUpdatesDelegate.onInfoUpdates2(e)
        ),
        NEWGAMEEVENT: new OverwolfEventHookHandler(
            overwolf.games.events.onNewEvents.addListener,
            overwolf.games.events.onNewEvents.removeListener,
            (e) => this.newGameEventDelegate.onNewGameEvents(e)
        ),
    };
    //#endregion

    //#region Game Monitor
    private areFeaturesRegistered = false;
    private isFeatureRegistrationInProgress = false;
    private readonly gameMonitorGameInfoDelegate = new GameInfoDelegate();
    private readonly gameMonitorEventHooks: { [key: string]: OverwolfEventHookHandler } = {
        RUNNINGGAMEINFO: new OverwolfEventHookHandler(overwolf.games.getRunningGameInfo, undefined, (e) =>
            this.gameMonitorGameInfoDelegate.onGameInfo(e)
        ),
        GAMEINFOUPDATED: new OverwolfEventHookHandler(
            overwolf.games.onGameInfoUpdated.addListener,
            overwolf.games.onGameInfoUpdated.removeListener,
            (e) => this.gameMonitorGameInfoDelegate.onGameInfo(e?.gameInfo)
        ),
        GAMELAUNCHED: new OverwolfEventHookHandler(
            overwolf.games.onGameLaunched.addListener,
            overwolf.games.onGameLaunched.removeListener,
            (e) => this.gameMonitorGameInfoDelegate.onGameInfo(e)
        ),
    };
    //#endregion

    private isRunning$ = new BehaviorSubject<boolean>(false);
    private readonly _unsubscribe$ = new Subject<void>();

    constructor() {
        this.gameMonitorGameInfoDelegate.gameInfo$
            .pipe(
                takeUntil(this._unsubscribe$),
                map((gameInfo) => gameInfo?.isRunning ?? false),
                distinctUntilChanged(),
                share()
            )
            .subscribe((isRunning) => this.isRunning$.next(isRunning));
    }

    public ngOnDestroy(): void {
        this.unregisterDelegateEventHooks();
        this.unregisterGameMonitorEventHooks();
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public start(): void {
        this.registerGameMonitorEventHooks();
        this.setupRunningCheck();
        this.setupNotRunningCheck();
    }

    private setupRunningCheck(): void {
        const isRunningHealthcheck$ = interval(OWCONFIG.HEALTHCHECK_TIME).pipe(
            tap(() =>
                console.debug(
                    `[${this.constructor.name}] (Is Running HealthCheck)\n` +
                        `Game Running: ${this.isRunning$.value}\n` +
                        `Features Registered: ${this.areFeaturesRegistered}` +
                        `${this.isFeatureRegistrationInProgress ? " (In Progress)" : ""}`
                )
            )
        );

        merge(isRunningHealthcheck$, this.isRunning$)
            .pipe(
                filter((isRunning) => !!isRunning),
                switchMap(() => this.registerRequiredFeatures())
            )
            .subscribe((areFeaturesRegistered) => {
                if (!areFeaturesRegistered) {
                    this.notRunning();
                    return;
                }
                this.registerDelegateEventHooks();
                console.debug(`[${this.constructor.name}] Overwolf Data Provider Service is ready.`);
            });
    }

    private setupNotRunningCheck(): void {
        this.isRunning$.pipe(filter((isRunning) => !isRunning)).subscribe(() => this.notRunning());
    }

    //#region Game Monitor hooks
    private registerGameMonitorEventHooks(): void {
        Object.values(this.gameMonitorEventHooks).forEach((hook) => hook.activate());
    }

    private unregisterGameMonitorEventHooks(): void {
        Object.values(this.gameMonitorEventHooks).forEach((hook) => hook.deactivate());
    }
    //#endregion

    //#region Delegate event hooks
    private registerDelegateEventHooks(): void {
        Object.values(this.delegateEventHooks).forEach((hook) => hook.activate());
        console.debug(`[${this.constructor.name}] Game Delegate Hooks Registered`);
    }

    private unregisterDelegateEventHooks(): void {
        Object.values(this.delegateEventHooks).forEach((hook) => hook.deactivate());
        console.debug(`[${this.constructor.name}] Game Delegate Hooks UnRegistered`);
    }
    //#endregion

    /**
     * Register required event features
     * @returns true and Completes the observable stream if successful.
     */
    private registerRequiredFeatures(): Observable<boolean> {
        if (this.areFeaturesRegistered) return of(true);
        if (this.isFeatureRegistrationInProgress) return of(false);
        this.isFeatureRegistrationInProgress = true;
        console.debug(`[${this.constructor.name}] Registering Overwolf features:`, OWCONFIG.REQUIRED_FEATURES);

        const createPromise = () => {
            return new Promise<string[]>((resolve, reject) => {
                overwolf.games.events.setRequiredFeatures(OWCONFIG.REQUIRED_FEATURES, (result?) => {
                    if (result.success) resolve(result.supportedFeatures ?? []);
                    else reject(result.error || (result as any).reason);
                });
            });
        };

        return defer(() => from(createPromise())).pipe(
            retryWhen((errors) =>
                errors.pipe(
                    mergeMap((error, i) => {
                        const retryAttempt = i + 1;
                        if (retryAttempt >= OWCONFIG.REQUIRED_FEATURES_RETRY_COUNT) {
                            return throwError(error);
                        }
                        console.warn(
                            `[${this.constructor.name}] Registration for Overwolf features failed. Retrying...(#${retryAttempt})\n` +
                                `Error: ${error?.message ?? JSON.stringify(error)}`
                        );
                        const delayMs = retryAttempt * OWCONFIG.REQUIRED_FEATURES_RETRY_DELAY_MULTIPLIER;
                        return of(error).pipe(delay(delayMs));
                    })
                )
            ),
            map((features) => !!features?.length),
            tap((success) => (this.areFeaturesRegistered = success)),
            tap(() => (this.isFeatureRegistrationInProgress = false)),
            catchError((error) => {
                console.error(
                    `[${this.constructor.name}] Could not set Overwolf features: ${JSON.stringify(OWCONFIG.REQUIRED_FEATURES)}, ` +
                        `error: ${error?.message ?? JSON.stringify(error)}`
                );
                return of(false);
            })
        );
    }

    private notRunning() {
        this.unregisterDelegateEventHooks();
        console.warn(`[${this.constructor.name}] Overwolf Data Provider Service is not running.`);
    }
}

import { Inject, Injectable, OnDestroy } from "@angular/core";
import { SingletonServiceProviderFactory } from "@app/singleton-service.provider.factory";
import { BehaviorSubject, interval, merge, Subject } from "rxjs";
import { distinctUntilChanged, filter, map, share, switchMap, takeUntil, tap } from "rxjs/operators";
import { OverwolfFeatureRegistrationService, OWFeatureRegistrationStatus } from "./overwolf-feature-registration.service";
import { OverwolfEventHookHandler } from "./overwolf-hook-handler";
import { OWGameEvent, OWInfoUpdates2Event, OWRunningGameInfo } from "./overwolf-types";
import { InfoUpdatesDelegate } from "./overwolf/games/events/info-updates-delegate";
import { NewGameEventDelegate } from "./overwolf/games/events/new-game-event-delegate";
import { GameInfoDelegate } from "./overwolf/games/game-info-delegate";
import { OWConfig, OW_CONFIG } from "./overwolf/overwolf-config";

/**
 * @classdesc Data directly from the Overwolf API.
 *            Data JSON parsed, but same structure to what Overwolf API provides.
 */
@Injectable({
    providedIn: "root",
    deps: [OW_CONFIG, OverwolfFeatureRegistrationService],
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

    private readonly gameInfoDelegate = new GameInfoDelegate(this.config.APEXLEGENDSCLASSID);
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
    private readonly gameMonitorGameInfoDelegate = new GameInfoDelegate(this.config.APEXLEGENDSCLASSID);
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

    constructor(
        @Inject(OW_CONFIG) private readonly config: OWConfig,
        private readonly featureRegistration: OverwolfFeatureRegistrationService
    ) {
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
        const isRunningHealthcheck$ = interval(this.config.HEALTHCHECK_TIME).pipe(
            tap(() =>
                console.debug(
                    `[${this.constructor.name}] (Is Running HealthCheck)\n` +
                        `Game Running: ${this.isRunning$.value}\n` +
                        `Features: ${this.featureRegistration.registrationStatus$.value}`
                )
            )
        );
        merge(isRunningHealthcheck$, this.isRunning$)
            .pipe(
                filter(() => this.isRunning$.value),
                switchMap(() => this.featureRegistration.registerFeatures())
            )
            .subscribe(() => {
                if (this.featureRegistration.registrationStatus$.value !== OWFeatureRegistrationStatus.SUCCESS) {
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

    private notRunning() {
        this.unregisterDelegateEventHooks();
        this.featureRegistration.unregisterFeatures();
        console.warn(`[${this.constructor.name}] Overwolf Data Provider Service is not running.`);
    }
}

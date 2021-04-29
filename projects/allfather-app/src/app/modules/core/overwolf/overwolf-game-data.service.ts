import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, interval, merge, Subject } from "rxjs";
import { distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { AllfatherService } from "../allfather-service.abstract";
import { InfoUpdatesDelegate } from "./api/games/events/info-updates-delegate";
import { NewGameEventDelegate } from "./api/games/events/new-game-event-delegate";
import { GameInfoDelegate } from "./api/games/game-info-delegate";
import { OWConfig, OW_CONFIG } from "./overwolf-config";
import { OverwolfFeatureRegistrationService, OWFeatureRegistrationStatus } from "./overwolf-feature-registration.service";
import { OWGameEvent, OWInfoUpdates2Event, OWRunningGameInfo } from "./types/overwolf-types";

/**
 * @classdesc Game data information directly from the Overwolf API.
 */
@Injectable({
    providedIn: "root",
    deps: [OW_CONFIG, OverwolfFeatureRegistrationService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("OverwolfGameDataService", OverwolfGameDataService, deps),
})
export class OverwolfGameDataService extends AllfatherService {
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
    //#endregion

    //#region Game Monitor
    private readonly gameMonitorGameInfoDelegate = new GameInfoDelegate(this.config.APEXLEGENDSCLASSID);
    //#endregion

    private isRunning$ = new BehaviorSubject<boolean>(false);
    private delegateEventListenersStarted = false;

    constructor(
        @Inject(OW_CONFIG) private readonly config: OWConfig,
        private readonly featureRegistration: OverwolfFeatureRegistrationService
    ) {
        super();
        this.gameMonitorGameInfoDelegate.gameInfo$
            .pipe(
                takeUntil(this.isDestroyed$),
                map((gameInfo) => gameInfo?.isRunning ?? false),
                distinctUntilChanged()
            )
            .subscribe((isRunning) => this.isRunning$.next(isRunning));
    }

    public ngOnDestroy(): void {
        this.stopDelegateEventListeners();
        this.gameMonitorGameInfoDelegate.stopEventListeners();
        super.ngOnDestroy();
    }

    public init(): void {
        this.gameMonitorGameInfoDelegate.startEventListeners();
        this.setupRunningCheck();
        this.setupNotRunningCheck();
    }

    private setupRunningCheck(): void {
        const isRunningHealthcheck$ = interval(this.config.HEALTHCHECK_TIME).pipe(
            tap(() =>
                console.debug(
                    `[${this.constructor.name}] (Running HealthCheck), ` +
                        `Game Running: "${this.isRunning$.value}", ` +
                        `Features: "${this.featureRegistration.registrationStatus$.value}"`
                )
            )
        );
        merge(isRunningHealthcheck$, this.isRunning$)
            .pipe(
                takeUntil(this.isDestroyed$),
                filter(() => this.isRunning$.value),
                switchMap(() => this.featureRegistration.registerFeatures())
            )
            .subscribe(() => {
                if (this.featureRegistration.registrationStatus$.value !== OWFeatureRegistrationStatus.SUCCESS) {
                    this.notRunning();
                    return;
                }
                if (!this.delegateEventListenersStarted) {
                    this.startDelegateEventListeners();
                    console.debug(`[${this.constructor.name}] Overwolf Data Provider Service is ready.`);
                }
            });
    }

    private setupNotRunningCheck(): void {
        this.isRunning$.pipe(filter((isRunning) => !isRunning)).subscribe(() => this.notRunning());
    }

    //#region Delegate event listeners
    private startDelegateEventListeners(): void {
        this.gameInfoDelegate.startEventListeners();
        this.infoUpdatesDelegate.startEventListeners();
        this.newGameEventDelegate.startEventListeners();
        this.delegateEventListenersStarted = true;
        console.debug(`[${this.constructor.name}] Game Delegate Event Listeners Started`);
    }

    private stopDelegateEventListeners(): void {
        this.gameInfoDelegate.stopEventListeners();
        this.infoUpdatesDelegate.stopEventListeners();
        this.newGameEventDelegate.stopEventListeners();
        this.delegateEventListenersStarted = false;
        console.debug(`[${this.constructor.name}] Game Delegate Event Listeners Stopped`);
    }
    //#endregion

    private notRunning() {
        this.stopDelegateEventListeners();
        this.featureRegistration.unregisterFeatures();
        console.warn(`[${this.constructor.name}] Overwolf Data Provider Service is not running.`);
    }
}

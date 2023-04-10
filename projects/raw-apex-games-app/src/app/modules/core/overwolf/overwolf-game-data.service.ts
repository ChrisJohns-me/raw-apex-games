import { Inject, Injectable } from "@angular/core";
import { SingletonServiceProviderFactory } from "@raw-apex-games-app/app/singleton-service.provider.factory";
import { BehaviorSubject, Subject, interval, merge } from "rxjs";
import { delay, distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { BaseService } from "../base-service.abstract";
import { InfoUpdatesDelegate } from "./api/games/events/info-updates-delegate";
import { NewGameEventDelegate } from "./api/games/events/new-game-event-delegate";
import { GameInfoDelegate } from "./api/games/game-info-delegate";
import { OWConfig, OW_CONFIG } from "./overwolf-config";
import { OWFeatureRegistrationStatus, OverwolfFeatureRegistrationService } from "./overwolf-feature-registration.service";
import { OWGameEvent, OWInfoUpdates2Event, OWRunningGameInfo } from "./types/overwolf-types";

/**
 * @summary On any first run of the app or game, re-register the required features by unregistering before registering
 *  to hopefully force the Overwolf Game Event Provider to re-recognize the app and game-data.
 * @see https://discuss.overwolf.com/t/apex-legends-events-completly-stop-if-overwolf-is-being-relaunched-while-game-is-already-open/495
 */
const FEATURE_FIRST_REREGISTRATION_TIME = 5000;

/**
 * @classdesc Game data information directly from the Overwolf API.
 */
@Injectable({
    providedIn: "root",
    deps: [OW_CONFIG, OverwolfFeatureRegistrationService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("OverwolfGameDataService", OverwolfGameDataService, deps),
})
export class OverwolfGameDataService extends BaseService {
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

    private readonly gameInfoDelegate = new GameInfoDelegate(this.owConfig.APEXLEGENDSCLASSID);
    private readonly infoUpdatesDelegate = new InfoUpdatesDelegate();
    private readonly newGameEventDelegate = new NewGameEventDelegate();
    //#endregion

    //#region Game Monitor
    private readonly gameMonitorGameInfoDelegate = new GameInfoDelegate(this.owConfig.APEXLEGENDSCLASSID);
    //#endregion

    private isRunning$ = new BehaviorSubject<boolean>(false);
    private delegateEventListenersStarted = false;

    constructor(
        @Inject(OW_CONFIG) private readonly owConfig: OWConfig,
        private readonly featureRegistration: OverwolfFeatureRegistrationService
    ) {
        super();
        this.gameMonitorGameInfoDelegate.gameInfo$
            .pipe(
                takeUntil(this.destroy$),
                map((gameInfo) => gameInfo?.isRunning ?? false),
                distinctUntilChanged()
            )
            .subscribe((isRunning) => this.isRunning$.next(isRunning));

        this.gameMonitorGameInfoDelegate.startEventListeners();
        this.setupRunningCheck();
    }

    public ngOnDestroy(): void {
        this.stopDelegateEventListeners();
        this.gameMonitorGameInfoDelegate.stopEventListeners();
        super.ngOnDestroy();
    }

    private setupRunningCheck(): void {
        const isRunningHealthcheck$ = interval(this.owConfig.HEALTHCHECK_TIME).pipe(
            tap(() =>
                console.debug(
                    `[${this.constructor.name}] (Running HealthCheck), ` +
                        `Game Running: "${this.isRunning$.value}", ` +
                        `Features: "${this.featureRegistration.registrationStatus$.value}"`
                )
            )
        );

        const isRunningChanged$ = this.isRunning$.pipe(
            switchMap(() => this.featureRegistration.unregisterFeatures()),
            delay(FEATURE_FIRST_REREGISTRATION_TIME)
        );
        merge(isRunningHealthcheck$, isRunningChanged$)
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.isRunning$.value),
                switchMap(() => this.featureRegistration.setRegisteredFeatures())
            )
            .subscribe(() => {
                if (this.featureRegistration.registrationStatus$.value !== OWFeatureRegistrationStatus.SUCCESS) {
                    console.warn(`[${this.constructor.name}] Overwolf Data Provider Service is not running. (Features not set)`);
                    return;
                }
                if (!this.delegateEventListenersStarted) {
                    this.startDelegateEventListeners();
                    console.debug(`[${this.constructor.name}] Overwolf Data Provider Service is ready.`);
                }
            });
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
}

import { Injectable, OnDestroy } from "@angular/core";
import { ReplaySubject, Subject } from "rxjs";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import {
    OverwolfDataProviderService,
    OWGameEvent,
    OWGameInfoUpdatedEvent,
    OWInfoUpdates2Event,
} from "./overwolf-data-provider";

/**
 * Avoid directly using this service, or the OverwolfDataProviderService
 */
@Injectable({
    providedIn: "root",
    deps: [OverwolfDataProviderService],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("OverwolfDataInjectionService", OverwolfExposedDataService, deps),
})
export class OverwolfExposedDataService implements OnDestroy {
    public get rawGameInfoUpdated$(): ReplaySubject<OWGameInfoUpdatedEvent> {
        return this.overwolf.gameInfoUpdated$;
    }
    public get rawInfoUpdates$(): Subject<OWInfoUpdates2Event> {
        return this.overwolf.infoUpdates$;
    }
    public get rawNewGameEvent$(): Subject<OWGameEvent> {
        return this.overwolf.newGameEvent$;
    }

    private readonly _unsubscribe = new Subject<void>();

    constructor(private readonly overwolf: OverwolfDataProviderService) {
        console.debug(`[${this.constructor.name}] Instantiated`);
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        // ...
    }

    public injectOnGameInfoUpdated(gameInfoUpdate: OWGameInfoUpdatedEvent): void {
        this.overwolf["gameInfoUpdatedDelegate"].onGameInfoUpdated(gameInfoUpdate);
    }

    public injectOnInfoUpdates2(infoUpdate: overwolf.games.events.InfoUpdates2Event): void {
        this.overwolf["infoUpdatesDelegate"].onInfoUpdates2(infoUpdate);
    }

    public injectOnNewGameEvents(newGameEvent: overwolf.games.events.NewGameEvents): void {
        this.overwolf["newGameEventDelegate"].onNewGameEvents(newGameEvent);
    }
}

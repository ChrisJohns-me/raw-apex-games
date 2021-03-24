import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { OverwolfDataProviderService, OWGameEvent, OWInfoUpdates2Event, OWRunningGameInfo } from "./overwolf-data-provider";

/**
 * Avoid directly using this service, or the OverwolfDataProviderService
 */
@Injectable({
    providedIn: "root",
    deps: [OverwolfDataProviderService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("OverwolfExposedDataService", OverwolfExposedDataService, deps),
})
export class OverwolfExposedDataService implements OnDestroy {
    public get rawGameInfo$(): BehaviorSubject<Optional<OWRunningGameInfo>> {
        return this.overwolf.gameInfo$;
    }
    public get rawInfoUpdates$(): Subject<OWInfoUpdates2Event> {
        return this.overwolf.infoUpdates$;
    }
    public get rawNewGameEvent$(): Subject<OWGameEvent> {
        return this.overwolf.newGameEvent$;
    }

    private readonly _unsubscribe = new Subject<void>();

    constructor(private readonly overwolf: OverwolfDataProviderService) {}

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        // ...
    }

    public injectOnGameInfo(gameInfo: OWRunningGameInfo): void {
        this.overwolf["gameInfoDelegate"].onGameInfo(gameInfo);
    }

    public injectOnInfoUpdates2(infoUpdate: overwolf.games.events.InfoUpdates2Event): void {
        this.overwolf["infoUpdatesDelegate"].onInfoUpdates2(infoUpdate);
    }

    public injectOnNewGameEvents(newGameEvent: overwolf.games.events.GameEvent): void {
        this.overwolf["newGameEventDelegate"].onNewGameEvents({ events: [newGameEvent] });
    }
}

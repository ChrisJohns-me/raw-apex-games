import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
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
        return this.overwolfData.gameInfo$;
    }
    public get rawInfoUpdates$(): Subject<OWInfoUpdates2Event> {
        return this.overwolfData.infoUpdates$;
    }
    public get rawNewGameEvent$(): Subject<OWGameEvent> {
        return this.overwolfData.newGameEvent$;
    }

    private readonly _unsubscribe$ = new Subject<void>();

    constructor(private readonly overwolfData: OverwolfDataProviderService) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public start(): void {
        // ...
    }

    public injectOnGameInfo(gameInfo: OWRunningGameInfo): void {
        this.overwolfData["gameInfoDelegate"].onGameInfo(gameInfo);
    }

    public injectOnInfoUpdates2(infoUpdate: overwolf.games.events.InfoUpdates2Event): void {
        this.overwolfData["infoUpdatesDelegate"].onInfoUpdates2(infoUpdate);
    }

    public injectOnNewGameEvents(newGameEvent: overwolf.games.events.GameEvent): void {
        this.overwolfData["newGameEventDelegate"].onNewGameEvents({ events: [newGameEvent] });
    }
}

import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { OverwolfGameDataService, OWGameEvent, OWInfoUpdates2Event, OWRunningGameInfo } from "./overwolf";

/**
 * Avoid directly using this service, or the OverwolfGameDataService
 */
@Injectable({
    providedIn: "root",
    deps: [OverwolfGameDataService],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("ExposedOverwolfGameDataService", ExposedOverwolfGameDataService, deps),
})
export class ExposedOverwolfGameDataService implements OnDestroy {
    public get rawGameInfo$(): BehaviorSubject<Optional<OWRunningGameInfo>> {
        return this.overwolfGameData.gameInfo$;
    }
    public get rawInfoUpdates$(): Subject<OWInfoUpdates2Event> {
        return this.overwolfGameData.infoUpdates$;
    }
    public get rawNewGameEvent$(): Subject<OWGameEvent> {
        return this.overwolfGameData.newGameEvent$;
    }

    private readonly _unsubscribe$ = new Subject<void>();

    constructor(private readonly overwolfGameData: OverwolfGameDataService) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public init(): void {
        // ...
    }

    public injectOnGameInfo(gameInfo: OWRunningGameInfo): void {
        this.overwolfGameData["gameInfoDelegate"]["onGameInfo"](gameInfo);
    }

    public injectOnInfoUpdates2(infoUpdate: overwolf.games.events.InfoUpdates2Event): void {
        this.overwolfGameData["infoUpdatesDelegate"]["onInfoUpdates2"](infoUpdate);
    }

    public injectOnNewGameEvents(newGameEvent: overwolf.games.events.GameEvent): void {
        this.overwolfGameData["newGameEventDelegate"]["onNewGameEvents"]({ events: [newGameEvent] });
    }
}

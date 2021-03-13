import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { InfoUpdatesHandler } from "./games/events/info-updates-handler";
import { NewGameEventHandler } from "./games/events/new-game-event-handler";
import { GameInfoUpdatedHandler } from "./games/game-info-updated-handler";

/**
 * @class OverwolfDataProviderService
 * @classdesc Data directly from the Overwolf API.
 *            Data JSON parsed, but same structure to what Overwolf API provides.
 */
@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("OverwolfDataProviderService", OverwolfDataProviderService, deps),
})
export class OverwolfDataProviderService implements OnDestroy {
    public readonly gameInfoUpdated$;
    public readonly infoUpdates$;
    public readonly newGameEvent$;

    private readonly gameInfoUpdatedHandler = new GameInfoUpdatedHandler();
    private readonly infoUpdatesHandler = new InfoUpdatesHandler();
    private readonly newGameEventHandler = new NewGameEventHandler();

    private readonly _unsubscribe = new Subject<void>();

    constructor() {
        console.debug(`[${this.constructor.name}] Instantiated`);

        this.gameInfoUpdated$ = this.gameInfoUpdatedHandler.gameInfoUpdated;
        this.infoUpdates$ = this.infoUpdatesHandler.infoUpdates;
        this.newGameEvent$ = this.newGameEventHandler.newGameEvent;

        this.registerEvents();
    }

    public ngOnDestroy(): void {
        this.unregisterEvents();

        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    //#region Overwolf callback listeners
    private registerEvents(): void {
        overwolf.games.onGameInfoUpdated.addListener((event) => this.gameInfoUpdatedHandler.onGameInfoUpdated(event));
        overwolf.games.events.onInfoUpdates2.addListener((event) => this.infoUpdatesHandler.onInfoUpdates(event));
        overwolf.games.events.onNewEvents.addListener((event) => this.newGameEventHandler.onNewGameEvents(event));
    }

    private unregisterEvents(): void {
        overwolf.games.onGameInfoUpdated.removeListener((event) =>
            this.gameInfoUpdatedHandler.onGameInfoUpdated(event)
        );
        overwolf.games.events.onInfoUpdates2.removeListener((event) => this.infoUpdatesHandler.onInfoUpdates(event));
        overwolf.games.events.onNewEvents.removeListener((event) => this.newGameEventHandler.onNewGameEvents(event));
    }
    //#endregion
}

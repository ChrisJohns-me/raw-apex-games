import { BaseService } from "#app/modules/core/base-service.abstract.js";
import { LocalDatabaseService } from "#app/modules/core/local-database/local-database.service.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { isPlayerNameEqual } from "#shared/utilities/player.js";
import { isEmpty } from "#shared/utilities/primitives/boolean.js";
import { Injectable } from "@angular/core";
import { BehaviorSubject, defer, from, iif, merge, Observable, of } from "rxjs";
import { filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { LocalStorageKeys } from "./local-storage/local-storage-keys.js";
import { LocalStorageService } from "./local-storage/local-storage.service.js";
import { OWGameEventKillFeed } from "./overwolf/index.js";
import { OverwolfGameDataService } from "./overwolf/overwolf-game-data.service.js";

/**
 * Service that provides the player's name.
 * This is separate from other player services to avoid circular dependencies with MatchRosterService.
 */
@Injectable({
    providedIn: "root",
    deps: [LocalDatabaseService, LocalStorageService, OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("PlayerNameService", PlayerNameService, deps),
})
export class PlayerNameService extends BaseService {
    /**
     * Data gathered from Overwolf's data or if empty during a match, attempts to infer from killfeed.
     * Distinct until changed.
     */
    public readonly myName$ = new BehaviorSubject<Optional<string>>(undefined);

    constructor(
        private readonly localDatabase: LocalDatabaseService,
        private readonly localStorage: LocalStorageService,
        private readonly overwolfGameData: OverwolfGameDataService
    ) {
        super();
        this.setupMyName();
    }

    private setupMyName(): void {
        const setNameFn = (name?: string): void => {
            if (!isEmpty(name) && !isPlayerNameEqual(name, this.myName$.value)) {
                console.info("New name", name, "adding to local storage");
                this.myName$.next(name);
                this.localStorage.set(LocalStorageKeys.LastKnownPlayerName, name!);
            }
        };

        // Initial load
        of(this.getPlayerNameFromLocalStorage())
            .pipe(
                takeUntil(this.destroy$),
                switchMap((myName) => iif(() => isEmpty(myName), this.getPlayerNameFromLastPlayedGame$(), of(myName))),
                tap((myName) => console.info("Found player name from local storage", myName))
            )
            .subscribe((myName) => setNameFn(myName));

        // Watch in-game events
        merge(this.getPlayerNameFromGameInfo$(), this.getPlayerNameFromKillFeed$())
            .pipe(takeUntil(this.destroy$))
            .subscribe((myName) => setNameFn(myName));
    }

    private getPlayerNameFromGameInfo$(): Observable<string> {
        return this.overwolfGameData.infoUpdates$.pipe(
            takeUntil(this.destroy$),
            filter((infoUpdate) => infoUpdate.feature === "game_info" && !!infoUpdate.info.game_info?.player?.player_name),
            map((infoUpdate) => infoUpdate.info.game_info!.player!.player_name),
            tap((myName) => console.info("Found player name from game info", myName)),
            filter((myName) => !isEmpty(myName))
        ) as Observable<string>;
    }

    private getPlayerNameFromKillFeed$(): Observable<string> {
        return this.overwolfGameData.newGameEvent$.pipe(
            takeUntil(this.destroy$),
            filter((gameEvent) => gameEvent.name === "kill_feed"),
            filter((gameEvent) => !!(gameEvent.data as OWGameEventKillFeed).local_player_name),
            map((gameEvent) => (gameEvent.data as OWGameEventKillFeed).local_player_name)
        ) as Observable<string>;
    }

    private getPlayerNameFromLocalStorage(): Optional<string> {
        return this.localStorage.get(LocalStorageKeys.LastKnownPlayerName) ?? undefined;
    }

    private getPlayerNameFromLastPlayedGame$(): Observable<string> {
        const matchObs = defer(() => from(this.localDatabase.matches.toCollection().last()));
        return matchObs.pipe(
            map((lastMatch) => lastMatch?.myName),
            tap((myName) => console.info("Found player name from last played game", myName)),
            filter((myName) => !isEmpty(myName))
        ) as Observable<string>;
    }
}

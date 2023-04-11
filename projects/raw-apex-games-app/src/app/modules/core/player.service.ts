import { Injectable } from "@angular/core";
import { isPlayerNameEqual } from "@raw-apex-games-app/app/common/utilities/player";
import { SingletonServiceProviderFactory } from "@raw-apex-games-app/app/singleton-service.provider.factory";
import { isEmpty } from "common/utilities/";
import { BehaviorSubject, defer, from, iif, Observable, of } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";
import { BaseService } from "./base-service.abstract";
import { LocalDatabaseService } from "./local-database/local-database.service";
import { LocalStorageKeys } from "./local-storage/local-storage-keys";
import { LocalStorageService } from "./local-storage/local-storage.service";
import { OverwolfGameDataService } from "./overwolf";

@Injectable({
    providedIn: "root",
    deps: [LocalDatabaseService, LocalStorageService, OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("PlayerService", PlayerService, deps),
})
export class PlayerService extends BaseService {
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
                this.myName$.next(name);
                this.localStorage.set(LocalStorageKeys.LastKnownPlayerName, name!);
            }
        };

        // Initial load
        of(this.getPlayerNameFromLocalStorage())
            .pipe(
                takeUntil(this.destroy$),
                switchMap((myName) => iif(() => isEmpty(myName), this.getPlayerNameFromLastPlayedGame$(), of(myName)))
            )
            .subscribe((myName) => setNameFn(myName));

        // Watch in-game events
        this.getPlayerNameFromGameInfo$()
            .pipe(takeUntil(this.destroy$))
            .subscribe((myName) => setNameFn(myName));
    }

    private getPlayerNameFromGameInfo$(): Observable<string> {
        return this.overwolfGameData.infoUpdates$.pipe(
            takeUntil(this.destroy$),
            filter((infoUpdate) => infoUpdate.feature === "game_info" && !!infoUpdate.info.game_info?.player?.player_name),
            map((infoUpdate) => infoUpdate.info.game_info!.player!.player_name),
            filter((myName) => !isEmpty(myName))
        ) as Observable<string>;
    }

    private getPlayerNameFromLocalStorage(): Optional<string> {
        return this.localStorage.get(LocalStorageKeys.LastKnownPlayerName) ?? undefined;
    }

    private getPlayerNameFromLastPlayedGame$(): Observable<string> {
        const matchObs = defer(() => from(this.localDatabase.matches.toCollection().last()));
        return matchObs.pipe(
            map((lastMatch) => lastMatch?.myName),
            filter((myName) => !isEmpty(myName))
        ) as Observable<string>;
    }
}

import { BaseService } from "#app/modules/core/base-service.abstract.js";
import { LocalDatabaseService } from "#app/modules/core/local-database/local-database.service.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { isEmpty } from "#shared/utilities/primitives/boolean.js";
import { Injectable } from "@angular/core";
import { BehaviorSubject, defer, from, iif, Observable, of } from "rxjs";
import { filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { LocalStorageKeys } from "./local-storage/local-storage-keys.js";
import { LocalStorageService } from "./local-storage/local-storage.service.js";
import { MatchRosterService } from "./match/match-roster.service.js";
import { OverwolfGameDataService } from "./overwolf/overwolf-game-data.service.js";

/**
 * Service that provides the player's Origin ID.
 * This is separate from the player name service to avoid circular dependencies with MatchRosterService.
 * Currently, Origin Id is only available via Match Roster data from Overwolf.
 */
@Injectable({
    providedIn: "root",
    deps: [LocalDatabaseService, LocalStorageService, MatchRosterService, OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("PlayerOriginIdService", PlayerOriginIdService, deps),
})
export class PlayerOriginIdService extends BaseService {
    /**
     * Origin ID of the player; only available after playing a game.
     * Distinct until changed.
     */
    public readonly myOriginId$ = new BehaviorSubject<Optional<string>>(undefined);

    constructor(
        private readonly localDatabase: LocalDatabaseService,
        private readonly localStorage: LocalStorageService,
        private readonly matchRoster: MatchRosterService,
        private readonly overwolfGameData: OverwolfGameDataService
    ) {
        super();
        this.setupMyOriginId();
    }

    private setupMyOriginId(): void {
        const setOriginIdFn = (originId?: string): void => {
            if (!isEmpty(originId) && originId !== this.myOriginId$.value) {
                console.info("New originID", originId, "adding to local storage");
                this.myOriginId$.next(originId);
                this.localStorage.set(LocalStorageKeys.LastKnownPlayerOriginId, originId!);
            }
        };

        // Initial load
        of(this.getOriginIdFromLocalStorage())
            .pipe(
                takeUntil(this.destroy$),
                switchMap((originId) => iif(() => isEmpty(originId), this.getOriginIdFromLastPlayedGame$(), of(originId))),
                tap((originId) => console.info("Found Origin ID from local storage", originId))
            )
            .subscribe((originId) => setOriginIdFn(originId));

        // Watch in-game events
        this.getOriginIdFromMatchRoster$()
            .pipe(takeUntil(this.destroy$))
            .subscribe((myOriginId) => setOriginIdFn(myOriginId));
    }

    private getOriginIdFromLocalStorage(): Optional<string> {
        return this.localStorage.get(LocalStorageKeys.LastKnownPlayerOriginId) ?? undefined;
    }

    private getOriginIdFromMatchRoster$(): Observable<string> {
        return this.matchRoster.playerRosterItem$.pipe(
            filter((playerRosterItem) => !isEmpty(playerRosterItem?.originId)),
            map((playerRosterItem) => playerRosterItem?.originId)
        ) as Observable<string>;
    }

    private getOriginIdFromLastPlayedGame$(): Observable<string> {
        const matchObs = defer(() => from(this.localDatabase.matches.toCollection().last()));
        return matchObs.pipe(
            map((lastMatch) => lastMatch?.myName),
            tap((originId) => console.info("Found Origin ID from last played game", originId)),
            filter((originId) => !isEmpty(originId))
        ) as Observable<string>;
    }
}

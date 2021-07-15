import { Injectable } from "@angular/core";
import { BaseService } from "@shared-app/services/base-service.abstract";
import { OverwolfGameDataService, OWGameEventKillFeed } from "@shared-app/services/overwolf";
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { isPlayerNameEqual } from "@shared-app/utilities/player";
import { isEmpty } from "common/utilities/";
import { BehaviorSubject, merge, Observable, of } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { LocalStorageKeys } from "./local-storage/local-storage-keys";
import { LocalStorageService } from "./local-storage/local-storage.service";

@Injectable({
    providedIn: "root",
    deps: [LocalStorageService, OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("PlayerService", PlayerService, deps),
})
export class PlayerService extends BaseService {
    /**
     * Data gathered from Overwolf's "me" data or if empty during a match, attempts to infer from killfeed.
     * Distinct until changed.
     */
    public readonly myName$ = new BehaviorSubject<Optional<string>>(undefined);

    constructor(private readonly localStorage: LocalStorageService, private readonly overwolfGameData: OverwolfGameDataService) {
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
            .pipe(takeUntil(this.destroy$))
            .subscribe((myName) => setNameFn(myName));

        // Watch in-game events
        merge(this.getPlayerNameFromInfoUpdates$(), this.getPlayerNameFromGame$())
            .pipe(takeUntil(this.destroy$))
            .subscribe((myName) => setNameFn(myName));
    }

    private getPlayerNameFromInfoUpdates$(): Observable<string> {
        return this.overwolfGameData.infoUpdates$.pipe(
            takeUntil(this.destroy$),
            filter((infoUpdate) => infoUpdate.feature === "me" && !!infoUpdate.info.me?.name),
            map((infoUpdate) => infoUpdate.info.me?.name),
            filter((myName) => !isEmpty(myName))
        ) as Observable<string>;
    }

    private getPlayerNameFromGame$(): Observable<string> {
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
}

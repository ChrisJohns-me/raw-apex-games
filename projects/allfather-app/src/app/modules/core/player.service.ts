import { isPlayerNameEqual } from "@allfather-app/app/shared/models/utilities/player";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { OverwolfGameDataService, OWGameEventKillFeed } from "./overwolf";

@Injectable({
    providedIn: "root",
    deps: [OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("PlayerService", PlayerService, deps),
})
export class PlayerService implements OnDestroy {
    /**
     * Data gathered from Overwolf's "me" data or if empty during a match, attempts to infer from killfeed.
     * Distinct until changed.
     */
    public readonly myName$ = new BehaviorSubject<Optional<string>>(undefined);

    private readonly _unsubscribe$ = new Subject<void>();
    constructor(private readonly overwolfGameData: OverwolfGameDataService) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public init(): void {
        this.setupMyName();
    }

    // TODO: Get player name from storage
    private setupMyName(): void {
        const setNameFn = (name?: string): void => {
            if (!isPlayerNameEqual(name, this.myName$.value)) this.myName$.next(name);
        };

        this.overwolfGameData.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe$),
                filter((infoUpdate) => infoUpdate.feature === "me" && !!infoUpdate.info.me?.name),
                map((infoUpdate) => infoUpdate.info.me?.name)
            )
            .subscribe((myName) => setNameFn(myName));

        this.overwolfGameData.newGameEvent$
            .pipe(
                takeUntil(this._unsubscribe$),
                filter((gameEvent) => gameEvent.name === "kill_feed"),
                filter((gameEvent) => !!(gameEvent.data as OWGameEventKillFeed).local_player_name),
                map((gameEvent) => (gameEvent.data as OWGameEventKillFeed).local_player_name)
            )
            .subscribe((myName) => setNameFn(myName));
    }
}

import { Injectable, OnDestroy } from "@angular/core";
import { isPlayerNameEqual } from "@common/utilities/player";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { OverwolfDataProviderService, OWGameEventKillFeed } from "./overwolf-data-provider";

@Injectable({
    providedIn: "root",
    deps: [OverwolfDataProviderService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("PlayerService", PlayerService, deps),
})
export class PlayerService implements OnDestroy {
    /** Data gathered from Overwolf's "me" data. If empty during a match, attempts to infer from killfeed. */
    public readonly myName$ = new BehaviorSubject<Optional<string>>(undefined);

    private readonly _unsubscribe = new Subject<void>();
    constructor(private readonly overwolf: OverwolfDataProviderService) {}

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupMyName();
    }

    // TODO: Get player name from storage
    private setupMyName(): void {
        const setNameFn = (name?: string): void => {
            if (!isPlayerNameEqual(name, this.myName$.value)) this.myName$.next(name);
        };

        this.overwolf.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((infoUpdate) => infoUpdate.feature === "me" && !!infoUpdate.info.me?.name),
                map((infoUpdate) => infoUpdate.info.me?.name)
            )
            .subscribe((myName) => setNameFn(myName));

        this.overwolf.newGameEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((gameEvent) => gameEvent.name === "kill_feed"),
                filter((gameEvent) => !!(gameEvent.data as OWGameEventKillFeed).local_player_name),
                map((gameEvent) => (gameEvent.data as OWGameEventKillFeed).local_player_name)
            )
            .subscribe((myName) => setNameFn(myName));
    }
}

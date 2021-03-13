import { Injectable, OnDestroy } from "@angular/core";
import { MatchState } from "@common/match";
import { BehaviorSubject, Subject } from "rxjs";
import { distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { MatchService } from "./match.service";
import { OverwolfDataProviderService } from "./overwolf-data-provider";

@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfDataProviderService],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("PlayerInventoryService", PlayerInventoryService, deps),
})
export class PlayerInventoryService implements OnDestroy {
    public readonly inUse$ = new BehaviorSubject<string>("");
    public readonly weapons$ = new BehaviorSubject<[string, string]>(["", ""]);

    private readonly _unsubscribe = new Subject<void>();

    constructor(private readonly match: MatchService, private readonly overwolf: OverwolfDataProviderService) {
        console.debug(`[${this.constructor.name}] Instantiated`);

        this.start();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private start(): void {
        this.setupInUse();
        this.setupWeapons();
    }

    //#region Inventory item in use
    private setupInUse(): void {
        this.match.state$
            .pipe(
                takeUntil(this._unsubscribe),
                distinctUntilChanged(),
                filter((matchState) => matchState === MatchState.Active),
                tap(() => this.inUse$.next("")),
                switchMap(() => this.overwolf.infoUpdates$),
                filter((infoUpdate) => infoUpdate.feature === "inventory"),
                map((infoUpdate) => infoUpdate.info.me?.inUse?.inUse)
            )
            .subscribe((inUse) => {
                if (inUse) this.inUse$.next(inUse);
            });
    }
    //#endregion

    //#region Weapons
    private setupWeapons(): void {
        this.match.state$
            .pipe(
                takeUntil(this._unsubscribe),
                distinctUntilChanged(),
                filter((matchState) => matchState === MatchState.Active),
                tap(() => this.weapons$.next(["", ""])),
                switchMap(() => this.overwolf.infoUpdates$),
                filter((infoUpdate) => infoUpdate.feature === "inventory"),
                map((infoUpdate) => infoUpdate.info.me?.weapons)
            )
            .subscribe((weapons) => {
                const newWeapons: [string, string] = [weapons?.weapon0 ?? "", weapons?.weapon1 ?? ""];
                if (newWeapons && (newWeapons[0] || newWeapons[1])) this.weapons$.next(newWeapons);
            });
    }
    //#endregion
}

import { Injectable, OnDestroy } from "@angular/core";
import { Legend } from "@common/legend";
import { isPlayerNameEqual } from "@common/utilities/player";
import { BehaviorSubject, combineLatest, of, Subject } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { findKeyByKeyRegEx, isEmpty, mathClamp } from "src/utilities";
import { OverwolfDataProviderService } from "./overwolf-data-provider";
import { PlayerService } from "./player.service";

@Injectable({
    providedIn: "root",
    deps: [OverwolfDataProviderService, PlayerService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchPlayerLegendService", MatchPlayerLegendService, deps),
})
export class MatchPlayerLegendService implements OnDestroy {
    public readonly myLegend$ = new BehaviorSubject<Optional<Legend>>(undefined);
    public readonly myUltimateCooldown$ = new Subject<number>();

    private readonly _unsubscribe = new Subject<void>();

    constructor(private readonly overwolf: OverwolfDataProviderService, private readonly player: PlayerService) {}

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupMyLegend();
        this.setupMyUltimateCooldown();
    }

    //#region Legend
    private setupMyLegend(): void {
        const playerName$ = this.player.myName$.pipe(filter((myName) => !isEmpty(myName)));

        this.overwolf.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((infoUpdate) => infoUpdate.feature === "team" && !!findKeyByKeyRegEx(infoUpdate.info.match_info, /^legendSelect_/)),
                map((infoUpdate) => infoUpdate.info.match_info),
                filter((m) => !!m?.legendSelect_0 || !!m?.legendSelect_1 || !!m?.legendSelect_2),
                map((m) => [m?.legendSelect_0, m?.legendSelect_1, m?.legendSelect_2]),
                switchMap((legends) => combineLatest([of(legends), playerName$])),
                map(([legends, playerName]) => legends.find((legend) => isPlayerNameEqual(legend?.playerName, playerName))),
                filter((legendSelect) => !isEmpty(legendSelect))
            )
            .subscribe((legendSelect) => {
                const playerLegend = new Legend(legendSelect!.legendName);
                this.myLegend$.next(playerLegend);
            });
    }
    //#endregion

    //#region Ultimate Cooldown
    private setupMyUltimateCooldown(): void {
        this.overwolf.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((infoUpdate) => infoUpdate.feature === "me" && !!infoUpdate.info.me?.ultimate_cooldown),
                map((infoUpdate) => String(infoUpdate.info.me?.ultimate_cooldown?.ultimate_cooldown ?? "")),
                map((ultimateCooldown) => parseFloat(String(ultimateCooldown))),
                map((ultimateCooldown) => (isFinite(ultimateCooldown) ? mathClamp(ultimateCooldown / 100, 0, 1) : 0))
            )
            .subscribe((percent) => {
                this.myUltimateCooldown$.next(percent);
            });
    }
    //#endregion
}

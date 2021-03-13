import { Injectable, OnDestroy } from "@angular/core";
import { Legend } from "@common/legend";
import { BehaviorSubject, combineLatest, of, Subject } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { OverwolfDataProviderService } from "./overwolf-data-provider";
import { PlayerService } from "./player.service";

@Injectable({
    providedIn: "root",
    deps: [OverwolfDataProviderService, PlayerService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("PlayerService", PlayerLegendService, deps),
})
export class PlayerLegendService implements OnDestroy {
    public readonly legend$ = new BehaviorSubject<Optional<Legend>>(undefined);
    public readonly ultimateCooldownPercent$ = new Subject<number>();
    public readonly ultimateCooldownEstRemain$ = new Subject<number>();

    private readonly _unsubscribe = new Subject<void>();

    constructor(private readonly overwolf: OverwolfDataProviderService, private readonly player: PlayerService) {
        console.debug(`[${this.constructor.name}] Instantiated`);

        this.start();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private start(): void {
        this.setupLegend();
        this.setupUltimateCooldownPercent();
    }

    //#region Legend
    private setupLegend(): void {
        this.overwolf.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((infoUpdate) => infoUpdate.feature === "team" && !!infoUpdate.info.match_info?.legendSelect_0),
                map((infoUpdate) => infoUpdate.info.match_info),
                filter((m) => !!m?.legendSelect_0 || !!m?.legendSelect_1 || !!m?.legendSelect_2),
                map((m) => [m?.legendSelect_0 || m?.legendSelect_1 || m?.legendSelect_2]),
                switchMap((legends) => combineLatest([of(legends), this.player.playerName$])),
                map(([legends, playerName]) => legends.find((legend) => legend?.playerName === playerName))
            )
            .subscribe((legendSelect) => {
                if (!legendSelect) return;
                const playerLegend = new Legend(legendSelect.legendName);
                this.legend$.next(playerLegend);
            });
    }
    //#endregion

    //#region Ultimate Cooldown Percent
    private setupUltimateCooldownPercent(): void {
        this.overwolf.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((infoUpdate) => infoUpdate.feature === "me" && !!infoUpdate.info.me?.ultimate_cooldown),
                map((infoUpdate) => infoUpdate.info.me?.ultimate_cooldown?.ultimate_cooldown)
            )
            .subscribe((ultimateCooldown) => {
                this.ultimateCooldownPercent$.next(ultimateCooldown);
            });
    }
    //#endregion
}

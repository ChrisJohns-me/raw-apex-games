import { OverwolfGameDataService } from "@allfather-app/app/modules/core/overwolf";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { Legend } from "@allfather-app/app/shared/models/legend";
import { MatchLocationPhase } from "@allfather-app/app/shared/models/match/location";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, combineLatest, of, Subject } from "rxjs";
import { distinctUntilChanged, filter, map, pairwise, switchMap, takeUntil, tap } from "rxjs/operators";
import { mathClamp } from "shared/utilities";
import { MatchLegendSelectService } from "./match-legend-select.service";
import { MatchPlayerLocationService } from "./match-player-location.service";
import { MatchService } from "./match.service";

@Injectable({
    providedIn: "root",
    deps: [MatchService, MatchLegendSelectService, MatchPlayerLocationService, OverwolfGameDataService, PlayerService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchPlayerLegendService", MatchPlayerLegendService, deps),
})
export class MatchPlayerLegendService implements OnDestroy {
    public readonly myLegend$ = new BehaviorSubject<Optional<Legend>>(undefined);
    /** Percent of current Ultimate Cooldown; after player has landed. */
    public readonly myUltimateCooldown$ = new Subject<number>();
    /** Dates when an Ultimate is used; after player has landed. */
    public readonly myUltimateUsage$ = new Subject<Date>();

    private stagingLegends: {
        playerName: string;
        legend: Legend;
    }[] = [];
    private readonly _unsubscribe$ = new Subject<void>();
    constructor(
        private readonly match: MatchService,
        private readonly matchLegendSelect: MatchLegendSelectService,
        private readonly matchPlayerLocation: MatchPlayerLocationService,
        private readonly overwolfGameData: OverwolfGameDataService,
        private readonly player: PlayerService
    ) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public init(): void {
        this.setupOnMatchEnd();
        this.setupMyLegend();
        this.setupMyUltimateCooldown();
        this.setupMyUltimateUsage();
    }

    private setupOnMatchEnd(): void {
        this.match.endedEvent$.pipe(takeUntil(this._unsubscribe$)).subscribe(() => {
            this.stagingLegends = [];
        });
    }

    private setupMyLegend(): void {
        this.matchLegendSelect.legendSelected$
            .pipe(
                takeUntil(this._unsubscribe$),
                filter((selection) => !!selection.legend),
                tap((selection) => {
                    this.stagingLegends = this.stagingLegends.filter((sl) => sl.playerName !== selection.playerName);
                    this.stagingLegends.push(selection);
                }),
                map(() => this.stagingLegends),
                switchMap((stageList) => combineLatest([of(stageList), this.player.myName$])),
                map(([stageList, myName]) => stageList.find((ls) => ls.playerName === myName)),
                filter((myLegendSelected) => !!myLegendSelected),
                distinctUntilChanged()
            )
            .subscribe((myLegendSelected) => {
                this.myLegend$.next(myLegendSelected!.legend);
            });
    }

    private setupMyUltimateCooldown(): void {
        this.overwolfGameData.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe$),
                filter(() => this.matchPlayerLocation.myLocationPhase$.value === MatchLocationPhase.HasLanded),
                filter((infoUpdate) => infoUpdate.feature === "me" && !!infoUpdate.info.me?.ultimate_cooldown),
                map((infoUpdate) => String(infoUpdate.info.me?.ultimate_cooldown?.ultimate_cooldown ?? "")),
                map((ultimateCooldown) => parseFloat(String(ultimateCooldown))),
                map((ultimateCooldown) => (isFinite(ultimateCooldown) ? mathClamp(ultimateCooldown / 100, 0, 1) : 0)),
                distinctUntilChanged()
            )
            .subscribe((percent) => {
                this.myUltimateCooldown$.next(percent);
            });
    }

    private setupMyUltimateUsage(): void {
        this.myUltimateCooldown$
            .pipe(
                takeUntil(this._unsubscribe$),
                filter(() => this.matchPlayerLocation.myLocationPhase$.value === MatchLocationPhase.HasLanded),
                pairwise()
            )
            .subscribe(([prevCooldown, currCooldown]) => {
                if (currCooldown <= 0.05 && prevCooldown >= 0.9) this.myUltimateUsage$.next(new Date());
            });
    }
}

import { Legend } from "#app/models/legend/legend.js";
import { isPlayerNameEqual } from "#app/models/utilities/player.js";
import { BaseService } from "#app/modules/core/base-service.abstract.js";
import { MatchService } from "#app/modules/core/match/match.service.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { mathClamp } from "#shared/utilities/primitives/math.js";
import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, of, Subject } from "rxjs";
import { distinctUntilChanged, filter, map, pairwise, switchMap, takeUntil, tap } from "rxjs/operators";
import { OverwolfGameDataService } from "../overwolf/index.js";
import { PlayerNameService } from "../player-name.service.js";
import { MatchLegendSelectService } from "./match-legend-select.service.js";

@Injectable({
    providedIn: "root",
    deps: [MatchService, MatchLegendSelectService, OverwolfGameDataService, PlayerNameService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchPlayerLegendService", MatchPlayerLegendService, deps),
})
export class MatchPlayerLegendService extends BaseService {
    public readonly myLegend$ = new BehaviorSubject<Optional<Legend>>(undefined);
    /** Percent of current Ultimate Cooldown. */
    public readonly myUltimateCooldown$ = new Subject<number>();
    /** Dates when an Ultimate is used; best if also filtered with HASLANDED. */
    public readonly myUltimateUsage$ = new Subject<Date>();

    private stagingLegends: {
        playerName: string;
        legend: Legend;
    }[] = [];

    constructor(
        private readonly match: MatchService,
        private readonly matchLegendSelect: MatchLegendSelectService,
        private readonly overwolfGameData: OverwolfGameDataService,
        private readonly playerName: PlayerNameService
    ) {
        super();
        this.setupOnMatchEnd();
        this.setupMyLegend();
        this.setupMyUltimateCooldown();
        this.setupMyUltimateUsage();
    }

    private setupOnMatchEnd(): void {
        this.match.endedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.stagingLegends = [];
        });
    }

    private setupMyLegend(): void {
        this.matchLegendSelect.legendSelected$
            .pipe(
                takeUntil(this.destroy$),
                filter((selection) => !!selection.legend),
                tap((selection) => {
                    this.stagingLegends = this.stagingLegends.filter((sl) => !isPlayerNameEqual(sl.playerName, selection.playerName));
                    this.stagingLegends.push(selection);
                }),
                map(() => this.stagingLegends),
                switchMap((stageList) => combineLatest([of(stageList), this.playerName.myName$])),
                map(([stageList, myName]) => stageList.find((ls) => isPlayerNameEqual(ls.playerName, myName))),
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
                takeUntil(this.destroy$),
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
        this.myUltimateCooldown$.pipe(takeUntil(this.destroy$), pairwise()).subscribe(([prevCooldown, currCooldown]) => {
            if (currCooldown <= 0.05 && prevCooldown >= 0.9) this.myUltimateUsage$.next(new Date());
        });
    }
}

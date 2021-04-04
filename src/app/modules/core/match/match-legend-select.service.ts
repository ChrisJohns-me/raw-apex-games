import { Injectable, OnDestroy } from "@angular/core";
import { SingletonServiceProviderFactory } from "@app/singleton-service.provider.factory";
import { OverwolfDataProviderService, OWMatchInfo, OWMatchInfoLegendSelect } from "@core/overwolf-data-provider";
import { Legend } from "@shared/models/legend";
import { MatchState } from "@shared/models/match/match-state";
import { findValueByKeyRegEx, isEmpty } from "@shared/utilities";
import { Subject } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";
import { MatchService } from "./match.service";

/**
 * @classdesc Provides events when a teammate selects a legend; only when match is inactive
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfDataProviderService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchLegendSelectService", MatchLegendSelectService, deps),
})
export class MatchLegendSelectService implements OnDestroy {
    /**
     * Emits non-empty object for legend selection data any time there is a new legend selected for a player.
     * From Overwolf's "matchInfo.legendSelect_" data.
     */
    public readonly legendSelected$ = new Subject<{ playerName: string; legend: Legend }>();

    private readonly _unsubscribe$ = new Subject<void>();
    constructor(private readonly match: MatchService, private readonly overwolfData: OverwolfDataProviderService) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public start(): void {
        this.setupLegendSelected();
    }

    private setupLegendSelected(): void {
        const teamUpdates$ = this.match.state$.pipe(
            takeUntil(this._unsubscribe$),
            filter((stateChanged) => stateChanged.state === MatchState.Inactive),
            switchMap(() => this.overwolfData.infoUpdates$),
            filter((infoUpdate) => infoUpdate.feature === "team"),
            map((infoUpdate) => infoUpdate.info.match_info as OWMatchInfo)
        );

        teamUpdates$
            .pipe(
                map((matchInfo) => findValueByKeyRegEx<OWMatchInfoLegendSelect>(matchInfo, /^legendSelect_/)),
                filter((legendSelect) => !isEmpty(legendSelect?.playerName) && !isEmpty(legendSelect?.legendName))
            )
            .subscribe((legendSelect) => {
                const playerLegend = new Legend(legendSelect!.legendName);
                this.legendSelected$.next({ playerName: legendSelect!.playerName, legend: playerLegend });
            });
    }
}

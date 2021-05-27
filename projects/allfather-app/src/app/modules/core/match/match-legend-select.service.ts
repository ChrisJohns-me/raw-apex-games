import { Legend } from "@allfather-app/app/common/legend";
import { MatchState } from "@allfather-app/app/common/match/state";
import { OverwolfGameDataService, OWMatchInfo, OWMatchInfoLegendSelect } from "@allfather-app/app/modules/core/overwolf";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";
import { findValueByKeyRegEx, isEmpty } from "shared/utilities";
import { AllfatherService } from "../allfather-service.abstract";
import { MatchService } from "./match.service";

/**
 * @classdesc Provides events when a teammate selects a legend; only when match is inactive
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchLegendSelectService", MatchLegendSelectService, deps),
})
export class MatchLegendSelectService extends AllfatherService {
    /**
     * Emits non-empty object for legend selection data any time there is a new legend selected for a player.
     * From Overwolf's "matchInfo.legendSelect_" data.
     */
    public readonly legendSelected$ = new Subject<{ playerName: string; legend: Legend }>();

    constructor(private readonly match: MatchService, private readonly overwolfGameData: OverwolfGameDataService) {
        super();
        this.setupLegendSelected();
    }

    private setupLegendSelected(): void {
        const teamUpdates$ = this.match.state$.pipe(
            takeUntil(this.destroy$),
            filter((stateChanged) => stateChanged.state === MatchState.Inactive),
            switchMap(() => this.overwolfGameData.infoUpdates$),
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

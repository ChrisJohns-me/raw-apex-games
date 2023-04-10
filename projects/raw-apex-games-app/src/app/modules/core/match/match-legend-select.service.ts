import { Injectable } from "@angular/core";
import { Legend } from "@raw-apex-games-app/app/common/legend/legend";
import { MatchState } from "@raw-apex-games-app/app/common/match/state";
import { SingletonServiceProviderFactory } from "@raw-apex-games-app/app/singleton-service.provider.factory";
import { findValueByKeyRegEx, isEmpty } from "common/utilities/";
import { Subject } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";
import { BaseService } from "../base-service.abstract";
import { OWMatchInfo, OWMatchInfoLegendSelect, OverwolfGameDataService } from "../overwolf";
import { MatchService } from "./match.service";

/**
 * @classdesc Provides events when a teammate selects a legend; only when match is inactive
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchLegendSelectService", MatchLegendSelectService, deps),
})
export class MatchLegendSelectService extends BaseService {
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

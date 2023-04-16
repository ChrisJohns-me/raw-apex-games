import { Injectable } from "@angular/core";
import { MatchMapList } from "@app/app/common/match/map/map-list";
import { MatchMap } from "@app/app/common/match/map/match-map";
import { SingletonServiceProviderFactory } from "@app/app/singleton-service.provider.factory";
import { isEmpty } from "common/utilities";
import { BehaviorSubject } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";
import { BaseService } from "../base-service.abstract";
import { OverwolfGameDataService } from "../overwolf";
import { MatchService } from "./match.service";

@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchMapService", MatchMapService, deps),
})
export class MatchMapService extends BaseService {
    /** Emits Match's Map at the beginning of a match. */
    public readonly map$ = new BehaviorSubject<Optional<MatchMap>>(undefined);

    constructor(private readonly match: MatchService, private readonly overwolfGameData: OverwolfGameDataService) {
        super();
        this.setupMatchMap();
    }

    private setupMatchMap(): void {
        this.match.startedEvent$
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.overwolfGameData.infoUpdates$),
                filter((infoUpdate) => infoUpdate.feature === "match_info" && !!infoUpdate.info.match_info?.map_id),
                map((infoUpdate) => infoUpdate.info.match_info?.map_id)
            )
            .subscribe((mapId) => {
                const matchMap = MatchMapList.find((matchMap) => matchMap.mapId === mapId);
                if (isEmpty(matchMap)) {
                    console.error(`[${this.constructor.name}] No map was identified from "${mapId}"`);
                } else {
                    console.log(`[${this.constructor.name}] Identified map against predefined MapList: "${matchMap?.mapId}"`);
                    this.map$.next(matchMap);
                }
            });
    }
}

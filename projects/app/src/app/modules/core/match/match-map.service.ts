import { Injectable } from "@angular/core";
import { MatchMapList } from "@app/models/match/map/map-list.js";
import { MatchMap } from "@app/models/match/map/match-map.js";
import { BaseService } from "@app/modules/core/base-service.abstract.js";
import { MatchService } from "@app/modules/core/match/match.service.js";
import { SingletonServiceProviderFactory } from "@app/singleton-service.provider.factory.js";
import { isEmpty } from "@shared/utilities/primitives/boolean.js";
import { BehaviorSubject } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";
import { OverwolfGameDataService } from "../overwolf/index.js";

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

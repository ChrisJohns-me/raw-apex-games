import { MatchMapList } from "@allfather-app/app/common/match/map/map-list";
import { MatchMap } from "@allfather-app/app/common/match/map/match-map";
import { BaseService } from "@allfather-app/app/common/services/base-service.abstract";
import { MapRotationService } from "@allfather-app/app/modules/core/map-rotation/map-rotation.service";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { isEmpty } from "common/utilities/";
import { BehaviorSubject, Observable, of } from "rxjs";
import { filter, map, mergeMap, switchMap, takeUntil } from "rxjs/operators";
import { MatchPlayerLocationService } from "./match-player-location.service";
import { MatchService } from "./match.service";

@Injectable({
    providedIn: "root",
    deps: [MatchService, MapRotationService, MatchPlayerLocationService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchMapService", MatchMapService, deps),
})
export class MatchMapService extends BaseService {
    /**
     * Emits Match's Map at the beginning of a match.
     * (Primary) Inferred by the player's starting Z location.
     * OR
     * (Secondary) Retrieved via Game Mode + Map Rotation data.
     */
    public readonly map$ = new BehaviorSubject<Optional<MatchMap>>(undefined);

    constructor(
        private readonly match: MatchService,
        private readonly mapRotationService: MapRotationService,
        private readonly matchPlayerLocation: MatchPlayerLocationService
    ) {
        super();
        this.setupMatchMap();
    }

    private setupMatchMap(): void {
        this.match.startedEvent$
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.getMapFromZLocation$()),
                mergeMap((zLocationMap) => {
                    if (!isEmpty(zLocationMap)) {
                        return of(zLocationMap);
                    } else {
                        console.warn(`[${this.constructor.name}] Unable to infer map; attempting to use Map Rotation to determine map`);
                        return this.getMapFromMapRotation$();
                    }
                })
            )
            .subscribe((matchMap) => {
                if (!isEmpty(matchMap)) {
                    console.log(`[${this.constructor.name}] Identified map: "${matchMap?.mapId}"`);
                    this.map$.next(matchMap);
                } else {
                    console.error(`[${this.constructor.name}] No map was identified!`);
                }
            });
    }

    /**
     * Infer the map based off of player's starting z-position.
     * @returns undefined if unable to get map
     */
    private getMapFromZLocation$(): Observable<Optional<MatchMap>> {
        return this.matchPlayerLocation.myStartingCoordinates$.pipe(
            filter((startingCoordinates) => !!startingCoordinates && !isEmpty(startingCoordinates)),
            map((startingCoordinates) => MatchMapList.find((map) => map.zStartPos == startingCoordinates?.z))
        );
    }

    /**
     * Uses Game Mode type + Map Rotation to determine the current map
     * @returns undefined if unable to get map
     */
    private getMapFromMapRotation$(): Observable<Optional<MatchMap>> {
        return this.match.gameMode$.pipe(
            map((gameMode) => {
                if (!gameMode || !gameMode.gameModeGenericId) {
                    console.error(`[${this.constructor.name}] Unable to get map from Map Rotation Data; Game Mode was empty`);
                    return undefined;
                }
                const currentMap = this.mapRotationService.getCurrentMapFromGameMode(gameMode.gameModeGenericId);
                if (!currentMap) {
                    console.error(
                        `[${this.constructor.name}] Unable to get map from Map Rotation Data; Cannot match using Game Mode ${gameMode.gameModeId} (${gameMode.gameModeGenericId})`
                    );
                    return undefined;
                }
                console.log(
                    `[${this.constructor.name}] Using map "${currentMap.mapName}" from Map Rotation and GameMode "${gameMode.gameModeId}"`
                );
                return currentMap;
            })
        );
    }
}

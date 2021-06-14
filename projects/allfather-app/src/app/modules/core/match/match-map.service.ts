import { MatchMapList } from "@allfather-app/app/common/match/map/map-list";
import { MatchMap } from "@allfather-app/app/common/match/map/match-map";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { isEmpty } from "shared/utilities";
import { AllfatherService } from "../allfather-service.abstract";
import { MapRotationService } from "../map-rotation/map-rotation.service";
import { MatchPlayerLocationService } from "./match-player-location.service";
import { MatchService } from "./match.service";

@Injectable({
    providedIn: "root",
    deps: [MatchService, MapRotationService, MatchPlayerLocationService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchMapService", MatchMapService, deps),
})
export class MatchMapService extends AllfatherService {
    /**
     * Emits Match's Map at the beginning of a match.
     * Inferred by the player's starting Z location.
     * OR
     * Retrieved via Game Mode + Map Rotation data.
     */
    public readonly map$ = new BehaviorSubject<Optional<MatchMap>>(undefined);

    constructor(
        private readonly match: MatchService,
        private readonly mapRotationService: MapRotationService,
        private readonly matchPlayerLocation: MatchPlayerLocationService
    ) {
        super();
        this.setupMapFromMapRotation();
        // this.setupMapFromZLocation();
    }

    /**
     * Uses Game Mode type + Map Rotation to determine the current map
     */
    private setupMapFromMapRotation(): void {
        this.match.gameMode$.pipe(takeUntil(this.destroy$)).subscribe((gameMode) => {
            if (gameMode && gameMode.gameModeGenericId) {
                const currentMap = this.mapRotationService.getCurrentMapFromGameMode(gameMode.gameModeGenericId);
                console.log(
                    `[${this.constructor.name}] Using gamemode "${gameMode.gameModeId}" to determine map: "${currentMap?.mapName}"`
                );
                this.map$.next(currentMap);
            } else {
                console.error(
                    `[${this.constructor.name}] Could not determine map from GameMode "${gameMode?.gameModeGenericId}" + Map Rotation`
                );
            }
        });
    }

    /**
     * Less than ideal logic to deduce the map based off of dropship's starting z-position
     */
    private setupMapFromZLocation(): void {
        this.matchPlayerLocation.myStartingCoordinates$
            .pipe(
                filter((startingCoordinates) => !!startingCoordinates && !isEmpty(startingCoordinates)),
                takeUntil(this.destroy$)
            )
            .subscribe((startingCoordinates) => {
                const gameMap = MatchMapList.find((map) => map.dropshipZStart == startingCoordinates?.z);
                if (!gameMap) {
                    console.warn(`Unable to map the dropship's starting z-position to any known maps. (z: ${startingCoordinates?.z})`);
                }

                this.map$.next(gameMap);
            });
    }
}

import { MatchMapList } from "@allfather-app/app/shared/models/match/map/map-list";
import { MatchMap } from "@allfather-app/app/shared/models/match/map/match-map";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { isEmpty } from "shared/utilities";
import { AllfatherService } from "../allfather-service.abstract";
import { MatchPlayerLocationService } from "./match-player-location.service";

@Injectable({
    providedIn: "root",
    deps: [MatchPlayerLocationService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchMapService", MatchMapService, deps),
})
export class MatchMapService extends AllfatherService {
    /**
     * Emits Match's Map at the beginning of a match.
     * Inferred by the player's starting Z location.
     */
    public readonly map$ = new BehaviorSubject<Optional<MatchMap>>(undefined);

    constructor(private readonly matchPlayerLocation: MatchPlayerLocationService) {
        super();
        this.setupMap();
    }

    /**
     * Less than ideal logic to deduce the map based off of dropship's starting z-position
     */
    private setupMap(): void {
        this.matchPlayerLocation.myStartingCoordinates$
            .pipe(
                filter((startingCoordinates) => !!startingCoordinates && !isEmpty(startingCoordinates)),
                takeUntil(this.isDestroyed$)
            )
            .subscribe((startingCoordinates) => {
                const gameMap = MatchMapList.find((map) => map.dropshipZStart == startingCoordinates?.z);
                if (!gameMap)
                    console.warn(`Unable to map the dropship's starting z-position to any known maps. (z: ${startingCoordinates?.z})`);

                this.map$.next(gameMap);
            });
    }
}

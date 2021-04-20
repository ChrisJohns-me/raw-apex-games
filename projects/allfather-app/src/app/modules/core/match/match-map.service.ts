import { MatchMap } from "@allfather-app/app/shared/models/match/map";
import { MatchMapList } from "@allfather-app/app/shared/models/match/map-list";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { isEmpty } from "shared/utilities";
import { MatchPlayerLocationService } from "./match-player-location.service";

@Injectable({
    providedIn: "root",
    deps: [MatchPlayerLocationService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchMapService", MatchMapService, deps),
})
export class MatchMapService implements OnDestroy {
    /**
     * Emits Match's Map at the beginning of a match.
     * Inferred by the player's starting Z location.
     */
    public readonly map$ = new BehaviorSubject<Optional<MatchMap>>(undefined);

    private readonly _unsubscribe$ = new Subject<void>();
    constructor(private readonly matchPlayerLocation: MatchPlayerLocationService) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public init(): void {
        this.setupMap();
    }

    /**
     * Less than ideal logic to deduce the map based off of dropship's starting z-position
     */
    private setupMap(): void {
        this.matchPlayerLocation.myStartingCoordinates$
            .pipe(
                filter((startingCoordinates) => !!startingCoordinates && !isEmpty(startingCoordinates)),
                takeUntil(this._unsubscribe$)
            )
            .subscribe((startingCoordinates) => {
                const gameMap = MatchMapList.find((map) => map.dropshipZStart == startingCoordinates?.z);
                if (!gameMap)
                    console.warn(`Unable to map the dropship's starting z-position to any known maps. (z: ${startingCoordinates?.z})`);

                this.map$.next(gameMap);
            });
    }
}

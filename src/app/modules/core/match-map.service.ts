import { Injectable, OnDestroy } from "@angular/core";
import { GameMap } from "@common/game-map";
import { GameMapList } from "@common/game-map-list";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { PlayerLocationService } from "./player-location.service";

@Injectable({
    providedIn: "root",
    deps: [PlayerLocationService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchMapService", MatchMapService, deps),
})
export class MatchMapService implements OnDestroy {
    public readonly map$ = new BehaviorSubject<GameMap>(GameMapList[0]);

    private readonly _unsubscribe = new Subject<void>();

    constructor(private readonly playerLocation: PlayerLocationService) {}

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupMap();
    }

    //#region Map
    /** Less than ideal logic to deduce the map based off of dropship's starting z-position */
    private setupMap(): void {
        this.playerLocation.myStartingCoordinates$
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((startingCoordinates) => {
                const gameMap = GameMapList.find((map) => map.dropshipZStart == startingCoordinates?.z);
                if (!gameMap) return;
                this.map$.next(gameMap);
            });
    }
    //#endregion
}

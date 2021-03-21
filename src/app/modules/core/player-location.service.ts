import { Injectable, OnDestroy } from "@angular/core";
import { TriggerConditions } from "@common/game-event-triggers";
import { MapCoordinates } from "@common/game-map";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { MatchService } from "./match.service";
import { OverwolfDataProviderService, OWInfoUpdates2Event } from "./overwolf-data-provider";
import { PlayerInventoryService } from "./player-inventory.service";

export enum LocationPhase {
    Dropship = "dropship",
    Dropping = "dropping",
    HasLanded = "has_landed",
}

@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfDataProviderService, PlayerInventoryService],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("PlayerLocationService", PlayerLocationService, deps),
})
export class PlayerLocationService implements OnDestroy {
    public readonly myCoordinates$ = new BehaviorSubject<Optional<MapCoordinates>>(undefined);
    public readonly myLocationPhase$ = new BehaviorSubject<Optional<LocationPhase>>(undefined);
    public readonly myStartingCoordinates$ = new BehaviorSubject<Optional<MapCoordinates>>(undefined);
    public readonly myLandingCoordinates$ = new BehaviorSubject<Optional<MapCoordinates>>(undefined);
    public readonly myEndingCoordinates$ = new BehaviorSubject<Optional<MapCoordinates>>(undefined);

    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly match: MatchService,
        private readonly overwolf: OverwolfDataProviderService,
        private readonly playerInventory: PlayerInventoryService
    ) {}

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupMatchStateEvents();
        this.setupMyCoordinates();
        this.setupMyLocationPhase();
        this.setupMyCompletedCoordinates();
        this.setupMyLandingCoordinates();
    }

    private setupMatchStateEvents(): void {
        this.match.started$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this.myCoordinates$.next(undefined);
            this.myLocationPhase$.next(undefined);
            this.myStartingCoordinates$.next(undefined);
            this.myLandingCoordinates$.next(undefined);
            this.myEndingCoordinates$.next(undefined);
        });
    }

    //#region Coordinates
    private setupMyCoordinates(): void {
        this.overwolf.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((infoUpdate) => infoUpdate.feature === "location" && !!infoUpdate.info.match_info?.location),
                map((infoUpdate) => infoUpdate.info.match_info?.location)
            )
            .subscribe((coord) => {
                const newCoords: MapCoordinates = {
                    x: parseInt(String(coord?.x)),
                    y: parseInt(String(coord?.y)),
                    z: parseInt(String(coord?.z)),
                };
                if (!isFinite(newCoords.x) || !isFinite(newCoords.y) || !isFinite(newCoords.z)) return;
                this.myCoordinates$.next(newCoords);
            });
    }
    //#endregion

    //#region Location Phase
    private setupMyLocationPhase(): void {
        const setNewLocationPhaseFn = (newPhase?: LocationPhase): void => {
            if (newPhase && newPhase !== this.myLocationPhase$.value) this.myLocationPhase$.next(newPhase);
        };

        const triggers = new TriggerConditions<LocationPhase, [OWInfoUpdates2Event?, boolean?]>({
            [LocationPhase.Dropship]: (infoUpdate, isMatchReset) =>
                !!isMatchReset && !this.myStartingCoordinates$.value,
            [LocationPhase.Dropping]: (infoUpdate) =>
                this.myLocationPhase$.value === LocationPhase.Dropship &&
                infoUpdate?.feature === "location" &&
                (infoUpdate.info.match_info?.location?.z ?? Infinity) <
                    (this.myStartingCoordinates$.value?.z ?? -Infinity),
            [LocationPhase.HasLanded]: () =>
                this.myLocationPhase$.value === LocationPhase.Dropping && !!this.myLandingCoordinates$.value,
        });

        this.overwolf.infoUpdates$.pipe(takeUntil(this._unsubscribe)).subscribe((infoUpdate) => {
            const newStatus = triggers.triggeredFirstKey(infoUpdate, false);
            setNewLocationPhaseFn(newStatus);
        });

        this.match.started$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            const newStatus = triggers.triggeredFirstKey(undefined, true);
            setNewLocationPhaseFn(newStatus);
        });
    }
    //#endregion

    //#region Starting/Ending Coordinates
    private setupMyCompletedCoordinates() {
        this.myCoordinates$
            .pipe(
                takeUntil(this._unsubscribe),
                filter(() => !this.myStartingCoordinates$.value),
                filter((coord) => !!coord && isFinite(coord.x) && isFinite(coord.y) && isFinite(coord.z))
            )
            .subscribe((coord) => this.myStartingCoordinates$.next(coord));

        this.match.ended$
            .pipe(
                takeUntil(this._unsubscribe),
                filter(() => !!this.myStartingCoordinates$.value && !this.myEndingCoordinates$.value),
                map(() => this.myCoordinates$.value),
                filter((coord) => !!coord && isFinite(coord.x) && isFinite(coord.y) && isFinite(coord.z)),
                filter((coord) => !!coord && coord.z < (this.myStartingCoordinates$.value?.z ?? -Infinity))
            )
            .subscribe((coord) => this.myEndingCoordinates$.next(coord));
    }
    //#endregion

    //#region Landing Coordinates
    private setupMyLandingCoordinates(): void {
        this.playerInventory.myInUseItem$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((inUse) => !!inUse),
                map(() => this.myCoordinates$.value),
                filter(() => !this.myLandingCoordinates$.value),
                filter((coord) => !!coord && isFinite(coord.x) && isFinite(coord.y) && isFinite(coord.z))
            )
            .subscribe((coord) => this.myLandingCoordinates$.next(coord));
    }
    //#endregion
}

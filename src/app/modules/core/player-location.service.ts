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
    public readonly coordinates$ = new BehaviorSubject<Optional<MapCoordinates>>(undefined);
    public readonly locationPhase$ = new BehaviorSubject<Optional<LocationPhase>>(undefined);
    public readonly startingCoordinates$ = new BehaviorSubject<Optional<MapCoordinates>>(undefined);
    public readonly landingCoordinates$ = new BehaviorSubject<Optional<MapCoordinates>>(undefined);
    public readonly endingCoordinates$ = new BehaviorSubject<Optional<MapCoordinates>>(undefined);

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
        this.setupCoordinates();
        this.setupLocationPhase();
        this.setupCompletedCoordinates();
        this.setupLandingCoordinates();
    }

    private setupMatchStateEvents(): void {
        this.match.started$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this.coordinates$.next(undefined);
            this.locationPhase$.next(undefined);
            this.startingCoordinates$.next(undefined);
            this.landingCoordinates$.next(undefined);
            this.endingCoordinates$.next(undefined);
        });
    }

    //#region Coordinates
    private setupCoordinates(): void {
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
                this.coordinates$.next(newCoords);
            });
    }
    //#endregion

    //#region Location Phase
    private setupLocationPhase(): void {
        const setNewLocationPhaseFn = (newPhase?: LocationPhase): void => {
            if (newPhase && newPhase !== this.locationPhase$.value) this.locationPhase$.next(newPhase);
        };

        const triggers = new TriggerConditions<LocationPhase, [OWInfoUpdates2Event?, boolean?]>({
            [LocationPhase.Dropship]: (infoUpdate, isMatchReset) => !!isMatchReset && !this.startingCoordinates$.value,
            [LocationPhase.Dropping]: (infoUpdate) =>
                this.locationPhase$.value === LocationPhase.Dropship &&
                infoUpdate?.feature === "location" &&
                (infoUpdate.info.match_info?.location?.z ?? Infinity) <
                    (this.startingCoordinates$.value?.z ?? -Infinity),
            [LocationPhase.HasLanded]: () =>
                this.locationPhase$.value === LocationPhase.Dropping && !!this.landingCoordinates$.value,
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
    private setupCompletedCoordinates() {
        this.coordinates$
            .pipe(
                takeUntil(this._unsubscribe),
                filter(() => !this.startingCoordinates$.value),
                filter((coord) => !!coord && isFinite(coord.x) && isFinite(coord.y) && isFinite(coord.z))
            )
            .subscribe((coord) => this.startingCoordinates$.next(coord));

        this.match.ended$
            .pipe(
                takeUntil(this._unsubscribe),
                filter(() => !!this.startingCoordinates$.value && !this.endingCoordinates$.value),
                map(() => this.coordinates$.value),
                filter((coord) => !!coord && isFinite(coord.x) && isFinite(coord.y) && isFinite(coord.z)),
                filter((coord) => !!coord && coord.z < (this.startingCoordinates$.value?.z ?? -Infinity))
            )
            .subscribe((coord) => this.endingCoordinates$.next(coord));
    }
    //#endregion

    //#region Landing Coordinates
    private setupLandingCoordinates(): void {
        this.playerInventory.inUse$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((inUse) => !!inUse),
                map(() => this.coordinates$.value),
                filter(() => !this.landingCoordinates$.value),
                filter((coord) => !!coord && isFinite(coord.x) && isFinite(coord.y) && isFinite(coord.z))
            )
            .subscribe((coord) => this.landingCoordinates$.next(coord));
    }
    //#endregion
}

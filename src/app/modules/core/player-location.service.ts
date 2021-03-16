import { Injectable, OnDestroy } from "@angular/core";
import { TriggerConditions } from "@common/game-event-triggers";
import { MapCoordinates } from "@common/game-map";
import { MatchState } from "@common/match";
import { BehaviorSubject, Subject } from "rxjs";
import { distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
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
    public readonly coordinates$ = new BehaviorSubject<MapCoordinates>({ x: Infinity, y: Infinity, z: Infinity });
    public readonly locationPhase$ = new BehaviorSubject<LocationPhase>(LocationPhase.Dropship);
    public startingCoordinates$ = new BehaviorSubject<Optional<MapCoordinates>>(undefined);
    public landingCoordinates$ = new BehaviorSubject<Optional<MapCoordinates>>(undefined);
    public endingCoordinates$ = new BehaviorSubject<Optional<MapCoordinates>>(undefined);

    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly match: MatchService,
        private readonly overwolf: OverwolfDataProviderService,
        private readonly playerInventory: PlayerInventoryService
    ) {
        console.debug(`[${this.constructor.name}] Instantiated`);
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupCoordinates();
        this.setupLocationPhase();
        this.setupCompletedCoordinates();
        this.setupLandingCoordinates();
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
                const newCoordinates: MapCoordinates = {
                    x: parseInt(String(coord?.x)),
                    y: parseInt(String(coord?.y)),
                    z: parseInt(String(coord?.z)),
                };
                if (!isFinite(newCoordinates.x) || !isFinite(newCoordinates.y) || !isFinite(newCoordinates.z)) return;
                this.coordinates$.next(newCoordinates);
            });
    }
    //#endregion

    //#region Location Phase
    private setupLocationPhase(): void {
        const setNewLocationPhaseFn = (newPhase?: LocationPhase): void => {
            if (newPhase && newPhase !== this.locationPhase$.value) this.locationPhase$.next(newPhase);
        };

        const triggers = new TriggerConditions<LocationPhase, [OWInfoUpdates2Event?, MatchState?]>({
            [LocationPhase.Dropship]: (infoUpdate, matchState) => matchState === MatchState.Active,
            [LocationPhase.Dropping]: (infoUpdate) =>
                this.locationPhase$.value === LocationPhase.Dropship &&
                infoUpdate?.feature === "location" &&
                (infoUpdate.info.match_info?.location?.z ?? Infinity) <
                    (this.startingCoordinates$.value?.z ?? -Infinity),
            [LocationPhase.HasLanded]: () =>
                this.locationPhase$.value === LocationPhase.Dropping && !!this.landingCoordinates$.value,
        });

        this.overwolf.infoUpdates$.pipe(takeUntil(this._unsubscribe)).subscribe((infoUpdate) => {
            const newStatus = triggers.triggeredFirstKey(infoUpdate, undefined);
            setNewLocationPhaseFn(newStatus);
        });

        this.match.state$.pipe(distinctUntilChanged(), takeUntil(this._unsubscribe)).subscribe((matchState) => {
            const newStatus = triggers.triggeredFirstKey(undefined, matchState);
            setNewLocationPhaseFn(newStatus);
        });
    }
    //#endregion

    //#region Starting/Ending Coordinates
    private setupCompletedCoordinates() {
        this.match.state$
            .pipe(
                takeUntil(this._unsubscribe),
                distinctUntilChanged(),
                tap((matchState) => {
                    if (matchState === MatchState.Active) {
                        this.startingCoordinates$.next(undefined);
                        this.endingCoordinates$.next(undefined);
                    }
                }),
                map((matchState): [MatchState, MapCoordinates] => [matchState, this.coordinates$.value])
            )
            .subscribe(([matchState, coordinates]) => {
                if (matchState === MatchState.Active && !this.startingCoordinates$.value) {
                    this.startingCoordinates$.next(coordinates);
                } else if (matchState === MatchState.Inactive && !this.endingCoordinates$.value) {
                    this.endingCoordinates$.next(coordinates);
                }
            });
    }
    //#endregion

    //#region Landing Coordinates
    private setupLandingCoordinates(): void {
        this.match.state$
            .pipe(
                takeUntil(this._unsubscribe),
                distinctUntilChanged(),
                filter((matchState) => matchState === MatchState.Active),
                tap(() => this.landingCoordinates$.next(undefined)),
                switchMap(() => this.playerInventory.inUse$),
                filter((inUse) => !this.landingCoordinates$.value && inUse.id === "knockdownshield")
            )
            .subscribe(() => {
                this.landingCoordinates$.next(this.coordinates$.value);
            });
    }
    //#endregion
}

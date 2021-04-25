import { OverwolfGameDataService, OWInfoUpdates2Event } from "@allfather-app/app/modules/core/overwolf";
import { MatchLocationPhase } from "@allfather-app/app/shared/models/match/location";
import { MatchMapCoordinates } from "@allfather-app/app/shared/models/match/map-coordinates";
import { TriggerConditions } from "@allfather-app/app/shared/models/utilities/trigger-conditions";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { cleanInt } from "shared/utilities";
import { MatchPlayerInventoryService } from "./match-player-inventory.service";
import { MatchService } from "./match.service";

@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfGameDataService, MatchPlayerInventoryService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchPlayerLocationService", MatchPlayerLocationService, deps),
})
export class MatchPlayerLocationService implements OnDestroy {
    /** Location data straight from Overwolf. Cleared on match start. */
    public readonly myCoordinates$ = new BehaviorSubject<Optional<MatchMapCoordinates>>(undefined);
    /** Based on internal triggers. Cleared on match start. */
    public readonly myLocationPhase$ = new BehaviorSubject<Optional<MatchLocationPhase>>(undefined);
    /** Local player's match start position. Cleared on match start. */
    public readonly myStartingCoordinates$ = new BehaviorSubject<Optional<MatchMapCoordinates>>(undefined);
    /** Local player's landing location. Inferred by "inUse":"Melee". Cleared on match start. */
    public readonly myLandingCoordinates$ = new BehaviorSubject<Optional<MatchMapCoordinates>>(undefined);
    /** Last known local player when match ends. Cleared on match start. */
    public readonly myEndingCoordinates$ = new BehaviorSubject<Optional<MatchMapCoordinates>>(undefined);

    private readonly _unsubscribe$ = new Subject<void>();

    constructor(
        private readonly match: MatchService,
        private readonly overwolfGameData: OverwolfGameDataService,
        private readonly playerInventory: MatchPlayerInventoryService
    ) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public init(): void {
        this.setupMatchStateEvents();
        this.setupMyCoordinates();
        this.setupMyLocationPhase();
        this.setupMyStartingCoordinates();
        this.setupMyEndingCoordinates();
        this.setupMyLandingCoordinates();
    }

    private setupMatchStateEvents(): void {
        this.match.startedEvent$.pipe(takeUntil(this._unsubscribe$)).subscribe(() => {
            this.myCoordinates$.next(undefined);
            this.myLocationPhase$.next(undefined);
            this.myStartingCoordinates$.next(undefined);
            this.myLandingCoordinates$.next(undefined);
            this.myEndingCoordinates$.next(undefined);
        });
    }

    private setupMyCoordinates(): void {
        this.overwolfGameData.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe$),
                filter((infoUpdate) => infoUpdate.feature === "location" && !!infoUpdate.info.match_info?.location),
                map((infoUpdate) => infoUpdate.info.match_info?.location)
            )
            .subscribe((coord) => {
                const newCoords: MatchMapCoordinates = {
                    x: cleanInt(coord?.x),
                    y: cleanInt(coord?.y),
                    z: cleanInt(coord?.z),
                };
                if (!isFinite(newCoords.x) || !isFinite(newCoords.y) || !isFinite(newCoords.z)) return;
                this.myCoordinates$.next(newCoords);
            });
    }

    private setupMyLocationPhase(): void {
        const setNewLocationPhaseFn = (newPhase?: MatchLocationPhase): void => {
            if (newPhase && newPhase !== this.myLocationPhase$.value) this.myLocationPhase$.next(newPhase);
        };

        const triggers = new TriggerConditions<MatchLocationPhase, [OWInfoUpdates2Event?, boolean?]>("MatchLocationPhase", {
            [MatchLocationPhase.Dropship]: (infoUpdate, isMatchReset) => !!isMatchReset && !this.myStartingCoordinates$.value,
            [MatchLocationPhase.Dropping]: (infoUpdate) =>
                this.myLocationPhase$.value === MatchLocationPhase.Dropship &&
                infoUpdate?.feature === "location" &&
                (infoUpdate.info.match_info?.location?.z ?? Infinity) < (this.myStartingCoordinates$.value?.z ?? -Infinity),
            [MatchLocationPhase.HasLanded]: () =>
                this.myLocationPhase$.value === MatchLocationPhase.Dropping && !!this.myLandingCoordinates$.value,
        });

        this.overwolfGameData.infoUpdates$.pipe(takeUntil(this._unsubscribe$)).subscribe((infoUpdate) => {
            const newPhase = triggers.triggeredFirstKey(infoUpdate, false);
            setNewLocationPhaseFn(newPhase);
        });

        this.match.startedEvent$.pipe(takeUntil(this._unsubscribe$)).subscribe(() => {
            const newPhase = triggers.triggeredFirstKey(undefined, true);
            setNewLocationPhaseFn(newPhase);
        });
    }

    private setupMyStartingCoordinates(): void {
        this.myCoordinates$
            .pipe(
                takeUntil(this._unsubscribe$),
                filter(() => !this.myStartingCoordinates$.value),
                filter((coord) => !!coord && isFinite(coord.x) && isFinite(coord.y) && isFinite(coord.z))
            )
            .subscribe((coord) => this.myStartingCoordinates$.next(coord));
    }

    private setupMyEndingCoordinates(): void {
        this.match.endedEvent$
            .pipe(
                takeUntil(this._unsubscribe$),
                filter(() => !!this.myStartingCoordinates$.value && !this.myEndingCoordinates$.value),
                map(() => this.myCoordinates$.value),
                filter((coord) => !!coord && isFinite(coord.x) && isFinite(coord.y) && isFinite(coord.z)),
                filter((coord) => !!coord && coord.z < (this.myStartingCoordinates$.value?.z ?? -Infinity))
            )
            .subscribe((coord) => this.myEndingCoordinates$.next(coord));
    }

    private setupMyLandingCoordinates(): void {
        this.playerInventory.myInUseItem$
            .pipe(
                takeUntil(this._unsubscribe$),
                filter((inUse) => !!inUse),
                map(() => this.myCoordinates$.value),
                filter(() => !this.myLandingCoordinates$.value),
                filter((coord) => !!coord && isFinite(coord.x) && isFinite(coord.y) && isFinite(coord.z))
            )
            .subscribe((coord) => this.myLandingCoordinates$.next(coord));
    }
}

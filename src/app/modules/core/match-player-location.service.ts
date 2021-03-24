import { Injectable, OnDestroy } from "@angular/core";
import { MatchMapCoordinates } from "@common/match/match-map-coordinates";
import { TriggerConditions } from "@common/trigger-conditions";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { cleanInt } from "src/utilities/number";
import { MatchLocationPhase } from "../../common/match/match-location";
import { MatchPlayerInventoryService } from "./match-player-inventory.service";
import { MatchService } from "./match.service";
import { OverwolfDataProviderService, OWInfoUpdates2Event } from "./overwolf-data-provider";

@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfDataProviderService, MatchPlayerInventoryService],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("MatchPlayerLocationService", MatchPlayerLocationService, deps),
})
export class MatchPlayerLocationService implements OnDestroy {
    public readonly myCoordinates$ = new BehaviorSubject<Optional<MatchMapCoordinates>>(undefined);
    public readonly myLocationPhase$ = new BehaviorSubject<Optional<MatchLocationPhase>>(undefined);
    public readonly myStartingCoordinates$ = new BehaviorSubject<Optional<MatchMapCoordinates>>(undefined);
    public readonly myLandingCoordinates$ = new BehaviorSubject<Optional<MatchMapCoordinates>>(undefined);
    public readonly myEndingCoordinates$ = new BehaviorSubject<Optional<MatchMapCoordinates>>(undefined);

    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly match: MatchService,
        private readonly overwolf: OverwolfDataProviderService,
        private readonly playerInventory: MatchPlayerInventoryService
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
        this.match.startedEvent$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
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
                const newCoords: MatchMapCoordinates = {
                    x: cleanInt(coord?.x),
                    y: cleanInt(coord?.y),
                    z: cleanInt(coord?.z),
                };
                if (!isFinite(newCoords.x) || !isFinite(newCoords.y) || !isFinite(newCoords.z)) return;
                this.myCoordinates$.next(newCoords);
            });
    }
    //#endregion

    //#region Location Phase
    private setupMyLocationPhase(): void {
        const setNewLocationPhaseFn = (newPhase?: MatchLocationPhase): void => {
            if (newPhase && newPhase !== this.myLocationPhase$.value) this.myLocationPhase$.next(newPhase);
        };

        const triggers = new TriggerConditions<MatchLocationPhase, [OWInfoUpdates2Event?, boolean?]>({
            [MatchLocationPhase.Dropship]: (infoUpdate, isMatchReset) =>
                !!isMatchReset && !this.myStartingCoordinates$.value,
            [MatchLocationPhase.Dropping]: (infoUpdate) =>
                this.myLocationPhase$.value === MatchLocationPhase.Dropship &&
                infoUpdate?.feature === "location" &&
                (infoUpdate.info.match_info?.location?.z ?? Infinity) <
                    (this.myStartingCoordinates$.value?.z ?? -Infinity),
            [MatchLocationPhase.HasLanded]: () =>
                this.myLocationPhase$.value === MatchLocationPhase.Dropping && !!this.myLandingCoordinates$.value,
        });

        this.overwolf.infoUpdates$.pipe(takeUntil(this._unsubscribe)).subscribe((infoUpdate) => {
            const newStatus = triggers.triggeredFirstKey(infoUpdate, false);
            setNewLocationPhaseFn(newStatus);
        });

        this.match.startedEvent$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
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

        this.match.endedEvent$
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

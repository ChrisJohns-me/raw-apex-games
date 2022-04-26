import { MatchGameModeGenericId } from "@allfather-app/app/common/match/game-mode/game-mode.enum";
import { MatchLocationPhase } from "@allfather-app/app/common/match/location";
import { MatchMapCoordinates } from "@allfather-app/app/common/match/map/map-coordinates";
import { PlayerState } from "@allfather-app/app/common/player-state";
import { TriggerConditions } from "@allfather-app/app/common/utilities/trigger-conditions";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { cleanInt } from "common/utilities/";
import { BehaviorSubject } from "rxjs";
import { bufferCount, filter, map, takeUntil } from "rxjs/operators";
import { BaseService } from "../base-service.abstract";
import { OverwolfGameDataService, OWInfoUpdates2Event } from "../overwolf";
import { MatchPlayerInflictionService } from "./match-player-infliction.service";
import { MatchPlayerInventoryService } from "./match-player-inventory.service";
import { MatchPlayerLegendService } from "./match-player-legend.service";
import { MatchPlayerService } from "./match-player.service";
import { MatchService } from "./match.service";

@Injectable({
    providedIn: "root",
    deps: [
        MatchService,
        MatchPlayerService,
        MatchPlayerInflictionService,
        MatchPlayerLegendService,
        OverwolfGameDataService,
        MatchPlayerInventoryService,
    ],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchPlayerLocationService", MatchPlayerLocationService, deps),
})
export class MatchPlayerLocationService extends BaseService {
    /** Based on internal triggers. Emits new data only when match is started. Cleared on match start. */
    public readonly myLocationPhase$ = new BehaviorSubject<Optional<MatchLocationPhase>>(undefined);
    /** Local player's match start position. Emits new data only when match is started. Cleared on match start. */
    public readonly myStartingCoordinates$ = new BehaviorSubject<Optional<MatchMapCoordinates>>(undefined);
    /** Location data straight from Overwolf. Emits new data only when match is started. Cleared on match start. */
    public readonly myCoordinates$ = new BehaviorSubject<Optional<MatchMapCoordinates>>(undefined);
    /** Local player's landing location. Inferred by "inUse":"Melee". Emits new data only when match is started. Cleared on match start. */
    public readonly myLandingCoordinates$ = new BehaviorSubject<Optional<MatchMapCoordinates>>(undefined);
    /** Emits coordinates only when local user has died. Cleared on match start. */
    public readonly myDeathCoordinates$ = new BehaviorSubject<Optional<MatchMapCoordinates>>(undefined);
    /** Emits coordinates only when local user eliminates an enemy. Cleared on match start. */
    public readonly myEliminationCoordinates$ = new BehaviorSubject<Optional<MatchMapCoordinates>>(undefined);
    /** Last known local player when match ends. Emits new data only when match has ended. Cleared on match start. */
    public readonly myEndingCoordinates$ = new BehaviorSubject<Optional<MatchMapCoordinates>>(undefined);

    private isMatchStarted = false;

    constructor(
        private readonly match: MatchService,
        private readonly matchPlayer: MatchPlayerService,
        private readonly matchPlayerInfliction: MatchPlayerInflictionService,
        private readonly matchPlayerLegend: MatchPlayerLegendService,
        private readonly overwolfGameData: OverwolfGameDataService,
        private readonly playerInventory: MatchPlayerInventoryService
    ) {
        super();
        this.setupMatchStateEvents();
        this.setupMyLocationPhase();
        this.setupMyStartingCoordinates();
        this.setupMyCoordinates();
        this.setupMyLandingCoordinates();
        this.setupMyDeathCoordinates();
        this.setupMyEliminationCoordinates();
        this.setupMyEndingCoordinates();
    }

    private setupMatchStateEvents(): void {
        this.match.startedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.myLocationPhase$.next(undefined);
            this.myStartingCoordinates$.next(undefined);
            this.myCoordinates$.next(undefined);
            this.myLandingCoordinates$.next(undefined);
            this.myDeathCoordinates$.next(undefined);
            this.myEliminationCoordinates$.next(undefined);
            this.myEndingCoordinates$.next(undefined);
            this.isMatchStarted = true;
        });
        this.match.endedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.isMatchStarted = false;
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
                (this.myLocationPhase$.value === MatchLocationPhase.Dropping && !!this.myLandingCoordinates$.value) ||
                this.match.gameMode$.value?.gameModeGenericId === MatchGameModeGenericId.Training ||
                this.match.gameMode$.value?.gameModeGenericId === MatchGameModeGenericId.FiringRange,
        });

        this.overwolfGameData.infoUpdates$.pipe(takeUntil(this.destroy$)).subscribe((infoUpdate) => {
            const newPhase = triggers.triggeredFirstKey(infoUpdate, false);
            setNewLocationPhaseFn(newPhase);
        });

        this.match.startedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            const newPhase = triggers.triggeredFirstKey(undefined, true);
            setNewLocationPhaseFn(newPhase);
        });
    }

    private setupMyCoordinates(): void {
        this.overwolfGameData.infoUpdates$
            .pipe(
                takeUntil(this.destroy$),
                filter((infoUpdate) => infoUpdate.feature === "location" && !!infoUpdate.info.match_info?.location),
                map((infoUpdate) => infoUpdate.info.match_info?.location),
                filter(() => this.isMatchStarted)
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

    private setupMyStartingCoordinates(): void {
        this.myCoordinates$
            .pipe(
                takeUntil(this.destroy$),
                filter(() => !this.myStartingCoordinates$.value),
                filter((coord) => !!coord && isFinite(coord.x) && isFinite(coord.y) && isFinite(coord.z)),
                filter(() => this.isMatchStarted)
            )
            .subscribe((coord) => this.myStartingCoordinates$.next(coord));
    }

    /** Detects when local player has landed by a stagnant location. */
    private setupMyLandingCoordinates(): void {
        this._setupMyLandingCoordinatesByUltimateCooldown();
        // this._setupMyLandingCoordinatesByFirstInventory();
        // this._setupMyLandingCoordinatesByLocationStagnation();
    }

    private setupMyDeathCoordinates(): void {
        this.matchPlayer.myState$
            .pipe(
                takeUntil(this.destroy$),
                filter((playerState) => playerState === PlayerState.Eliminated),
                map(() => this.myCoordinates$.value)
            )
            .subscribe((deathCoordinates) => this.myDeathCoordinates$.next(deathCoordinates));
    }

    private setupMyEliminationCoordinates(): void {
        this.matchPlayerInfliction.myEliminationEvent$
            .pipe(
                takeUntil(this.destroy$),
                map(() => this.myCoordinates$.value)
            )
            .subscribe((eliminationCoordinates) => this.myEliminationCoordinates$.next(eliminationCoordinates));
    }

    private setupMyEndingCoordinates(): void {
        this.match.endedEvent$
            .pipe(
                takeUntil(this.destroy$),
                filter(() => !!this.myStartingCoordinates$.value && !this.myEndingCoordinates$.value),
                map(() => this.myCoordinates$.value),
                filter((coord) => !!coord && isFinite(coord.x) && isFinite(coord.y) && isFinite(coord.z)),
                filter((coord) => !!coord && coord.z < (this.myStartingCoordinates$.value?.z ?? -Infinity)),
                filter(() => this.isMatchStarted)
            )
            .subscribe((coord) => this.myEndingCoordinates$.next(coord));
    }

    //#region Different Landing Detection Methods
    private _setupMyLandingCoordinatesByUltimateCooldown(): void {
        const ULTIMATE_COOLDOWN_TRIGGER = 0;
        this.matchPlayerLegend.myUltimateCooldown$
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.myLocationPhase$.value === MatchLocationPhase.Dropping),
                filter((ultimateCooldown) => ultimateCooldown <= ULTIMATE_COOLDOWN_TRIGGER),
                map(() => this.myCoordinates$.value),
                filter(() => !this.myLandingCoordinates$.value),
                filter((coord) => !!coord && isFinite(coord.x) && isFinite(coord.y) && isFinite(coord.z))
            )
            .subscribe((coord) => {
                this.myLandingCoordinates$.next(coord);
            });
    }

    private _setupMyLandingCoordinatesByFirstInventory(): void {
        this.playerInventory.myInUseItem$
            .pipe(
                takeUntil(this.destroy$),
                filter((inUse) => !!inUse),
                map(() => this.myCoordinates$.value),
                filter(() => !this.myLandingCoordinates$.value),
                filter((coord) => !!coord && isFinite(coord.x) && isFinite(coord.y) && isFinite(coord.z)),
                filter(() => this.isMatchStarted)
            )
            .subscribe((coord) => this.myLandingCoordinates$.next(coord));
    }

    private _setupMyLandingCoordinatesByLocationStagnation(): void {
        const LANDING_Z_TRIGGER = 5;
        this.myCoordinates$
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.myLocationPhase$.value === MatchLocationPhase.Dropping),
                filter(() => !this.myLandingCoordinates$.value),
                filter((coord) => !!coord && isFinite(coord.x) && isFinite(coord.y) && isFinite(coord.z)),
                bufferCount(2, 5) // bufferSize = 2, startBufferEvery = 5 (coordinate updates)
            )
            .subscribe(([previousCoords, latestCoords]) => {
                if (!previousCoords || !latestCoords) return;
                const zDiff = Math.abs(latestCoords.z - previousCoords.z);
                if (zDiff <= LANDING_Z_TRIGGER) {
                    this.myLandingCoordinates$.next(latestCoords);
                }
            });
    }
    //#endregion
}

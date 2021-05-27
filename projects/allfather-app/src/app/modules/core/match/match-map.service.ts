import { MatchGameModeType } from "@allfather-app/app/common/match/game-mode";
import { MatchMapList } from "@allfather-app/app/common/match/map/map-list";
import { findSoonestMapRotationInfo, MapRotation, MapRotationInfo } from "@allfather-app/app/common/match/map/map-rotation";
import { MatchMapFriendlyName, MatchMapGenericId } from "@allfather-app/app/common/match/map/map.enum";
import { MatchMap } from "@allfather-app/app/common/match/map/match-map";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { addMinutes } from "date-fns";
import { BehaviorSubject, combineLatest, Observable, of, throwError, timer } from "rxjs";
import { delay, filter, map, mergeMap, retryWhen, switchMap, takeUntil, tap } from "rxjs/operators";
import { isEmpty } from "shared/utilities";
import { AllfatherService } from "../allfather-service.abstract";
import { GameProcessService } from "../game-process.service";
import { MatchMapRotationMozambiquehereDTO } from "./match-map-rotation-mozambiquehere-dto";
import { MatchPlayerLocationService } from "./match-player-location.service";
import { MatchService } from "./match.service";

const TEMP_MAP_METHOD: "gamemode" | "zlocation" = "gamemode";
const API_URL = "https://api.mozambiquehe.re/maprotation";
const API_KEY = "8J4oHb78a1It2tGVBjg2";
const API_VER = 2;

const MAX_RETRY_COUNT = 3;
const RETRY_MULTIPLIER = 5000;

/**
 * @todo Complete conversion to API driven
 */
@Injectable({
    providedIn: "root",
    deps: [GameProcessService, HttpClient, MatchService, MatchPlayerLocationService],
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

    /**
     * Auto-updated
     */
    public readonly mapRotation$ = new BehaviorSubject<Optional<MapRotation>>(undefined);

    private mapRotationExpire?: Date;

    constructor(
        private readonly gameProcess: GameProcessService,
        private readonly http: HttpClient,
        private readonly match: MatchService,
        private readonly matchPlayerLocation: MatchPlayerLocationService
    ) {
        super();
        if (TEMP_MAP_METHOD === "zlocation") {
            this.setupMapFromZLocation();
        } else if (TEMP_MAP_METHOD === "gamemode") {
            console.debug(`[${this.constructor.name}] Setting up map via GAMEMODE type`);
            this.setupAutoMapRotation();
        }
    }

    public getCurrentMap(gameModeType: MatchGameModeType): Optional<MatchMap> {
        const now = new Date();
        const currInfo = this.mapRotationInfo(this.mapRotation$.value, "current", gameModeType);
        const nextInfo = this.mapRotationInfo(this.mapRotation$.value, "next", gameModeType);

        if (currInfo?.matchMap) {
            if ((currInfo.endDate ?? 0) > now) {
                return currInfo.matchMap;
            } else if (nextInfo?.matchMap && (nextInfo?.endDate ?? 0) > now) {
                console.log(
                    `[${this.constructor.name}] Current Map Rotation for "${gameModeType}" is expired; using next map instead: "${nextInfo?.friendlyName}".`
                );
                return nextInfo?.matchMap;
            } else {
                console.log(`[${this.constructor.name}] Current Map Rotation for "${gameModeType}" is expired; next map is also expired.`);
                return;
            }
        }
        return;
    }

    public getNextMap(gameModeType: MatchGameModeType): Optional<MatchMap> {
        return this.mapRotationInfo(this.mapRotation$.value, "next", gameModeType)?.matchMap;
    }

    /**
     * Retrieves map rotation data from API if data is expired.
     * Otherwise, returns existing data.
     */
    public getMapRotation$(breakCache = false): Observable<MapRotation> {
        const isExpired = new Date() > (this.mapRotationExpire ?? 0);
        if (this.mapRotation$.value && (breakCache || isExpired)) return of(this.mapRotation$.value);

        return this.http.get(API_URL, { params: { version: API_VER, auth: API_KEY }, responseType: "json" }).pipe(
            tap((response) => console.debug(`[${this.constructor.name}] getMapRotation got response: `, response)),
            map((mapRotationJSON) => new MatchMapRotationMozambiquehereDTO(mapRotationJSON)),
            tap((dto) => console.debug(`[${this.constructor.name}] getMapRotation converted response to DTO class`, dto)),
            map((mapRotationDTO) => mapRotationDTO.toMapRotation()),
            tap((custom) =>
                console.debug(`[${this.constructor.name}] getMapRotation converted DTO class to Custom Map Rotation class`, custom)
            ),
            tap((mapRotation) => this.updateMapRotationExpire(mapRotation)),
            retryWhen((errors) => this.mapRotationRetry$(errors))
        );
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

    /**
     * Auto-retrieves map rotation data based on GameMode.
     * Only if game process is started.
     */
    private setupAutoMapRotation(): void {
        timer(0, 5 * 1000 * 60)
            .pipe(
                tap(() => console.debug(`[${this.constructor.name}] setupAutoMapRotation Running Map Rotation check...`)),
                takeUntil(this.destroy$),
                switchMap(() => combineLatest([this.gameProcess.isRunning$, this.match.gameMode$])),
                tap(([isRunning, gameMode]) =>
                    console.debug(`[${this.constructor.name}] setupAutoMapRotation Game is Running: ${isRunning}; Game Mode: ${gameMode}`)
                ),
                filter(([isRunning, gameMode]) => !!isRunning && !!gameMode?.baseType),
                switchMap(([, gameMode]) => combineLatest([this.getMapRotation$(), of(gameMode!)]))
            )
            .subscribe(([mapRotation, gameMode]) => {
                console.debug(`[${this.constructor.name}] setupAutoMapRotation Got Map Rotation Data`, mapRotation, gameMode);
                this.mapRotationInfo(mapRotation, "current", gameMode.baseType!);
            });
    }

    /**
     * Allow cache to be broken within a few minutes after any map changing
     */
    private updateMapRotationExpire(mapRotation: MapRotation): void {
        const defaultExpireMin = 10;
        const soonestMapInfo = findSoonestMapRotationInfo(mapRotation);
        if (!soonestMapInfo?.endDate) console.warn(`[${this.constructor.name}] While updating map rotation expiration, no map had .`);
        const soonestMapEndDateMs = soonestMapInfo?.endDate ?? addMinutes(new Date(), defaultExpireMin - 1); // Default to every x minutes
        const newMapRotationExpire = addMinutes(soonestMapEndDateMs, 1); // Refresh after any map has expired

        console.debug(`[${this.constructor.name}] Time now : ${new Date()}; Earliest MapInfo Date calc'd : ${soonestMapInfo?.endDate}`);
        this.mapRotationExpire = newMapRotationExpire;
        console.debug(`[${this.constructor.name}] New mapRotationExpire : ${this.mapRotationExpire}`);
    }

    private mapRotationInfo(
        mapRotation: Optional<MapRotation>,
        iteration: "next" | "current",
        gameModeType: MatchGameModeType
    ): Optional<MapRotationInfo> {
        if (gameModeType === MatchGameModeType.Arenas) {
            if (iteration === "current") return mapRotation?.arenasPubs?.current;
            if (iteration === "next") return mapRotation?.arenasPubs?.next;
        } else if (gameModeType === MatchGameModeType.BattleRoyale_Duos || gameModeType === MatchGameModeType.BattleRoyale_Trios) {
            if (iteration === "current") return mapRotation?.arenasPubs?.current;
            if (iteration === "next") return mapRotation?.arenasPubs?.next;
        } else if (gameModeType === MatchGameModeType.BattleRoyale_Ranked) {
            if (iteration === "current") return mapRotation?.arenasPubs?.current;
            if (iteration === "next") return mapRotation?.arenasPubs?.next;
        } else if (gameModeType === MatchGameModeType.FiringRange || gameModeType === MatchGameModeType.Training) {
            const firingRangeMap = MatchMapList.find((m) => m.genericId === MatchMapGenericId.FiringRange);
            return {
                friendlyName: MatchMapFriendlyName.FiringRange,
                matchMap: firingRangeMap,
            };
        }
        return;
    }

    private mapRotationRetry$(errors: Observable<any>): Observable<any> {
        return errors.pipe(
            mergeMap((error, i) => {
                const retryAttempt = i + 1;
                if (retryAttempt >= MAX_RETRY_COUNT) {
                    return throwError(error);
                }
                console.warn(
                    `[${this.constructor.name}] Unable to get mozambiquehe.re API map rotation. Retrying...(#${retryAttempt})\n` +
                        `Error: ${error?.message ?? JSON.stringify(error)}`
                );
                const delayMs = retryAttempt * RETRY_MULTIPLIER;
                return of(error).pipe(delay(delayMs));
            })
        );
    }
}

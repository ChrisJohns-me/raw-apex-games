import { MatchGameModeGenericId } from "@allfather-app/app/common/match/game-mode/game-mode.enum";
import { MatchMapList } from "@allfather-app/app/common/match/map/map-list";
import { MapRotationData, MapRotationInfo } from "@allfather-app/app/common/match/map/map-rotation-data";
import { MatchMapFriendlyName, MatchMapGenericId } from "@allfather-app/app/common/match/map/map.enum";
import { MatchMap } from "@allfather-app/app/common/match/map/match-map";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { addMinutes } from "date-fns";
import { BehaviorSubject, combineLatest, Observable, of, throwError, timer } from "rxjs";
import { delay, filter, map, mergeMap, retryWhen, switchMap, takeUntil, tap } from "rxjs/operators";
import { AllfatherService } from "../allfather-service.abstract";
import { GameProcessService } from "../game-process.service";
import { MatchService } from "../match/match.service";
import { MapRotationMozambiquehereDTO } from "./map-rotation-mozambiquehere-dto";

const API_URL = "https://api.mozambiquehe.re/maprotation";
const API_KEY = "8J4oHb78a1It2tGVBjg2";
const API_VER = 2;

const MAX_RETRY_COUNT = 3;
const RETRY_MULTIPLIER = 5000;

/**
 * @class MapRotationService
 * @classdesc Retrieves current and next map data.
 * Auto-retrieves when Game Process is running or every several minutes
 */
@Injectable({
    providedIn: "root",
    deps: [GameProcessService, HttpClient, MatchService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MapRotationService", MapRotationService, deps),
})
export class MapRotationService extends AllfatherService {
    public readonly mapRotation$ = new BehaviorSubject<Optional<MapRotationData>>(undefined);

    private cacheMapRotationExpire?: Date;

    constructor(private readonly gameProcess: GameProcessService, private readonly http: HttpClient, private readonly match: MatchService) {
        super();
        this.setupAutoMapRotation();
    }

    public getCurrentMapFromGameMode(gameModeType: MatchGameModeGenericId): Optional<MatchMap> {
        const now = new Date();
        const currInfo = this.mapRotationInfo(this.mapRotation$.value, "current", gameModeType);
        const nextInfo = this.mapRotationInfo(this.mapRotation$.value, "next", gameModeType);

        if (currInfo?.matchMap) {
            if (!currInfo.startDate && !currInfo.endDate && !nextInfo?.startDate && !nextInfo?.endDate) {
                // Game Mode from map rotation does not have or use start/end dates
                return currInfo.matchMap;
            } else if ((currInfo.endDate ?? 0) > now) {
                return currInfo.matchMap;
            } else if (nextInfo?.matchMap && (nextInfo?.endDate ?? 0) > now) {
                console.log(
                    `[${this.constructor.name}] Current Map Rotation for "${gameModeType}" is expired; using next map instead: "${nextInfo?.friendlyName}".`
                );
                return nextInfo?.matchMap;
            } else {
                console.warn(`[${this.constructor.name}] Current Map Rotation for "${gameModeType}" is expired; next map is also expired.`);
                return;
            }
        }
        return;
    }

    public getNextMap(gameModeType: MatchGameModeGenericId): Optional<MatchMap> {
        return this.mapRotationInfo(this.mapRotation$.value, "next", gameModeType)?.matchMap;
    }

    /**
     * Retrieves map rotation data from API if data is expired.
     * Otherwise, returns existing data.
     */
    public getMapRotation$(breakCache = false): Observable<MapRotationData> {
        const isExpired = new Date() > (this.cacheMapRotationExpire ?? 0);
        if (this.mapRotation$.value && (breakCache || isExpired)) return of(this.mapRotation$.value);

        return this.http.get(API_URL, { params: { version: API_VER, auth: API_KEY }, responseType: "json" }).pipe(
            map((mapRotationJSON) => new MapRotationMozambiquehereDTO(mapRotationJSON)),
            map((mapRotationDTO) => mapRotationDTO.toMapRotation()),
            tap((mapRotation) => {
                console.debug(`[${this.constructor.name}] Map Rotations`, mapRotation);
                this.mapRotation$.next(mapRotation);
                this.updateMapRotationExpire(mapRotation);
            }),
            retryWhen((errors) => this.mapRotationRetry$(errors))
        );
    }

    /**
     * Auto-retrieves map rotation data based on GameMode.
     * Only if game process is started.
     */
    private setupAutoMapRotation(): void {
        const updateMapRotationTime = 5 * 60 * 1000;
        timer(0, updateMapRotationTime)
            .pipe(
                tap(() => console.debug(`[${this.constructor.name}] setupAutoMapRotation Running Map Rotation check...`)),
                takeUntil(this.destroy$),
                switchMap(() => combineLatest([this.gameProcess.isRunning$, this.match.gameMode$])),
                tap(([isRunning, gameMode]) =>
                    console.debug(`[${this.constructor.name}] setupAutoMapRotation Game is Running: ${isRunning}; Game Mode: ${gameMode}`)
                ),
                filter(([isRunning, gameMode]) => !!isRunning && !!gameMode?.gameModeGenericId),
                switchMap(([, gameMode]) => combineLatest([this.getMapRotation$(), of(gameMode!)]))
            )
            .subscribe(([mapRotation, gameMode]) => {
                console.debug(`[${this.constructor.name}] setupAutoMapRotation Got Map Rotation Data`, mapRotation, gameMode);
                this.mapRotationInfo(mapRotation, "current", gameMode.gameModeGenericId!);
            });
    }

    /**
     * Allow cache to be broken within a few minutes after any map changing
     */
    private updateMapRotationExpire(mapRotation: MapRotationData): void {
        const defaultExpireMin = 10;
        const soonestMapInfo = MapRotationData.getSoonestMapRotationInfo(mapRotation);
        if (!soonestMapInfo?.endDate) console.warn(`[${this.constructor.name}] While updating map rotation expiration, no map had .`);
        const soonestMapEndDate = soonestMapInfo?.endDate ?? addMinutes(new Date(), defaultExpireMin - 1); // Default to every x minutes
        const newMapRotationExpire = addMinutes(soonestMapEndDate, 1); // Refresh after any map has expired

        console.debug(`[${this.constructor.name}] Time now : ${new Date()}; Earliest MapInfo Date calc'd : ${soonestMapInfo?.endDate}`);
        this.cacheMapRotationExpire = newMapRotationExpire;
        console.debug(`[${this.constructor.name}] New mapRotationExpire : ${this.cacheMapRotationExpire}`);
    }

    private mapRotationInfo(
        mapRotation: Optional<MapRotationData>,
        iteration: "next" | "current",
        gameModeType: MatchGameModeGenericId
    ): Optional<MapRotationInfo> {
        if (gameModeType === MatchGameModeGenericId.Arenas) {
            if (iteration === "current") return mapRotation?.arenasPubs?.current;
            if (iteration === "next") return mapRotation?.arenasPubs?.next;
        } else if (
            gameModeType === MatchGameModeGenericId.BattleRoyale_Duos ||
            gameModeType === MatchGameModeGenericId.BattleRoyale_Trios
        ) {
            if (iteration === "current") return mapRotation?.battleRoyalePubs?.current;
            if (iteration === "next") return mapRotation?.battleRoyalePubs?.next;
        } else if (gameModeType === MatchGameModeGenericId.BattleRoyale_Ranked) {
            if (iteration === "current") return mapRotation?.battleRoyaleRanked?.current;
            if (iteration === "next") return mapRotation?.battleRoyaleRanked?.next;
        } else if (gameModeType === MatchGameModeGenericId.FiringRange || gameModeType === MatchGameModeGenericId.Training) {
            const firingRangeMap = MatchMapList.find((m) => m.mapGenericId === MatchMapGenericId.FiringRange);
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

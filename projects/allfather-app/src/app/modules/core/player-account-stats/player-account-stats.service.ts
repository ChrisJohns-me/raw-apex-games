import { PlayerAccountStats } from "@allfather-app/app/common/player-account-stats";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { addMilliseconds } from "date-fns";
import { Observable, of, throwError } from "rxjs";
import { delay, map, mergeMap, retryWhen, tap } from "rxjs/operators";
import { AllfatherService } from "../allfather-service.abstract";
import { MozambiqueherePlatform, PlayerAccountStatsMozambiquehereDTO } from "./player-account-stats-mozambiquehere-dto";

const API_URL = "https://api.mozambiquehe.re/bridge";
const API_KEY = "8J4oHb78a1It2tGVBjg2";
const API_VER = 5;
const API_PLT = MozambiqueherePlatform.PC;

const MAX_RETRY_COUNT = 3;
const RETRY_MULTIPLIER = 5000;
const CACHE_EXPIRE = 30 * 1000;

/**
 * @class PlayerAccountStatsService
 * @classdesc Player's match statistics from external sources
 */
@Injectable({
    providedIn: "root",
    deps: [HttpClient],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("PlayerAccountStatsService", PlayerAccountStatsService, deps),
})
export class PlayerAccountStatsService extends AllfatherService {
    private cachePlayerAccountStatsExpire?: Date;
    private cachePlayerAccountStats?: PlayerAccountStats;

    constructor(private readonly http: HttpClient) {
        super();
    }

    public clearCache(): void {
        this.cachePlayerAccountStatsExpire = undefined;
        this.cachePlayerAccountStats = undefined;
    }

    /**
     * @todo Still needs testing
     */
    public getBulkPlayerAccountStats$(playerNames: string[], platform: MozambiqueherePlatform): Observable<PlayerAccountStats[]> {
        const players = playerNames.join();
        return this.http
            .get(API_URL, { params: { version: API_VER, auth: API_KEY, platform, player: players }, responseType: "json" })
            .pipe(
                tap((response) => console.debug(`[${this.constructor.name}] getBulkPlayerAccountStats got response: `, response)),
                map((playerAccountStatsListJSON) => {
                    if (!Array.isArray(playerAccountStatsListJSON)) throw Error(`getBulkPlayerAccountStats API returned a non-array`);
                    return playerAccountStatsListJSON.map((accountStatsJSON) => {
                        const accountStats = new PlayerAccountStatsMozambiquehereDTO(accountStatsJSON);
                        return accountStats.toPlayerAccountStats();
                    });
                }),
                tap((custom) =>
                    console.debug(
                        `[${this.constructor.name}] getBulkPlayerAccountStats converted DTO class to array of Custom Player Account Stats classes`,
                        custom
                    )
                ),
                retryWhen((errors) => this.getPlayerAccountStatsRetry$(errors))
            );
    }

    /**
     * Retrieves external player stats from API.
     */
    public getPlayerAccountStats$(
        playerName: string,
        platform: MozambiqueherePlatform,
        breakCache = false
    ): Observable<PlayerAccountStats> {
        const isExpired = new Date() > (this.cachePlayerAccountStatsExpire ?? 0);
        if (!breakCache && !isExpired && this.cachePlayerAccountStats) {
            console.debug(`[${this.constructor.name}] Using cache for Player Account Stats`);
            return of(this.cachePlayerAccountStats);
        }

        return this.http
            .get(API_URL, { params: { version: API_VER, auth: API_KEY, platform, player: playerName }, responseType: "json" })
            .pipe(
                tap((response) => console.debug(`[${this.constructor.name}] getPlayerAccountStats got response: `, response)),
                map((playerAccountStatsJSON) => new PlayerAccountStatsMozambiquehereDTO(playerAccountStatsJSON)),
                tap((dto) => console.debug(`[${this.constructor.name}] getPlayerAccountStats converted response to DTO class`, dto)),
                map((playerAccountStatsDTO) => playerAccountStatsDTO.toPlayerAccountStats()),
                tap((playerAccountStats) => {
                    console.debug(
                        `[${this.constructor.name}] getPlayerAccountStats converted DTO class to Custom Player Account Stats class`,
                        playerAccountStats
                    );
                    this.cachePlayerAccountStats = playerAccountStats;
                    this.cachePlayerAccountStatsExpire = addMilliseconds(new Date(), CACHE_EXPIRE);
                }),
                retryWhen((errors) => this.getPlayerAccountStatsRetry$(errors))
            );
    }

    private getPlayerAccountStatsRetry$(errors: Observable<any>): Observable<any> {
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

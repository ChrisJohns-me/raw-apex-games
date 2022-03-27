import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { unique } from "common/utilities/primitives/array";
import { addMilliseconds } from "date-fns";
import { merge, Observable, of, throwError } from "rxjs";
import { bufferCount, delay, filter, map, mergeMap, retryWhen, tap } from "rxjs/operators";
import { PlayerAccountStats } from "../../player-account-stats";
import { BaseService } from "../base-service.abstract";
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
export class PlayerAccountStatsService extends BaseService {
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
     * @todo Last WIP in dashboardPage
     * Creates different API calls for each platform in use found in the provided players list.
     * @returns PlayerAccountStats[] after all API calls have resolved.
     */
    public getBulkPlayerAccountStats$(
        players: Array<{ playerName: string; platform: MozambiqueherePlatform }>
    ): Observable<PlayerAccountStats[]> {
        const platforms = unique(players, (p) => p.platform).map((p) => p.platform);
        const getPlayerAccountStatsAPICallFn$ = (platform: MozambiqueherePlatform, players: string[]): Observable<PlayerAccountStats[]> => {
            const params = { version: API_VER, auth: API_KEY, platform: platform, player: players.join() };
            return this.http.get(API_URL, { params, responseType: "json" }).pipe(
                map((playerAccountStatsListJSON): PlayerAccountStats[] => {
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
        };

        const getPlatformPlayersFn = (
            players: { playerName: string; platform: MozambiqueherePlatform }[],
            platform: MozambiqueherePlatform
        ): string[] => players.filter((p) => p.platform === platform).map((p) => p.playerName);

        return merge(
            ...platforms.map((platform) => getPlayerAccountStatsAPICallFn$(platform, getPlatformPlayersFn(players, platform)))
        ).pipe(
            tap((result) => console.log(`Result 1:`, result)),
            bufferCount(platforms.length),
            tap((result) => console.log(`Result 2:`, result)),
            map((resultArr: PlayerAccountStats[][]): PlayerAccountStats[] => ([] as PlayerAccountStats[]).concat(...resultArr)),
            tap((result) => console.log(`Result 3:`, result))
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
                map((response) => this.createPlayerAccountStatsFromJSON(playerName, platform, response)),
                filter((playerAccountStats) => !!playerAccountStats),
                map((playerAccountStats) => playerAccountStats as PlayerAccountStats),
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

    private createPlayerAccountStatsFromJSON(
        playerName: string,
        platform: MozambiqueherePlatform,
        playerAccountStatsJSON: unknown
    ): Optional<PlayerAccountStats> {
        try {
            console.debug(`[${this.constructor.name}] createPlayerAccountStatsFromJSON`, playerAccountStatsJSON);
            const playerAccountStatsDTO = new PlayerAccountStatsMozambiquehereDTO(playerAccountStatsJSON);
            const playerAccountStats = playerAccountStatsDTO.toPlayerAccountStats();
            console.debug(`[${this.constructor.name}] Created Player Account Stats for "${playerName}" (${platform}):`, playerAccountStats);
            return playerAccountStats;
        } catch (error) {
            console.error(
                `[${this.constructor.name}] Error when attempting to create PlayerAccountStats for "${playerName}" (${platform}); "${error}"`
            );
            return;
        }
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

import { MatchGameModeList } from "#app/models/match/game-mode/game-mode-list.js";
import { MatchGameModeGenericId } from "#app/models/match/game-mode/game-mode.enum.js";
import { MatchGameMode } from "#app/models/match/game-mode/game-mode.js";
import { AvgMatchStats, avgStats, legendAvgStats } from "#app/models/utilities/match-stats.js";
import { BaseService } from "#app/modules/core/base-service.abstract.js";
import { ConfigurationService } from "#app/modules/core/configuration.service.js";
import { MatchService } from "#app/modules/core/match/match.service.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { Stopwatch } from "#shared/utilities/stopwatch.js";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { MatchDataStore } from "./local-database/match-data-store.js";

type LegendId = string;
type LegendIdAndGameModeGenericId = string;

/**
 * @class PlayerLocalStatsService
 * @classdesc Player's match statistics stored locally in the local database.
 */
@Injectable({
    providedIn: "root",
    deps: [ConfigurationService, MatchService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("PlayerLocalStatsService", PlayerLocalStatsService, deps),
})
export class PlayerLocalStatsService extends BaseService {
    private cachedPlayerStats?: AvgMatchStats;

    private cachedLegendStats = new Map<LegendId, AvgMatchStats>();
    private cachedLegendGameModeGenericStats = new Map<LegendIdAndGameModeGenericId, AvgMatchStats>();

    private watchdogTime = 500;

    constructor(private readonly configuration: ConfigurationService, private readonly match: MatchService) {
        super();
    }

    public clearPlayerCache(): void {
        this.cachedPlayerStats = undefined;
    }

    public clearLegendCache(): void {
        this.cachedLegendStats = new Map();
        this.cachedLegendGameModeGenericStats = new Map();
    }

    //#region Player
    public getPlayerStats$(limit?: number, breakCache = false): Observable<AvgMatchStats> {
        const cachedResult = this.cachedPlayerStats;
        if (!breakCache && cachedResult) return of(cachedResult);

        const stopwatch = new Stopwatch();
        stopwatch.start();
        return this.match.getAllMatchData$(limit).pipe(
            filter((matchList) => !!matchList && Array.isArray(matchList)),
            map((matchList) => avgStats(matchList as MatchDataStore[])),
            tap((avgStats) => {
                this.cachedPlayerStats = avgStats;
                stopwatch.stop();
                stopwatch.watchdog(this.watchdogTime, (time) => `"Player Stats Calculation (limit ${limit})" took ${time}ms`);
            })
        );
    }

    public getPlayerGameModeGenericStats$(
        gameModeGenericIds: MatchGameModeGenericId[],
        limit?: number,
        breakCache = false
    ): Observable<AvgMatchStats> {
        const cachedResult = this.cachedPlayerStats;
        if (!breakCache && cachedResult) return of(cachedResult);

        const stopwatch = new Stopwatch();
        stopwatch.start();
        return this.match.getAllMatchData$(limit).pipe(
            filter((matchList) => !!matchList && Array.isArray(matchList)),
            map((matchList) => this.filterMatchListByGameModes(matchList, gameModeGenericIds)),
            map((matchList) => avgStats(matchList as MatchDataStore[])),
            tap((avgStats) => {
                this.cachedPlayerStats = avgStats;
                stopwatch.stop();
                stopwatch.watchdog(this.watchdogTime, (time) => `"Player Stats Calculation (limit ${limit})" took ${time}ms`);
            })
        );
    }
    //#endregion

    //#region Legend
    public getLegendStats$(legendId: string, limit?: number, breakCache = false): Observable<AvgMatchStats> {
        const cachedResult = this.cachedLegendStats.get(legendId);
        if (!breakCache && cachedResult) return of(cachedResult);

        const stopwatch = new Stopwatch();
        stopwatch.start();
        return this.match.getMatchDataByLegendId$(legendId, limit).pipe(
            filter((matchList) => !!matchList && Array.isArray(matchList) && matchList.length > 0),
            map((matchList) => legendAvgStats(matchList as MatchDataStore[], legendId)),
            tap((avgStats) => {
                this.cachedLegendStats.set(legendId, avgStats);
                stopwatch.stop();
                stopwatch.watchdog(this.watchdogTime, (time) => `"Legend Stats '${legendId}' (limit ${limit})" took ${time}ms`);
            })
        );
    }

    public getLegendGameModeGenericStats$(
        legendId: string,
        gameModeGenericIds: MatchGameModeGenericId[],
        limit?: number,
        breakCache = false
    ): Observable<AvgMatchStats> {
        const cachedUniqueId = `${gameModeGenericIds.join("-")}-${legendId}`;
        const cachedResult = this.cachedLegendGameModeGenericStats.get(cachedUniqueId);
        if (!breakCache && cachedResult) return of(cachedResult);

        const stopwatch = new Stopwatch();
        stopwatch.start();
        return this.match.getMatchDataByLegendId$(legendId, limit).pipe(
            filter((matchList) => !!matchList && Array.isArray(matchList) && matchList.length > 0),
            map((matchList) => this.filterMatchListByGameModes(matchList, gameModeGenericIds)),
            map((matchList) => legendAvgStats(matchList as MatchDataStore[], legendId)),
            tap((avgStats) => {
                this.cachedLegendGameModeGenericStats.set(cachedUniqueId, avgStats);
                stopwatch.stop();
                stopwatch.watchdog(
                    this.watchdogTime,
                    (time) => `"Legend Stats '${legendId}' GameModeList '${gameModeGenericIds}' (limit ${limit})" took ${time}ms`
                );
            })
        );
    }
    //#endregion

    private filterMatchListByGameModes(matchList: MatchDataStore[], gameModeGenericIds: MatchGameModeGenericId[]): MatchDataStore[] {
        if (!matchList || !Array.isArray(matchList)) return [];

        return matchList
            .map((match) => {
                if (!match.gameModeId) return undefined;
                const gameMode = MatchGameMode.getFromId(MatchGameModeList, match.gameModeId);
                return gameModeGenericIds.includes(gameMode.gameModeGenericId) ? match : undefined;
            })
            .filter((match) => !!match) as MatchDataStore[];
    }
}

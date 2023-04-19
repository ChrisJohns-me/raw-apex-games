import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { Stopwatch } from "../../../../../../common/utilities/";
import { MatchGameMode } from "../../common/match/game-mode/game-mode";
import { MatchGameModeList } from "../../common/match/game-mode/game-mode-list";
import { MatchGameModeGenericId } from "../../common/match/game-mode/game-mode.enum";
import { AvgMatchStats, avgStats, legendAvgStats } from "../../common/utilities/match-stats";
import { SingletonServiceProviderFactory } from "../../singleton-service.provider.factory";
import { BaseService } from "./base-service.abstract";
import { ConfigurationService } from "./configuration.service";
import { MatchDataStore } from "./local-database/match-data-store";
import { MatchService } from "./match/match.service";

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

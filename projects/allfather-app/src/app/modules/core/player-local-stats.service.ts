import { MatchGameMode } from "@allfather-app/app/common/match/game-mode/game-mode";
import { MatchGameModeList } from "@allfather-app/app/common/match/game-mode/game-mode-list";
import { MatchGameModeGenericId } from "@allfather-app/app/common/match/game-mode/game-mode.enum";
import {
    AvgMatchStats,
    avgStats,
    complimentaryLegendsWeights,
    complimentaryWeaponsAvgEliminations,
    legendAvgStats,
} from "@allfather-app/app/common/utilities/match-stats";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { Stopwatch } from "common/utilities/";
import { combineLatest, Observable, of } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
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
    private cachedPlayerComplimentaryLegendWeights?: { legendId: string; weightScore: number }[];
    private cachedPlayerComplimentaryWeaponAvgEliminations?: { weaponId: string; avgEliminations: number }[];

    private cachedLegendStats = new Map<LegendId, AvgMatchStats>();
    private cachedLegendGameModeGenericStats = new Map<LegendIdAndGameModeGenericId, AvgMatchStats>();
    private cachedLegendComplimentaryLegendWeights = new Map<LegendId, { legendId: string; weightScore: number }[]>();
    private cachedLegendComplimentaryWeaponAvgEliminations = new Map<LegendId, { weaponId: string; avgEliminations: number }[]>();

    private watchdogTime = 500;

    constructor(private readonly configuration: ConfigurationService, private readonly match: MatchService) {
        super();
    }

    public clearPlayerCache(): void {
        this.cachedPlayerComplimentaryLegendWeights = undefined;
        this.cachedPlayerComplimentaryWeaponAvgEliminations = undefined;
        this.cachedPlayerStats = undefined;
    }

    public clearLegendCache(): void {
        this.cachedLegendComplimentaryLegendWeights = new Map();
        this.cachedLegendComplimentaryWeaponAvgEliminations = new Map();
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

    /**
     * Sorted complimentary Legends and their weight scores.
     * @returns {Observable<[legendId, weightScore]>} WeightScore in percent
     */
    public getPlayerComplimentaryLegendWeights$(
        limit?: number,
        breakCache = false
    ): Observable<{ legendId: string; weightScore: number }[]> {
        const cachedResult = this.cachedPlayerComplimentaryLegendWeights;
        if (!breakCache && cachedResult && cachedResult.length) return of(cachedResult);

        const stopwatch = new Stopwatch();
        stopwatch.start();
        return combineLatest([this.configuration.config$, this.match.getAllMatchData$(limit)]).pipe(
            filter(([, matchList]) => !!matchList && Array.isArray(matchList)),
            map(([config, matchList]) => {
                const weightsMap = complimentaryLegendsWeights(
                    matchList as MatchDataStore[],
                    config.featureConfigs.legendSelectAssist.complimentaryLegendsWeights
                );
                const weights = Array.from(weightsMap)
                    .sort((a, b) => b[1].totalAvgWeight - a[1].totalAvgWeight)
                    .map((l) => ({ legendId: l[0], weightScore: l[1].totalAvgWeight }));
                return weights;
            }),
            tap((legendWeights) => {
                this.cachedPlayerComplimentaryLegendWeights = legendWeights;
                stopwatch.stop();
                stopwatch.watchdog(this.watchdogTime, (time) => `"Player Complimentary Legends (limit ${limit})" took ${time}ms`);
            })
        );
    }

    /**
     * Sorted complimentary Weapons and their avg eliminations per match.
     * @returns {Observable<[weaponId, avgEliminations]>}
     */
    public getPlayerComplimentaryWeaponAvgEliminations$(
        limit?: number,
        breakCache = false
    ): Observable<{ weaponId: string; avgEliminations: number }[]> {
        const cachedResult = this.cachedPlayerComplimentaryWeaponAvgEliminations;
        if (!breakCache && cachedResult && cachedResult.length) return of(cachedResult);

        const stopwatch = new Stopwatch();
        stopwatch.start();
        return this.match.getAllMatchData$(limit).pipe(
            filter((matchList) => !!matchList && Array.isArray(matchList)),
            map((matchList) => {
                const weaponsAvgEliminationsMap = complimentaryWeaponsAvgEliminations(matchList as MatchDataStore[]);
                const weaponsAvgEliminations = Array.from(weaponsAvgEliminationsMap)
                    .sort((a, b) => b[1] - a[1])
                    .map((w) => ({ weaponId: w[0], avgEliminations: w[1] }));
                return weaponsAvgEliminations;
            }),
            tap((weaponsAvgEliminations) => {
                this.cachedPlayerComplimentaryWeaponAvgEliminations = weaponsAvgEliminations;
                stopwatch.stop();
                stopwatch.watchdog(this.watchdogTime, (time) => `"Player Complimentary Legends (limit ${limit})" took ${time}ms`);
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

    /**
     * Sorted complimentary Legends and their weight scores, from the given LegendId.
     * @returns {Observable<[legendId, weightScore]>} WeightScore in percent
     */
    public getLegendComplimentaryLegendWeights$(
        legendId: string,
        limit?: number,
        breakCache = false
    ): Observable<{ legendId: string; weightScore: number }[]> {
        const cachedResult = this.cachedLegendComplimentaryLegendWeights.get(legendId);
        if (!breakCache && cachedResult) return of(cachedResult);

        const stopwatch = new Stopwatch();
        stopwatch.start();
        return combineLatest([this.configuration.config$, this.match.getMatchDataByLegendId$(legendId, limit)]).pipe(
            filter(([, matchList]) => !!matchList && Array.isArray(matchList)),
            map(([config, matchList]) => {
                const legendWeightsMap = complimentaryLegendsWeights(
                    matchList as MatchDataStore[],
                    config.featureConfigs.legendSelectAssist.complimentaryLegendsWeights,
                    legendId
                );
                const legendWeights = Array.from(legendWeightsMap)
                    .sort((a, b) => b[1].totalAvgWeight - a[1].totalAvgWeight)
                    .map((l) => ({ legendId: l[0], weightScore: l[1].totalAvgWeight }));
                return legendWeights;
            }),
            tap((legendWeights) => {
                this.cachedLegendComplimentaryLegendWeights.set(legendId, legendWeights);
                stopwatch.stop();
                stopwatch.watchdog(
                    this.watchdogTime,
                    (time) => `"Legend '${legendId}' Complimentary Legends (limit ${limit})" took ${time}ms`
                );
            })
        );
    }

    /**
     * Sorted complimentary Weapons and their avg eliminations, from the given LegendId.
     * @returns {Observable<[weaponId, avgEliminations]>}
     */
    public getLegendComplimentaryAvgWeaponEliminations$(
        legendId: string,
        limit?: number,
        breakCache = false
    ): Observable<{ weaponId: string; avgEliminations: number }[]> {
        const cachedResult = this.cachedLegendComplimentaryWeaponAvgEliminations.get(legendId);
        if (!breakCache && cachedResult) return of(cachedResult);

        const stopwatch = new Stopwatch();
        stopwatch.start();
        return this.match.getMatchDataByLegendId$(legendId, limit).pipe(
            filter((matchList) => !!matchList && Array.isArray(matchList)),
            map((matchList) => {
                const weaponsAvgEliminationsMap = complimentaryWeaponsAvgEliminations(matchList as MatchDataStore[], legendId);
                const weaponsAvgEliminations = Array.from(weaponsAvgEliminationsMap)
                    .sort((a, b) => b[1] - a[1])
                    .map((w) => ({ weaponId: w[0], avgEliminations: w[1] }));
                return weaponsAvgEliminations;
            }),
            tap((weaponsAvgEliminations) => {
                this.cachedLegendComplimentaryWeaponAvgEliminations.set(legendId, weaponsAvgEliminations);
                stopwatch.stop();
                stopwatch.watchdog(
                    this.watchdogTime,
                    (time) => `"Legend '${legendId}' Complimentary Weapons (limit ${limit})" took ${time}ms`
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

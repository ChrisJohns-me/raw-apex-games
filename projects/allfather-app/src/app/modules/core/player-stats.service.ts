import { AvgMatchStats, avgStats, complimentaryLegendsWeights, legendAvgStats } from "@allfather-app/app/common/utilities/match-stats";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { ConfigurationService } from "./configuration.service";
import { MatchDataStore } from "./local-database/match-data-store";
import { MatchService } from "./match/match.service";

type LegendId = string;

@Injectable({
    providedIn: "root",
    deps: [ConfigurationService, MatchService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("PlayerStatsService", PlayerStatsService, deps),
})
export class PlayerStatsService {
    private statWeights = this.config.featureConfigs.legendSelectAssist.complimentaryLegendsWeights;
    private cachedPlayerComplimentaryLegendWeights?: { legendId: string; weightScore: number }[];
    private cachedLegendComplimentaryLegendWeights = new Map<LegendId, { legendId: string; weightScore: number }[]>();
    private cachedPlayerStats?: AvgMatchStats;
    private cachedLegendStats = new Map<LegendId, AvgMatchStats>();

    constructor(private readonly config: ConfigurationService, private readonly match: MatchService) {}

    public getPlayerStats$(limit?: number, breakCache = false): Observable<AvgMatchStats> {
        const cachedResult = this.cachedPlayerStats;
        if (!breakCache && cachedResult) return of(cachedResult);

        return this.match.getAllMatchData$(limit).pipe(
            filter((matchList) => !!matchList && Array.isArray(matchList)),
            map((matchList) => avgStats(matchList as MatchDataStore[])),
            tap((avgStats) => {
                this.cachedPlayerStats = avgStats;
            })
        );
    }

    public getLegendStats$(legendId: string, limit?: number, breakCache = false): Observable<AvgMatchStats> {
        const cachedResult = this.cachedLegendStats.get(legendId);
        if (!breakCache && cachedResult) return of(cachedResult);

        return this.match.getMatchDataByLegendId$(legendId, limit).pipe(
            filter((matchList) => !!matchList && Array.isArray(matchList)),
            map((matchList) => legendAvgStats(matchList as MatchDataStore[], legendId)),
            tap((avgStats) => {
                this.cachedLegendStats.set(legendId, avgStats);
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

        return this.match.getAllMatchData$(limit).pipe(
            filter((matchList) => !!matchList && Array.isArray(matchList)),
            map((matchList) => {
                const weightsMap = complimentaryLegendsWeights(matchList as MatchDataStore[], this.statWeights);
                const weights = Array.from(weightsMap)
                    .sort((a, b) => b[1].totalAvgWeight - a[1].totalAvgWeight)
                    .map((l) => ({ legendId: l[0], weightScore: l[1].totalAvgWeight }));
                return weights;
            }),
            tap((legendWeights) => {
                this.cachedPlayerComplimentaryLegendWeights = legendWeights;
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

        return this.match.getMatchDataByLegendId$(legendId, limit).pipe(
            filter((matchList) => !!matchList && Array.isArray(matchList)),
            map((matchList) => {
                const legendWeightsMap = complimentaryLegendsWeights(matchList as MatchDataStore[], this.statWeights, legendId);
                const legendWeights = Array.from(legendWeightsMap)
                    .sort((a, b) => b[1].totalAvgWeight - a[1].totalAvgWeight)
                    .map((l) => ({ legendId: l[0], weightScore: l[1].totalAvgWeight }));
                return legendWeights;
            }),
            tap((legendWeights) => {
                this.cachedLegendComplimentaryLegendWeights.set(legendId, legendWeights);
            })
        );
    }
}

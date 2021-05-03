import { AvgMatchStats, complimentaryLegendsWeights, legendAvgStats } from "@allfather-app/app/shared/models/utilities/match-stats";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { ConfigurationService } from "../core/configuration/configuration.service";
import { MatchService } from "../core/match/match.service";

type LegendId = string;

@Injectable()
export class LegendSelectAssistService {
    private statWeights = this.config.featureConfigs.legendSelectAssist.complimentaryLegendsWeights;
    private cachedComplimentaryLegendWeights = new Map<LegendId, { legendId: string; weightScore: number }[]>();
    private cachedLegendStats = new Map<LegendId, AvgMatchStats>();

    constructor(private readonly config: ConfigurationService, private readonly match: MatchService) {}

    public getLegendStats(legendId: string, allowCache = true): Observable<AvgMatchStats> {
        const limit = this.config.featureConfigs.legendSelectAssist.limitComplimentaryLegendsMatches;
        const cachedResult = this.cachedLegendStats.get(legendId);
        if (allowCache && cachedResult) return of(cachedResult);

        return this.match.getMatchDataByLegendId(legendId, limit).pipe(
            map((matchList) => legendAvgStats(matchList, legendId)),
            tap((avgStats) => {
                if (allowCache) this.cachedLegendStats.set(legendId, avgStats);
            })
        );
    }

    /**
     * Sorted complimentary Legends and their weight scores, from the given LegendId.
     * @returns {Observable<[legendId, weightScore]>} WeightScore in percent
     */
    public getComplimentaryLegendWeights(legendId: string, allowCache = true): Observable<{ legendId: string; weightScore: number }[]> {
        const limit = this.config.featureConfigs.legendSelectAssist.limitComplimentaryLegendsMatches;
        const cachedResult = this.cachedComplimentaryLegendWeights.get(legendId);
        if (allowCache && cachedResult) return of(cachedResult);

        return this.match.getMatchDataByLegendId(legendId, limit).pipe(
            map((matchList) => {
                const legendWeightsMap = complimentaryLegendsWeights(legendId, matchList, this.statWeights);
                const legendWeights = Array.from(legendWeightsMap)
                    .sort((a, b) => b[1].totalAvgWeight - a[1].totalAvgWeight)
                    .map((l) => ({ legendId: l[0], weightScore: l[1].totalAvgWeight }));
                return legendWeights;
            }),
            tap((legendWeights) => {
                if (allowCache) this.cachedComplimentaryLegendWeights.set(legendId, legendWeights);
            })
        );
    }
}

import { MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import isDate from "date-fns/isDate";
import { isEmpty, mathClamp } from "shared/utilities";

// Safe-guards
const MAX_PLACEMENT = 50;
const MAX_DAMAGE = 50000;
const MAX_ELIMINATIONS = 500;
const MAX_KNOCKDOWNS = 50000;
const MAX_DURATION = 86400000;

export interface AvgMatchStats {
    numMatches: number;
    avgWins: number;
    avgPlacement: number;
    avgEliminations: number;
    avgKnockdowns: number;
    avgDamage: number;
    avgDuration: number;
}

export interface SumMatchStats {
    numMatches: number;
    sumWins: number;
    sumPlacement: number;
    sumEliminations: number;
    sumKnockdowns: number;
    sumDamage: number;
    sumDuration: number;
}

export interface AvgStatWeights {
    avgWinWeight: number;
    avgPlacementWeight: number;
    avgDamageWeight: number;
    avgEliminationWeight: number;
    avgKnockdownWeight: number;
    avgDurationWeight: number;
    totalAvgWeight: number;
}

interface SumStatWeights {
    sumWinWeight: number;
    sumPlacementWeight: number;
    sumDamageWeight: number;
    sumEliminationWeight: number;
    sumKnockdownWeight: number;
    sumDurationWeight: number;
    totalSumWeight: number;
}

interface StatWeights {
    winWeight: number;
    placementWeight: number;
    damageWeight: number;
    eliminationWeight: number;
    knockdownWeight: number;
    durationWeight: number;
    totalWeight?: number;
}

interface StatBounds {
    placementMin: number;
    damageMax: number;
    eliminationsMax: number;
    knockdownsMax: number;
    durationMax: number;
}

/**
 * List all complimentary Legends (greatest to least), respective to the given Legend.
 */
export function complimentaryLegends(legendId: string, matchList: MatchDataStore[], statWeights: StatWeights): string[] {
    const avgCompLegendWeights = complimentaryLegendsWeights(legendId, matchList, statWeights);
    const avgCompLegend = Array.from(avgCompLegendWeights)
        .sort((a, b) => b[1].totalAvgWeight - a[1].totalAvgWeight)
        .map((l) => l[0]);
    return avgCompLegend;
}

/**
 * Map all Legends with complimentary avg stat weights, respective to the given Legend.
 * @returns {Map<LegendId, AvgStatWeights>}
 */
export function complimentaryLegendsWeights(
    legendId: string,
    matchList: MatchDataStore[],
    statWeights: StatWeights
): Map<string, AvgStatWeights> {
    type LegendId = string;
    const legendMatchList = matchList.filter((m) => m.teamRoster?.find((tr) => !!tr.isMe && tr.legendId === legendId));
    const matchStatBounds = getMatchStatBounds(matchList);
    const numLegendMatches = new Map<LegendId, number>(); // number of matches with each Legend
    const sumCompLegendWeights = new Map<LegendId, SumStatWeights>(); // summed weights with each Legend
    const avgCompLegendWeights = new Map<LegendId, AvgStatWeights>(); // avg weights with each Legend

    for (let i = 0; i < legendMatchList.length; i++) {
        const match: MatchDataStore = legendMatchList[i];
        const matchStats: AvgMatchStats = {
            numMatches: 1,
            avgDamage: match.damage ?? 0,
            avgWins: match.placement === 1 ? 1 : 0,
            avgDuration: match.endDate && match.startDate ? match.endDate.getTime() - match.startDate.getTime() : 0,
            avgEliminations: match.eliminations ?? 0,
            avgKnockdowns: match.knockdowns ?? 0,
            avgPlacement: match.placement ?? 0,
        };
        // Sum complimentary Legend weights
        match.teamRoster?.forEach((rosterPlayer) => {
            if (rosterPlayer.isMe || rosterPlayer.legendId === legendId || isEmpty(rosterPlayer.legendId)) return;
            const existingSumWeights = sumCompLegendWeights.get(rosterPlayer.legendId);
            const matchStatWeights = matchAvgStatWeights(matchStats, matchStatBounds, statWeights);
            const newSumWeights = reduceSumWeights(existingSumWeights, matchStatWeights);

            numLegendMatches.set(rosterPlayer.legendId, (numLegendMatches.get(rosterPlayer.legendId) ?? 0) + 1);
            return sumCompLegendWeights.set(rosterPlayer.legendId, newSumWeights);
        });
    }

    // Average complimentary legend weights
    for (const sumLegendWeight of sumCompLegendWeights) {
        const legendId = sumLegendWeight[0];
        const sumStatWeights = sumLegendWeight[1];
        const numLegendWeights = numLegendMatches.get(sumLegendWeight[0]) || 0;
        const avgLegendStats = calcAvgWeights(sumStatWeights, numLegendWeights);

        avgCompLegendWeights.set(legendId, avgLegendStats);
    }

    console.log(`Loaded Complimentary Legends for "${legendId}":`, avgCompLegendWeights);
    return avgCompLegendWeights;
}

/**
 * Legend's stats from a list of matches.
 * @example legendAvgStats(matchList, "bangalore")
 * @returns
 *  { numMatches: 99, avgWins: 0.042, avgPlacement: 7, avgDamage: 420, avgEliminations: 1.02, avgKnockdowns: 2.34 }
 */
export function legendAvgStats(matchList: MatchDataStore[], legendId: string): AvgMatchStats {
    const legendMatchList = matchList.filter((m) => m.teamRoster?.find((tr) => !!tr.isMe && tr.legendId === legendId));
    const sumLegendStats = legendMatchList.reduce(reduceMatchStats, {} as SumMatchStats);
    const legendAvgStats = calcAvgStats(sumLegendStats);
    return legendAvgStats;
}

/** Applies weights to averaged stats */
export function matchAvgStatWeights(matchStats: Partial<AvgMatchStats>, statBounds: StatBounds, statWeights: StatWeights): AvgStatWeights {
    const _avgPlacementWeight = (statBounds.placementMin / (matchStats.avgPlacement ?? 15)) * statWeights.placementWeight;
    const _avgDamageWeight = ((matchStats.avgDamage ?? 0) / statBounds.damageMax) * statWeights.damageWeight;
    const _avgEliminationWeight = ((matchStats.avgEliminations ?? 0) / statBounds.eliminationsMax) * statWeights.eliminationWeight;
    const _avgKnockdownWeight = ((matchStats.avgKnockdowns ?? 0) / statBounds.knockdownsMax) * statWeights.knockdownWeight;
    const _avgDurationWeight = ((matchStats.avgDuration ?? 0) / statBounds.durationMax) * statWeights.damageWeight;

    const avgWinWeight = mathClamp((matchStats.avgWins ?? 0) * statWeights.winWeight, 0, statWeights.winWeight);
    const avgPlacementWeight = Math.min(
        _avgPlacementWeight >= 0 ? _avgPlacementWeight : statWeights.placementWeight,
        statWeights.placementWeight
    );
    const avgDamageWeight = Math.min(_avgDamageWeight >= 0 ? _avgDamageWeight : statWeights.damageWeight, statWeights.damageWeight);
    const avgEliminationWeight = Math.min(_avgEliminationWeight >= 0 ? _avgEliminationWeight : 0, statWeights.eliminationWeight);
    const avgKnockdownWeight = Math.min(_avgKnockdownWeight >= 0 ? _avgKnockdownWeight : 0, statWeights.knockdownWeight);
    const avgDurationWeight = Math.min(_avgDurationWeight >= 0 ? _avgDurationWeight : 0, statWeights.durationWeight);

    const totalWeight = Math.min(
        avgWinWeight + avgPlacementWeight + avgDamageWeight + avgEliminationWeight + avgKnockdownWeight + avgDurationWeight,
        1
    );
    return {
        avgWinWeight,
        avgPlacementWeight,
        avgDamageWeight,
        avgEliminationWeight,
        avgKnockdownWeight,
        avgDurationWeight,
        totalAvgWeight: totalWeight,
    };
}

/** Find each highest stat from a given match list. */
export function getMatchStatBounds(matchList: MatchDataStore[]): StatBounds {
    let placementMin = MAX_PLACEMENT,
        damageMax = 0,
        eliminationsMax = 0,
        knockdownsMax = 0,
        durationMax = 0;
    for (let i = 0; i < matchList.length; i++) {
        const match = matchList[i];
        if (!match) continue;
        if (match.placement && match.placement > 0) placementMin = Math.min(placementMin, match.placement);
        damageMax = Math.max(damageMax, match.damage ?? 0);
        eliminationsMax = Math.max(eliminationsMax, match.eliminations ?? 0);
        knockdownsMax = Math.max(knockdownsMax, match.knockdowns ?? 0);
        const startDate: number = match.startDate?.getTime() ?? 0;
        const endDate: number = match.endDate?.getTime() ?? 0;
        const duration: number = isDate(match.startDate) && isDate(match.endDate) ? endDate - startDate : 0;
        durationMax = Math.max(durationMax, duration);
    }
    return {
        placementMin: mathClamp(placementMin, 1, MAX_PLACEMENT),
        damageMax: mathClamp(damageMax, 0, MAX_DAMAGE),
        eliminationsMax: mathClamp(eliminationsMax, 0, MAX_ELIMINATIONS),
        knockdownsMax: mathClamp(knockdownsMax, 0, MAX_KNOCKDOWNS),
        durationMax: mathClamp(durationMax, 0, MAX_DURATION),
    };
}

/**
 * Average all stats grouped by a key
 * @example matchListAvgStatsGroupedBy(matchList, (m) => m.legendId)
 * @returns
 *  { key: "bangalore", numMatches: 99, avgWins: 1.2424, avgPlacement: 92.9191, avgDamage: 991.1414, avgEliminations: 0.98, avgKnockdowns: 1.23 },
 *  { key: "wraith", numMatches: 12, avgWins: 0.0833, avgPlacement: 3.5, avgDamage: 760.25, avgEliminations: 0.833, avgKnockdowns: 4.23 },
 *  { key: "caustic", numMatches: 51, avgWins: 0.0392, avgPlacement: 3.1176, avgDamage: 24.196, avgEliminations: 0.5882, avgKnockdowns: 2.23 },
 */
export function matchListAvgStatsGroupedBy<T>(
    matchList: MatchDataStore[],
    groupByPredicate?: (match: MatchDataStore) => T
): Array<AvgMatchStats & { key: T }> {
    const sumStats = matchListSumStatsGroupedBy(matchList, groupByPredicate);
    const avgStats = sumStats.map((stat) => {
        const numMatches = stat.numMatches ?? 0;
        return {
            key: stat.key,
            numMatches: stat.numMatches,
            avgDamage: stat.sumDamage / numMatches,
            avgDuration: stat.sumDuration / numMatches,
            avgEliminations: stat.sumEliminations / numMatches,
            avgKnockdowns: stat.sumKnockdowns / numMatches,
            avgPlacement: stat.sumPlacement / numMatches,
            avgWins: stat.sumWins / numMatches,
        };
    });
    return avgStats;
}

/**
 * Sum all stats grouped by a key
 * @example matchListSumStatsGroupedBy(matchList, (m) => m.legendId)
 * @returns
 *  { key: "bangalore", numMatches: 99, sumWins: 123, sumPlacement: 9199, sumDamage: 98123, sumEliminations: 98, sumKnockdowns: 123 },
 *  { key: "wraith", numMatches: 12, sumWins: 1, sumPlacement: 42, sumDamage: 9123, sumEliminations: 10, sumKnockdowns: 219 },
 *  { key: "caustic", numMatches: 51, sumWins: 2, sumPlacement: 159, sumDamage: 1234, sumEliminations: 30, sumKnockdowns: 99 },
 */
export function matchListSumStatsGroupedBy<T>(
    matchList: MatchDataStore[],
    groupByPredicate?: (match: MatchDataStore) => T
): Array<SumMatchStats & { key: T }> {
    const matchesMapped = matchList.reduce<Map<T, SumMatchStats>>((summed, currMatch) => {
        const groupByKey: T = typeof groupByPredicate === "function" ? groupByPredicate(currMatch) : (currMatch.matchId as any);
        const prevStats: Optional<SumMatchStats> = summed.get(groupByKey);
        const newStats = reduceMatchStats(prevStats, currMatch);

        return summed.set(groupByKey, newStats);
    }, new Map());

    const matchStats = Array.from(matchesMapped, ([groupByKey, match]) => ({
        ...match,
        key: groupByKey,
    }));
    return matchStats;
}

/**
 * Reduce function to provide a sum of stats from a list of matches.
 */
function reduceMatchStats(prev: Optional<SumMatchStats>, curr: MatchDataStore): SumMatchStats {
    const currStartDate: number = curr.startDate?.getTime() ?? 0;
    const currEndDate: number = curr.endDate?.getTime() ?? 0;
    const currDuration: number = isDate(curr.startDate) && isDate(curr.endDate) ? currEndDate - currStartDate : 0;
    return {
        sumWins: curr.placement === 1 ? (prev?.sumWins ?? 0) + 1 : prev?.sumWins ?? 0,
        sumPlacement: (prev?.sumPlacement ?? 0) + (curr.placement ?? 0),
        sumDamage: (prev?.sumDamage ?? 0) + (curr.damage ?? 0),
        sumEliminations: (prev?.sumEliminations ?? 0) + (curr.eliminations ?? 0),
        sumKnockdowns: (prev?.sumKnockdowns ?? 0) + (curr.knockdowns ?? 0),
        sumDuration: (prev?.sumDuration ?? 0) + currDuration,
        numMatches: (prev?.numMatches ?? 0) + 1,
    };
}

/**
 * Reduce function to provide a sum of weights.
 */
function reduceSumWeights(existingSumWeights: SumStatWeights | undefined, matchStatWeights: AvgStatWeights): SumStatWeights {
    const newSumWeights: SumStatWeights = {
        sumWinWeight: (existingSumWeights?.sumWinWeight ?? 0) + matchStatWeights.avgWinWeight,
        sumPlacementWeight: (existingSumWeights?.sumPlacementWeight ?? 0) + matchStatWeights.avgPlacementWeight,
        sumDamageWeight: (existingSumWeights?.sumDamageWeight ?? 0) + matchStatWeights.avgDamageWeight,
        sumEliminationWeight: (existingSumWeights?.sumEliminationWeight ?? 0) + matchStatWeights.avgEliminationWeight,
        sumKnockdownWeight: (existingSumWeights?.sumKnockdownWeight ?? 0) + matchStatWeights.avgKnockdownWeight,
        sumDurationWeight: (existingSumWeights?.sumDurationWeight ?? 0) + matchStatWeights.avgDurationWeight,
        totalSumWeight: 0,
    };
    newSumWeights.totalSumWeight =
        newSumWeights.sumDamageWeight! +
        newSumWeights.sumDurationWeight! +
        newSumWeights.sumEliminationWeight! +
        newSumWeights.sumKnockdownWeight! +
        newSumWeights.sumPlacementWeight! +
        newSumWeights.sumWinWeight!;
    return newSumWeights;
}

/**
 * Reduce function to provide an avg of weights.
 */
function calcAvgWeights(sumWeights: SumStatWeights, numWeights: number): AvgStatWeights {
    const newAvgWeights: AvgStatWeights = {
        avgDamageWeight: Math.min(sumWeights.sumDamageWeight / numWeights, 1),
        avgDurationWeight: Math.min(sumWeights.sumDurationWeight / numWeights, 1),
        avgEliminationWeight: Math.min(sumWeights.sumEliminationWeight / numWeights, 1),
        avgKnockdownWeight: Math.min(sumWeights.sumKnockdownWeight / numWeights, 1),
        avgPlacementWeight: Math.min(sumWeights.sumPlacementWeight / numWeights, 1),
        avgWinWeight: Math.min(sumWeights.sumWinWeight / numWeights, 1),
        totalAvgWeight: 0,
    };
    newAvgWeights.totalAvgWeight = Math.min(
        newAvgWeights.avgDamageWeight! +
            newAvgWeights.avgDurationWeight! +
            newAvgWeights.avgEliminationWeight! +
            newAvgWeights.avgKnockdownWeight! +
            newAvgWeights.avgPlacementWeight! +
            newAvgWeights.avgWinWeight!,
        1
    );
    return newAvgWeights;
}

function calcAvgStats(sumMatchStats: SumMatchStats): AvgMatchStats {
    return {
        numMatches: sumMatchStats.numMatches,
        avgDamage: sumMatchStats.sumDamage / sumMatchStats.numMatches,
        avgDuration: sumMatchStats.sumDuration / sumMatchStats.numMatches,
        avgEliminations: sumMatchStats.sumEliminations / sumMatchStats.numMatches,
        avgKnockdowns: sumMatchStats.sumKnockdowns / sumMatchStats.numMatches,
        avgPlacement: sumMatchStats.sumPlacement / sumMatchStats.numMatches,
        avgWins: sumMatchStats.sumWins / sumMatchStats.numMatches,
    };
}

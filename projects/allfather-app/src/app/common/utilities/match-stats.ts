import { MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import { isEmpty, mathClamp } from "common/utilities/";
import { unique } from "common/utilities/primitives/array";
import isDate from "date-fns/isDate";
import { WeaponItem } from "../items/weapon-item";

// Safe-guards
const MAX_PLACEMENT = 50;
const MAX_DAMAGE = 50000;
const MAX_ELIMINATIONS = 500;
const MAX_DEATHS = 50;
const MAX_ASSISTS = 500;
const MAX_KNOCKDOWNS = 50000;
const MAX_DURATION = 86400000;

export interface AvgMatchStats {
    numMatches: number;
    avgWins: number;
    avgPlacement: number;
    avgEliminations: number;
    avgDeaths: number;
    avgKnockdowns: number;
    avgAssists: number;
    avgDamage: number;
    avgDuration: number;
}

export interface SumMatchStats {
    numMatches: number;
    sumWins: number;
    sumPlacement: number;
    sumEliminations: number;
    sumDeaths: number;
    sumKnockdowns: number;
    sumAssists: number;
    sumDamage: number;
    sumDuration: number;
}

export interface AvgStatWeights {
    avgWinWeight: number;
    avgPlacementWeight: number;
    avgDamageWeight: number;
    avgEliminationWeight: number;
    avgDeathWeight: number;
    avgKnockdownWeight: number;
    avgAssistWeight: number;
    avgDurationWeight: number;
    totalAvgWeight: number;
}

interface SumStatWeights {
    sumWinWeight: number;
    sumPlacementWeight: number;
    sumDamageWeight: number;
    sumEliminationWeight: number;
    sumDeathWeight: number;
    sumKnockdownWeight: number;
    sumAssistWeight: number;
    sumDurationWeight: number;
    totalSumWeight: number;
}

interface StatWeights {
    winWeight: number;
    placementWeight: number;
    damageWeight: number;
    eliminationWeight: number;
    deathWeight: number;
    knockdownWeight: number;
    assistWeight: number;
    durationWeight: number;
    totalWeight?: number;
}

interface StatBounds {
    placementMin: number;
    damageMax: number;
    eliminationsMax: number;
    deathsMin: number;
    knockdownsMax: number;
    assistsMax: number;
    durationMax: number;
}

/**
 * List all complimentary Legends (greatest to least).
 * Respective to the given Legend (optionally).
 */
export function listComplimentaryLegends(matchList: MatchDataStore[], statWeights: StatWeights): string[] {
    const avgCompLegendWeights = complimentaryLegendsWeights(matchList, statWeights);
    const avgCompLegend = Array.from(avgCompLegendWeights)
        .slice()
        .sort((a, b) => b[1].totalAvgWeight - a[1].totalAvgWeight)
        .map((l) => l[0]);
    return avgCompLegend;
}

/**
 * Map all Legends with complimentary avg stat weights.
 * Respective to the given Legend (optionally).
 * @returns {Map<LegendId, AvgStatWeights>}
 */
export function complimentaryLegendsWeights(
    matchList: MatchDataStore[],
    statWeights: StatWeights,
    legendId?: string
): Map<string, AvgStatWeights> {
    type LegendId = string;
    const filteredMatchList = legendId
        ? matchList.filter((m) => m.teamRoster?.find((tr) => !!tr.isMe && tr.legendId === legendId))
        : matchList;
    const statBounds = matchStatBounds(matchList);
    const numLegendMatches = new Map<LegendId, number>(); // number of matches with each Legend
    const sumCompLegendWeights = new Map<LegendId, SumStatWeights>(); // summed weights with each Legend
    const avgCompLegendWeights = new Map<LegendId, AvgStatWeights>(); // avg weights with each Legend

    for (let i = 0; i < filteredMatchList.length; i++) {
        const match: MatchDataStore = filteredMatchList[i];
        const matchStats: AvgMatchStats = {
            numMatches: 1,
            avgDamage: match.damage ?? 0,
            avgWins: match.placement === 1 ? 1 : 0,
            avgDuration: match.endDate && match.startDate ? match.endDate.getTime() - match.startDate.getTime() : 0,
            avgEliminations: match.eliminations ?? 0,
            avgDeaths: match.deaths ?? 1,
            avgKnockdowns: match.knockdowns ?? 0,
            avgAssists: match.assists ?? 0,
            avgPlacement: match.placement ?? 0,
        };
        // Sum complimentary Legend weights
        match.teamRoster?.forEach((rosterPlayer) => {
            if (rosterPlayer.isMe || rosterPlayer.legendId === legendId || isEmpty(rosterPlayer.legendId)) return;
            const existingSumWeights = sumCompLegendWeights.get(rosterPlayer.legendId);
            const matchStatWeights = matchAvgStatWeights(matchStats, statBounds, statWeights);
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

    console.log(`Loaded Complimentary Legends for "${legendId ?? "all legends"}":`, avgCompLegendWeights);
    return avgCompLegendWeights;
}

/**
 * Map all weapons with average eliminations per match.
 * Respective to the given Legend (optionally).
 * @returns {Map<WeaponId, Eliminations>}
 */
export function complimentaryWeaponsAvgEliminations(matchList: MatchDataStore[], legendId?: string): Map<string, number> {
    type WeaponId = string;
    const filteredMatchList = legendId
        ? matchList.filter((m) => m.teamRoster?.find((tr) => !!tr.isMe && tr.legendId === legendId))
        : matchList;
    const numWeaponMatches = new Map<WeaponId, number>(); // number of matches with each Weapon
    const sumWeaponEliminations = new Map<WeaponId, number>(); // summed eliminations with each Weapon
    const avgWeaponEliminations = new Map<WeaponId, number>(); // summed eliminations with each Weapon per match

    for (let i = 0; i < filteredMatchList.length; i++) {
        const match: MatchDataStore = filteredMatchList[i];
        const matchWeaponEliminations = match.eliminationWeaponIds
            ?.map((weaponId) => (WeaponItem.isWeaponId(weaponId) ? weaponId : undefined))
            .filter((weaponId) => !!weaponId) as string[];
        if (!matchWeaponEliminations || !Array.isArray(matchWeaponEliminations) || isEmpty(matchWeaponEliminations)) continue;

        // Number of matches with each weapon
        unique(matchWeaponEliminations)?.forEach((weaponId) => {
            numWeaponMatches.set(weaponId, (numWeaponMatches.get(weaponId) ?? 0) + 1);
        });

        // Sum of eliminations with each weapon
        matchWeaponEliminations?.forEach((weaponId) => {
            sumWeaponEliminations.set(weaponId, (sumWeaponEliminations.get(weaponId) ?? 0) + 1);
        });
    }

    // Average number of eliminations with each weapon
    sumWeaponEliminations.forEach((sumEliminations, weaponId) => {
        const avgEliminations = sumEliminations / (numWeaponMatches.get(weaponId) ?? 0);
        avgWeaponEliminations.set(weaponId, avgEliminations);
    });

    console.log(`Loaded Complimentary Weapons for "${legendId ?? "all legends"}"`);
    return avgWeaponEliminations;
}

/**
 * All stats from a list of matches.
 * @example avgStats(matchList)
 * @returns
 *  { numMatches: 99, avgWins: 0.042, avgPlacement: 7, avgDamage: 420, avgEliminations: 1.02, avgKnockdowns: 2.34, avgDeaths: 1.02 }
 */
export function avgStats(matchList: MatchDataStore[]): AvgMatchStats {
    return calcAvgStats(sumStats(matchList));
}

/**
 * All stats from a list of matches.
 * @example sumStats(matchList)
 * @returns
 *  { numMatches: 99, sumWins: 0.042, sumPlacement: 7, sumDamage: 420, sumEliminations: 1.02, sumKnockdowns: 2.34, sumDeaths: 1 }
 */
export function sumStats(matchList: MatchDataStore[]): SumMatchStats {
    return matchList.reduce(reduceMatchStats, {} as SumMatchStats);
}

/**
 * Legend's stats from a list of matches.
 * @example legendAvgStats(matchList, "bangalore")
 * @returns
 *  { numMatches: 99, avgWins: 0.042, avgPlacement: 7, avgDamage: 420, avgEliminations: 1.02, avgKnockdowns: 2.34, avgDeaths: 1 }
 */
export function legendAvgStats(matchList: MatchDataStore[], legendId: string): AvgMatchStats {
    const legendMatchList = matchList.filter((m) => !!m && m.teamRoster?.find((tr) => !!tr.isMe && tr.legendId === legendId));
    const sumLegendStats = legendMatchList.reduce(reduceMatchStats, {} as SumMatchStats);
    const legendAvgStats = calcAvgStats(sumLegendStats);
    return legendAvgStats;
}

/** Applies weights to averaged stats */
export function matchAvgStatWeights(matchStats: Partial<AvgMatchStats>, statBounds: StatBounds, statWeights: StatWeights): AvgStatWeights {
    const _avgPlacementWeight = (statBounds.placementMin / (matchStats.avgPlacement ?? 15)) * statWeights.placementWeight;
    const _avgDamageWeight = ((matchStats.avgDamage ?? 0) / statBounds.damageMax) * statWeights.damageWeight;
    const _avgEliminationWeight = ((matchStats.avgEliminations ?? 0) / statBounds.eliminationsMax) * statWeights.eliminationWeight;
    const _avgDeathWeight = (statBounds.deathsMin / (matchStats.avgDeaths ?? 1)) * statWeights.deathWeight;
    const _avgAssistWeight = ((matchStats.avgAssists ?? 0) / statBounds.assistsMax) * statWeights.assistWeight;
    const _avgKnockdownWeight = ((matchStats.avgKnockdowns ?? 0) / statBounds.knockdownsMax) * statWeights.knockdownWeight;
    const _avgDurationWeight = ((matchStats.avgDuration ?? 0) / statBounds.durationMax) * statWeights.damageWeight;

    const avgWinWeight = mathClamp((matchStats.avgWins ?? 0) * statWeights.winWeight, 0, statWeights.winWeight);
    const avgPlacementWeight = Math.min(
        _avgPlacementWeight >= 0 ? _avgPlacementWeight : statWeights.placementWeight,
        statWeights.placementWeight
    );
    const avgDeathWeight = Math.min(_avgDeathWeight >= 0 ? _avgDeathWeight : statWeights.deathWeight, statWeights.deathWeight);
    const avgDamageWeight = Math.min(_avgDamageWeight >= 0 ? _avgDamageWeight : statWeights.damageWeight, statWeights.damageWeight);
    const avgEliminationWeight = Math.min(_avgEliminationWeight >= 0 ? _avgEliminationWeight : 0, statWeights.eliminationWeight);
    const avgAssistWeight = Math.min(_avgAssistWeight >= 0 ? _avgAssistWeight : 0, statWeights.assistWeight);
    const avgKnockdownWeight = Math.min(_avgKnockdownWeight >= 0 ? _avgKnockdownWeight : 0, statWeights.knockdownWeight);
    const avgDurationWeight = Math.min(_avgDurationWeight >= 0 ? _avgDurationWeight : 0, statWeights.durationWeight);

    const totalWeight = Math.min(
        avgWinWeight +
            avgPlacementWeight +
            avgDamageWeight +
            avgEliminationWeight +
            avgDeathWeight +
            avgAssistWeight +
            avgKnockdownWeight +
            avgDurationWeight,
        1
    );
    return {
        avgWinWeight,
        avgPlacementWeight,
        avgDamageWeight,
        avgEliminationWeight,
        avgDeathWeight,
        avgAssistWeight,
        avgKnockdownWeight,
        avgDurationWeight,
        totalAvgWeight: totalWeight,
    };
}

/** Find each highest stat from a given match list. */
export function matchStatBounds(matchList: MatchDataStore[]): StatBounds {
    let placementMin = MAX_PLACEMENT,
        damageMax = 0,
        eliminationsMax = 0,
        deathsMin = 0,
        assistsMax = 0,
        knockdownsMax = 0,
        durationMax = 0;
    for (let i = 0; i < matchList.length; i++) {
        const match = matchList[i];
        if (!match) continue;
        if (match.placement && match.placement > 0) placementMin = Math.min(placementMin, match.placement);
        damageMax = Math.max(damageMax, match.damage ?? 0);
        eliminationsMax = Math.max(eliminationsMax, match.eliminations ?? 0);
        deathsMin = Math.min(deathsMin, match.deaths ?? 0);
        assistsMax = Math.max(assistsMax, match.assists ?? 0);
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
        deathsMin: mathClamp(deathsMin, 0, MAX_DEATHS),
        assistsMax: mathClamp(assistsMax, 0, MAX_ASSISTS),
        knockdownsMax: mathClamp(knockdownsMax, 0, MAX_KNOCKDOWNS),
        durationMax: mathClamp(durationMax, 0, MAX_DURATION),
    };
}

/**
 * Average all stats grouped by a key
 * @example matchListAvgStatsGroupedBy(matchList, (m) => m.legendId)
 * @returns
 *  { key: "bangalore", numMatches: 99, avgWins: 1.2424, avgPlacement: 92.9191, avgDamage: 991.1414, avgEliminations: 0.98, avgKnockdowns: 1.23, avgDeaths: 1.02 },
 *  { key: "wraith", numMatches: 12, avgWins: 0.0833, avgPlacement: 3.5, avgDamage: 760.25, avgEliminations: 0.833, avgKnockdowns: 4.23, avgDeaths: 1.02 },
 *  { key: "caustic", numMatches: 51, avgWins: 0.0392, avgPlacement: 3.1176, avgDamage: 24.196, avgEliminations: 0.5882, avgKnockdowns: 2.23, avgDeaths: 1.02 },
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
            avgDeaths: stat.sumDeaths / numMatches,
            avgAssists: stat.sumAssists / numMatches,
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
 *  { key: "bangalore", numMatches: 99, sumWins: 123, sumPlacement: 9199, sumDamage: 98123, sumEliminations: 98, sumKnockdowns: 123, sumDeaths: 1.02 },
 *  { key: "wraith", numMatches: 12, sumWins: 1, sumPlacement: 42, sumDamage: 9123, sumEliminations: 10, sumKnockdowns: 219, sumDeaths: 1.02 },
 *  { key: "caustic", numMatches: 51, sumWins: 2, sumPlacement: 159, sumDamage: 1234, sumEliminations: 30, sumKnockdowns: 99, sumDeaths: 1.02 },
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
        sumDeaths: (prev?.sumDeaths ?? 0) + (curr.deaths ?? 0),
        sumAssists: (prev?.sumAssists ?? 0) + (curr.assists ?? 0),
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
        sumDeathWeight: (existingSumWeights?.sumDeathWeight ?? 0) + matchStatWeights.avgDeathWeight,
        sumAssistWeight: (existingSumWeights?.sumAssistWeight ?? 0) + matchStatWeights.avgAssistWeight,
        sumKnockdownWeight: (existingSumWeights?.sumKnockdownWeight ?? 0) + matchStatWeights.avgKnockdownWeight,
        sumDurationWeight: (existingSumWeights?.sumDurationWeight ?? 0) + matchStatWeights.avgDurationWeight,
        totalSumWeight: 0,
    };
    newSumWeights.totalSumWeight =
        newSumWeights.sumDamageWeight! +
        newSumWeights.sumDurationWeight! +
        newSumWeights.sumEliminationWeight! +
        newSumWeights.sumDeathWeight! +
        newSumWeights.sumAssistWeight! +
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
        avgDeathWeight: Math.min(sumWeights.sumDeathWeight / numWeights, 1),
        avgAssistWeight: Math.min(sumWeights.sumAssistWeight / numWeights, 1),
        avgKnockdownWeight: Math.min(sumWeights.sumKnockdownWeight / numWeights, 1),
        avgPlacementWeight: Math.min(sumWeights.sumPlacementWeight / numWeights, 1),
        avgWinWeight: Math.min(sumWeights.sumWinWeight / numWeights, 1),
        totalAvgWeight: 0,
    };
    newAvgWeights.totalAvgWeight = Math.min(
        newAvgWeights.avgDamageWeight! +
            newAvgWeights.avgDurationWeight! +
            newAvgWeights.avgEliminationWeight! +
            newAvgWeights.avgDeathWeight! +
            newAvgWeights.avgAssistWeight! +
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
        avgDeaths: sumMatchStats.sumDeaths / sumMatchStats.numMatches,
        avgAssists: sumMatchStats.sumAssists / sumMatchStats.numMatches,
        avgKnockdowns: sumMatchStats.sumKnockdowns / sumMatchStats.numMatches,
        avgPlacement: sumMatchStats.sumPlacement / sumMatchStats.numMatches,
        avgWins: sumMatchStats.sumWins / sumMatchStats.numMatches,
    };
}

import { OverwolfGameDataService } from "@allfather-app/app/modules/core/overwolf";
import { MatchState } from "@allfather-app/app/shared/models/match/state";
import { PlayerState } from "@allfather-app/app/shared/models/player-state";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { cleanInt, isEmpty, parseBoolean } from "shared/utilities";
import { AllfatherService } from "../allfather-service.abstract";
import { MatchDataStore } from "../local-database/match-data-store";
import { MatchPlayerInflictionService } from "./match-player-infliction.service";
import { MatchPlayerService } from "./match-player.service";
import { MatchService } from "./match.service";

export type MatchStats = {
    wins: number;
    placement: number;
    eliminations: number;
    damage: number;
    duration: number;
    numMatches?: number;
};

interface MatchStatWeights {
    win: number;
    placement: number;
    eliminations: number;
    damage: number;
    duration: number;
}

interface MatchStatBounds {
    placementMin: number;
    damageMax: number;
    eliminationsMax: number;
    durationMax: number;
}

interface MatchAvgStatWeightResult {
    winWeight: number;
    placementWeight: number;
    damageWeight: number;
    eliminationWeight: number;
    durationWeight: number;
    totalWeight: number;
}

/**
 * @classdesc Provides damage/knockdown/kill, etc. count updates
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, MatchPlayerService, MatchPlayerInflictionService, OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchPlayerStatsService", MatchPlayerStatsService, deps),
})
export class MatchPlayerStatsService extends AllfatherService {
    /** Data from Overwolf's "tabs". Reset on match start. */
    public readonly myEliminations$ = new BehaviorSubject<number>(0);
    /** Data from Overwolf's "tabs". Reset on match start. */
    public readonly myAssists$ = new BehaviorSubject<number>(0);
    /** Data from Overwolf's "tabs". Reset on match start. */
    public readonly myDamage$ = new BehaviorSubject<number>(0);
    /** Data from Overwolf's "tabs". Reset on match start. */
    public readonly myPlacement$ = new BehaviorSubject<number>(0);
    /** Data from Overwolf's "tabs". Reset on match start. */
    public readonly victory$ = new BehaviorSubject<boolean>(false);
    /** @deprecated May not work; Feature is unavailable in game-UI. */
    public readonly mySpectators$ = new BehaviorSubject<number>(0);
    /** Inferred from player infliction. Reset on match start. */
    public readonly myKnockdowns$ = new BehaviorSubject<number>(0);
    /**
     * Does not take into consideration victim's HP, only the raw inflicted amount.
     * The contained damage amount will then appear to be inflated.
     * Info directly from Overwolf's me.damage_dealt data.
     */
    public readonly myTotalDamageDealt$ = new BehaviorSubject<number>(0);

    // private static statWeights = { // TODO Move to Config
    //     win: 0.2,
    //     placement: 0.25,
    //     eliminations: 0.25,
    //     damage: 0.2,
    //     duration: 0.1,
    // };

    constructor(
        private readonly match: MatchService,
        private readonly matchPlayer: MatchPlayerService,
        private readonly matchPlayerInfliction: MatchPlayerInflictionService,
        private readonly overwolfGameData: OverwolfGameDataService
    ) {
        super();
    }

    public init(): void {
        this.setupMatchStateEvents();
        this.setupInfoTabs();
        this.setupTotalDamageDealt();
        this.setupVictory();
        this.setupMyKnockdowns();
    }

    /**
     * List legends who (based on stats) compliment the provided Legend.
     * @param matchList
     * @param legendId
     */
    public static complimentaryLegends(matchList: MatchDataStore[], legendId: string, statWeights: MatchStatWeights): string[] {
        type LegendId = string;
        type Weight = number;
        const legendMatchList = matchList.filter((m) => m.legendId === legendId);
        const matchMaxValues = this.matchMaxStatValues(matchList);
        const numCompLegendWeights = new Map<LegendId, Weight>();
        const sumCompLegendWeights = new Map<LegendId, Weight>();
        const avgCompLegendWeights = new Map<LegendId, Weight>();

        for (let i = 0; i < legendMatchList.length; i++) {
            const match = legendMatchList[i];
            match.teamRoster.forEach((rosterPlayer) => {
                const existingWeight = sumCompLegendWeights.get(rosterPlayer.legendId) || 0;
                const winWeight = (match.placement === 1 ? 1 : 0) * statWeights.win,
                    placementWeight = (matchMaxValues.placementMin / match.placement) * statWeights.placement,
                    damageWeight = (match.damage / matchMaxValues.damageMax) * statWeights.damage,
                    eliminationWeight = (match.eliminations / matchMaxValues.eliminationsMax) * statWeights.eliminations,
                    durationWeight =
                        ((match.endDate.getTime() - match.startDate.getTime()) / matchMaxValues.durationMax) * statWeights.duration;
                const totalWeight = winWeight + placementWeight + damageWeight + eliminationWeight + durationWeight;
                const numLegendWeights = numCompLegendWeights.get(rosterPlayer.legendId) || 0;
                numCompLegendWeights.set(rosterPlayer.legendId, numLegendWeights + 1);
                return sumCompLegendWeights.set(rosterPlayer.legendId, totalWeight + existingWeight);
            });
        }

        // Average complimentary legend weight
        for (const sumLegendWeight of sumCompLegendWeights) {
            const numLegendWeight = numCompLegendWeights.get(sumLegendWeight[0]) || 0;
            avgCompLegendWeights.set(sumLegendWeight[0], sumLegendWeight[1] / numLegendWeight);
        }
        const compLegends = Array.from(avgCompLegendWeights)
            .sort((a, b) => b[1] - a[1])
            .map((l) => l[0])
            .filter((l) => l !== legendId);
        return compLegends;
    }

    /**
     * @example legendAvgStats(matchList, "bangalore")
     * @returns
     *  { numMatches: 99, avgWins: 0.042, avgPlacement: 7, avgDamage: 420, avgEliminations: 1.02 }
     */
    public static legendAvgStats(matchList: MatchDataStore[], legendId: string): MatchStats {
        const legendStats = matchList.filter((m) => m.legendId === legendId).reduce(reduceMatchStatsFn, {} as MatchStats);

        const numMatches = legendStats.numMatches ?? 0;
        const legendAvgStats = {
            damage: legendStats.damage / numMatches,
            duration: legendStats.duration / numMatches,
            eliminations: legendStats.eliminations / numMatches,
            placement: legendStats.placement / numMatches,
            wins: legendStats.wins / numMatches,
        };
        return legendAvgStats;
    }

    /**
     * Applies weights to averaged stats
     */
    public static matchAvgStatWeights(
        matchStats: MatchStats & { key: string },
        statBounds: MatchStatBounds,
        statWeights: MatchStatWeights
    ): MatchAvgStatWeightResult {
        const winWeight = matchStats.wins * statWeights.win,
            placementWeight = (statBounds.placementMin / matchStats.placement) * statWeights.placement,
            damageWeight = (matchStats.damage / statBounds.damageMax) * statWeights.damage,
            eliminationWeight = (matchStats.eliminations / statBounds.eliminationsMax) * statWeights.eliminations,
            durationWeight = (matchStats.duration / statBounds.durationMax) * statWeights.duration;

        const totalWeight = winWeight + placementWeight + damageWeight + eliminationWeight + durationWeight;
        return { winWeight, placementWeight, damageWeight, eliminationWeight, durationWeight, totalWeight };
    }

    /**
     * Find the maximum statistics from a given match list.
     * @param matchList
     */
    public static matchMaxStatValues(matchList: MatchDataStore[]): MatchStatBounds {
        const allLegendAvgStats = this.matchListAvgStatsGroupedBy(matchList, (m) => m.legendId);

        let placementMin = Infinity,
            damageMax = 0,
            eliminationsMax = 0,
            durationMax = 0;
        for (let i = 0; i < allLegendAvgStats.length; i++) {
            const stat = allLegendAvgStats[i];
            placementMin = Math.min(placementMin, stat.placement);
            damageMax = Math.max(damageMax, stat.damage);
            eliminationsMax = Math.max(eliminationsMax, stat.eliminations);
            durationMax = Math.max(durationMax, stat.duration);
        }
        return { placementMin, damageMax, eliminationsMax, durationMax };
    }

    /**
     * Average all stats grouped by a key
     * @example matchListAvgStatsGroupedBy(matchList, (m) => m.legendId)
     * @returns
     *  { key: "bangalore", numMatches: 99, avgWins: 1.2424, avgPlacement: 92.9191, avgDamage: 991.1414, avgEliminations: 0.98 },
     *  { key: "wraith", numMatches: 12, avgWins: 0.0833, avgPlacement: 3.5, avgDamage: 760.25, avgEliminations: 0.833 },
     *  { key: "caustic", numMatches: 51, avgWins: 0.0392, avgPlacement: 3.1176, avgDamage: 24.196, avgEliminations: 0.5882 },
     */
    public static matchListAvgStatsGroupedBy<T>(
        matchList: MatchDataStore[],
        groupByPredicate?: (match: MatchDataStore) => T
    ): Array<MatchStats & { key: T }> {
        const sumStats = this.matchListSumStatsGroupedBy(matchList, groupByPredicate);
        const avgStats = sumStats.map((stat) => {
            const numMatches = stat.numMatches ?? 0;
            return {
                key: stat.key,
                avgDamage: stat.damage / numMatches,
                avgDuration: stat.duration / numMatches,
                avgEliminations: stat.eliminations / numMatches,
                avgPlacement: stat.placement / numMatches,
                avgWin: stat.wins / numMatches,
            };
        });
        return avgStats;
    }

    /**
     * Sum all stats grouped by a key
     * @example matchListSumStatsGroupedBy(matchList, (m) => m.legendId)
     * @returns
     *  { key: "bangalore", numMatches: 99, sumWins: 123, sumPlacement: 9199, sumDamage: 98123, sumEliminations: 98 },
     *  { key: "wraith", numMatches: 12, sumWins: 1, sumPlacement: 42, sumDamage: 9123, sumEliminations: 10 },
     *  { key: "caustic", numMatches: 51, sumWins: 2, sumPlacement: 159, sumDamage: 1234, sumEliminations: 30 },
     */
    public static matchListSumStatsGroupedBy<T>(
        matchList: MatchDataStore[],
        groupByPredicate?: (match: MatchDataStore) => T
    ): Array<MatchStats & { key: T }> {
        const matchesMapped = matchList.reduce<Map<T, MatchStats>>((summed, currMatch) => {
            const groupByKey: T = typeof groupByPredicate === "function" ? groupByPredicate(currMatch) : (currMatch.matchId as any);
            const prevStats: Optional<MatchStats> = summed.get(groupByKey);
            const newStats = reduceMatchStatsFn(prevStats, currMatch);

            return summed.set(groupByKey, newStats);
        }, new Map());

        const matchStats = Array.from(matchesMapped, ([groupByKey, match]) => ({
            ...match,
            key: groupByKey,
        }));
        return matchStats;
    }

    private setupMatchStateEvents(): void {
        this.match.startedEvent$.pipe(takeUntil(this.isDestroyed$)).subscribe(() => {
            this.myDamage$.next(0);
            this.myEliminations$.next(0);
            this.myAssists$.next(0);
            this.mySpectators$.next(0);
            this.myPlacement$.next(0);
            this.victory$.next(false);
            this.myKnockdowns$.next(0);
        });
    }

    private setupInfoTabs(): void {
        const setAmountFn = (newAmount: number, subject: BehaviorSubject<number>): void => {
            newAmount = cleanInt(newAmount);
            subject.next(newAmount);
        };

        this.overwolfGameData.infoUpdates$
            .pipe(
                filter((infoUpdate) => infoUpdate.feature === "match_info" && !!infoUpdate.info.match_info?.tabs),
                map((infoUpdate) => infoUpdate.info.match_info?.tabs)
            )
            .subscribe((tabs) => {
                if (!tabs || isEmpty(tabs)) return;
                setAmountFn(tabs.kills, this.myEliminations$);
                setAmountFn(tabs.assists, this.myAssists$);
                setAmountFn(tabs.damage, this.myDamage$);
                this.myPlacement$.next(cleanInt(tabs.teams));
                this.mySpectators$.next(cleanInt(tabs.spectators));
            });
    }

    private setupTotalDamageDealt(): void {
        this.overwolfGameData.infoUpdates$
            .pipe(
                takeUntil(this.isDestroyed$),
                filter((infoUpdate) => infoUpdate.feature === "damage" && !!infoUpdate.info.me?.totalDamageDealt),
                map((infoUpdate) => cleanInt(infoUpdate.info.me?.totalDamageDealt))
            )
            .subscribe((totalDamageDealt) => this.myTotalDamageDealt$.next(totalDamageDealt));
    }

    private setupVictory(): void {
        const setVictoryFn = (newValue: boolean): void => {
            if (newValue !== this.victory$.value) this.victory$.next(newValue);
        };

        this.match.state$
            .pipe(
                takeUntil(this.isDestroyed$),
                tap((stateChanged) => (stateChanged.state === MatchState.Active ? setVictoryFn(false) : null)),
                switchMap(() => this.overwolfGameData.infoUpdates$),
                filter(() => {
                    const myState = this.matchPlayer.myState$.value;
                    return myState !== PlayerState.Eliminated && myState !== PlayerState.Disconnected;
                }),
                filter((infoUpdate) => infoUpdate.feature === "rank"),
                map((infoUpdate) => infoUpdate.info.match_info),
                filter((matchInfo) => !!matchInfo && !!Object.keys(matchInfo).includes("victory")),
                filter((matchInfo) => !isEmpty(matchInfo?.victory)),
                map((matchInfo) => parseBoolean(matchInfo?.victory))
            )
            .subscribe((isVictory) => {
                this.myPlacement$.next(1);
                this.victory$.next(isVictory);
            });
    }

    private setupMyKnockdowns(): void {
        this.matchPlayerInfliction.myKillfeedEvent$
            .pipe(
                takeUntil(this.isDestroyed$),
                filter((myKillfeedEvent) => !!myKillfeedEvent.isKnockdown)
            )
            .subscribe(() => {
                this.myKnockdowns$.next(this.myKnockdowns$.value + 1);
            });
    }
}

function reduceMatchStatsFn(prev: Optional<MatchStats>, curr: MatchDataStore): MatchStats {
    return {
        wins: curr.placement === 1 ? (prev?.wins ?? 0) + 1 : prev?.wins ?? 0,
        placement: (prev?.placement ?? 0) + curr.placement,
        damage: (prev?.damage ?? 0) + curr.damage,
        eliminations: (prev?.eliminations ?? 0) + curr.eliminations,
        duration: (prev?.duration ?? 0) + (curr.endDate.getTime() - curr.startDate.getTime()),
        numMatches: (prev?.numMatches ?? 0) + 1,
    };
}

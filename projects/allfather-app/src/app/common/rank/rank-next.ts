import { Rank, RankTierDivision, RankTierLevel, RankTierLevels, RankTierName } from "./rank";

export class RankNext {
    public get friendlyName(): string {
        let friendlyName = `${this.tierName}`;
        if (this.tierDivision !== "") {
            friendlyName += ` ${this.tierDivision}`;
        }
        return friendlyName;
    }

    public get tierDivisionMinScore(): number {
        return RankNext.getNextScoreFromScore(this.currentRank.score);
    }

    public get tierName(): RankTierName {
        return RankNext.getNextTierNameFromScore(this.currentRank.score);
    }

    public get tierDivision(): RankTierDivision {
        return RankNext.getNextTierDivisionFromScore(this.currentRank.score);
    }

    /** Number of RP needed to reach the next tier division */
    public get tierDivisionDistance(): number {
        if (this.tierDivisionMinScore === Infinity) return 0;
        return Math.min(this.tierDivisionMinScore - this.currentRank.score, Rank.maxPossibleScore);
    }

    /**
     * Percent of progress made from the current tier division to the next
     * @returns percent from 0 to 1
     */
    public get tierDivisionProgressPercent(): number {
        if (this.tierDivisionMinScore === Infinity) return 0;

        const totalDistance = this.tierDivisionMinScore - this.currentRank.tierDivisionMinScore;
        const percentProgress = this.currentRank.tierDivisionProgress / totalDistance;
        return percentProgress;
    }

    private currentRank: Rank;

    constructor(ctor: number | Rank) {
        if (ctor instanceof Rank) {
            this.currentRank = ctor;
        } else {
            this.currentRank = new Rank({ score: ctor });
        }
    }

    //#region Static Methods
    public static getNextScoreFromScore(rankScore: number): number {
        return RankNext.getNextTierLevelFromScore(rankScore).minScore;
    }

    public static getNextTierNameFromScore(rankScore: number): RankTierName {
        return RankNext.getNextTierLevelFromScore(rankScore).tier;
    }

    public static getNextTierDivisionFromScore(rankScore: number): RankTierDivision {
        return RankNext.getNextTierLevelFromScore(rankScore).division;
    }

    public static getNextScoreFromRankLevel(tierName: RankTierName, tierDivision: RankTierDivision): number {
        return RankNext.getNextTierLevelFromRankLevel(tierName, tierDivision).minScore;
    }

    public static getNextTierNameFromRankLevel(tierName: RankTierName, tierDivision: RankTierDivision): RankTierName {
        return RankNext.getNextTierLevelFromRankLevel(tierName, tierDivision).tier;
    }

    public static getNextTierDivisionFromRankLevel(tierName: RankTierName, tierDivision: RankTierDivision): RankTierDivision {
        return RankNext.getNextTierLevelFromRankLevel(tierName, tierDivision).division;
    }

    /** Defaults to Apex Predator if not found */
    public static getNextTierLevelFromScore(rankScore: number): RankTierLevel {
        const foundRankTierLevelIndex = [...RankTierLevels].findIndex((tierLevel, index, obj) => {
            const nextTier = obj[index + 1];
            const nextMinScore: number = nextTier?.minScore ?? 0;
            return rankScore >= tierLevel.minScore && rankScore < nextMinScore;
        });
        const nextRankTierLevelIndex =
            foundRankTierLevelIndex >= 0 ? Math.min(foundRankTierLevelIndex, RankTierLevels.length - 1) + 1 : RankTierLevels.length - 1;
        return RankTierLevels[nextRankTierLevelIndex];
    }

    /** Defaults to Apex Predator if not found */
    public static getNextTierLevelFromRankLevel(tierName: RankTierName, tierDivision: RankTierDivision): RankTierLevel {
        const foundRankTierLevelIndex = [...RankTierLevels].findIndex((tierLevel) => {
            return tierLevel.tier === tierName && tierLevel.division === tierDivision;
        });
        const nextRankTierLevelIndex =
            foundRankTierLevelIndex >= 0 ? Math.min(foundRankTierLevelIndex, RankTierLevels.length - 1) + 1 : RankTierLevels.length - 1;
        return RankTierLevels[nextRankTierLevelIndex];
    }
    //#endregion
}

/** Friendly naming */
export enum RankTierName {
    Rookie = "Rookie",
    Bronze = "Bronze",
    Silver = "Silver",
    Gold = "Gold",
    Platinum = "Platinum",
    Diamond = "Diamond",
    Master = "Master",
    ApexPredator = "Apex Predator",
}

export type RankTierDivision = "" | "I" | "II" | "III" | "IV";
export const RankTierDivisionMap: { [num: number]: RankTierDivision } = {
    0: "",
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
};
/** HEX Colors also found in SCSS */
export const RankTierHEXColor: { [tierName in RankTierName]: string } = {
    Rookie: "#75584c",
    Bronze: "#75584c",
    Silver: "#afafb9",
    Gold: "#b99f6f",
    Platinum: "#549ab5",
    Diamond: "#31a3ff",
    Master: "#7e4ad7",
    "Apex Predator": "#ff5f58",
};

export interface RankTierLevel {
    minScore: number;
    tier: RankTierName;
    division: RankTierDivision;
}
export const RankTierLevels: RankTierLevel[] = [
    // Rookie
    { minScore: 0, tier: RankTierName.Rookie, division: RankTierDivisionMap[4] },
    { minScore: 250, tier: RankTierName.Rookie, division: RankTierDivisionMap[3] },
    { minScore: 500, tier: RankTierName.Rookie, division: RankTierDivisionMap[2] },
    { minScore: 750, tier: RankTierName.Rookie, division: RankTierDivisionMap[1] },
    // Bronze
    { minScore: 1000, tier: RankTierName.Bronze, division: RankTierDivisionMap[4] },
    { minScore: 1500, tier: RankTierName.Bronze, division: RankTierDivisionMap[3] },
    { minScore: 2000, tier: RankTierName.Bronze, division: RankTierDivisionMap[2] },
    { minScore: 2500, tier: RankTierName.Bronze, division: RankTierDivisionMap[1] },
    // Silver
    { minScore: 3000, tier: RankTierName.Silver, division: RankTierDivisionMap[4] },
    { minScore: 3600, tier: RankTierName.Silver, division: RankTierDivisionMap[3] },
    { minScore: 4200, tier: RankTierName.Silver, division: RankTierDivisionMap[2] },
    { minScore: 4800, tier: RankTierName.Silver, division: RankTierDivisionMap[1] },
    // Gold
    { minScore: 5400, tier: RankTierName.Gold, division: RankTierDivisionMap[4] },
    { minScore: 6100, tier: RankTierName.Gold, division: RankTierDivisionMap[3] },
    { minScore: 6800, tier: RankTierName.Gold, division: RankTierDivisionMap[2] },
    { minScore: 7500, tier: RankTierName.Gold, division: RankTierDivisionMap[1] },
    // Platinum
    { minScore: 8200, tier: RankTierName.Platinum, division: RankTierDivisionMap[4] },
    { minScore: 9000, tier: RankTierName.Platinum, division: RankTierDivisionMap[3] },
    { minScore: 9800, tier: RankTierName.Platinum, division: RankTierDivisionMap[2] },
    { minScore: 10600, tier: RankTierName.Platinum, division: RankTierDivisionMap[1] },
    // Diamond
    { minScore: 11400, tier: RankTierName.Diamond, division: RankTierDivisionMap[4] },
    { minScore: 12300, tier: RankTierName.Diamond, division: RankTierDivisionMap[3] },
    { minScore: 13200, tier: RankTierName.Diamond, division: RankTierDivisionMap[2] },
    { minScore: 14100, tier: RankTierName.Diamond, division: RankTierDivisionMap[1] },
    // Master
    { minScore: 15000, tier: RankTierName.Master, division: RankTierDivisionMap[0] },
    { minScore: Infinity, tier: RankTierName.ApexPredator, division: RankTierDivisionMap[0] }, // Indeterminable by score
].sort((a, b) => a.minScore - b.minScore);

type RankConstructor = {
    score?: number;
    tierName?: string | RankTierName;
    tierDivision?: number | RankTierDivision;
};
export class Rank {
    //#region Static Properties
    public static maxPossibleScore = Math.max(...RankTierLevels.filter((t) => Number.isInteger(t.minScore)).map((t) => t.minScore));
    //#endregion

    public get friendlyName(): string {
        let friendlyName = `${this.tierName}`;
        if (this.tierDivision !== "") {
            friendlyName += ` ${this.tierDivision}`;
        }
        return friendlyName;
    }

    /** Raw score (ie. 5149) */
    public get score(): number {
        return this._givenScore ?? (this._givenTierName ? Rank.getMinScoreFromRankLevel(this._givenTierName, this._givenTierDivision) : 0);
    }

    /** Progress on the current tier division (ie. 349) */
    public get tierDivisionProgress(): number {
        return Math.max(0, this.score - this.tierDivisionMinScore);
    }

    /** Division based on score OR givenTierName OR defaults to default tier name */
    public get tierName(): RankTierName {
        if (this._givenScore) {
            return Rank.getTierNameFromScore(this._givenScore);
        } else if (this._givenTierName) {
            return this._givenTierName;
        }
        return RankTierName.Rookie;
    }

    /** Division based on score OR givenTierDivision OR defaults to default division */
    public get tierDivision(): RankTierDivision {
        if (this._givenScore) {
            return Rank.getTierDivisionFromScore(this._givenScore);
        } else if (this._givenTierDivision) {
            return this._givenTierDivision;
        }
        return Rank.getDefaultTierDivision(this.tierName);
    }

    /** Minimum score to reach the tier division (ie. 4800) */
    public get tierDivisionMinScore(): number {
        return Rank.getMinScoreFromRankLevel(this.tierName, this.tierDivision);
    }

    private _givenScore?: number;
    private _givenTierName?: RankTierName;
    private _givenTierDivision?: RankTierDivision;

    constructor({ score, tierName, tierDivision }: RankConstructor = {}) {
        if (typeof score === "number") {
            this._givenScore = score;
        } else {
            if (tierName) this._givenTierName = Rank.getTierNameFromString(tierName);
            if (typeof tierDivision === "number") this._givenTierDivision = RankTierDivisionMap[tierDivision];
        }
    }

    //#region Static Methods
    public static getTierNameFromString(inputName: string): RankTierName {
        const name = inputName.toLowerCase().replace(/[_\W+]/gi, "");
        switch (name) {
            case "silver":
                return RankTierName.Silver;
            case "gold":
                return RankTierName.Gold;
            case "platinum":
                return RankTierName.Platinum;
            case "diamond":
                return RankTierName.Diamond;
            case "master":
                return RankTierName.Master;
            case "apexpredator":
                return RankTierName.ApexPredator;
            case "bronze":
                return RankTierName.Bronze;
            case "rookie":
            default:
                return RankTierName.Rookie;
        }
    }

    public static getMinScoreFromRankLevel(tierName: RankTierName, tierDivision?: RankTierDivision): number {
        const foundRankTierLevel = [...RankTierLevels].find((tierLevel) => {
            return tierLevel.tier === tierName && (tierDivision ? tierLevel.division === tierDivision : true);
        });
        return foundRankTierLevel?.minScore ?? 0;
    }

    public static getTierNameFromScore(rankScore: number): RankTierName {
        return Rank.getTierLevelFromScore(rankScore).tier;
    }

    public static getTierDivisionFromScore(rankScore: number): RankTierDivision {
        return Rank.getTierLevelFromScore(rankScore).division;
    }

    public static getTierLevelFromScore(rankScore: number): RankTierLevel {
        const foundRankTierLevel = [...RankTierLevels].find((tierLevel, index, obj) => {
            const nextTier = obj[index + 1];
            const nextMinScore: number = nextTier?.minScore ?? 0;
            return rankScore >= tierLevel.minScore && rankScore < nextMinScore;
        });
        return foundRankTierLevel ?? RankTierLevels[0];
    }

    public static getHEXColorFromRankTierName(tierName: RankTierName): string {
        return RankTierHEXColor[tierName];
    }

    /**
     * Attempts to find the default tier division via tier name;
     * if not, defaults to "IV"
     */
    private static getDefaultTierDivision(tierName: RankTierName): RankTierDivision {
        const foundRankTierLevel = [...RankTierLevels].find((tierLevel) => {
            return tierLevel.tier === tierName;
        });
        return foundRankTierLevel?.division ?? RankTierDivisionMap[4];
    }
    //#endregion
}

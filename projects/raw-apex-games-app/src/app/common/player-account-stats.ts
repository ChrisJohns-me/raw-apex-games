import { Legend } from "./legend/legend";
import { PlatformHardware } from "./platform";

export interface PlayerLevel {
    level: number;
    nextLevelPercent: number;
}

export interface PlayerBattlePass {
    level: number;
}

interface AccountStatus {
    partyPrivacy: "open" | "invite";
    isOnline: boolean;
    isInGame: boolean;
    isJoinable: boolean;
    isPartyFull: boolean;
    selectedLegend?: Legend;
    selectedLegendName: string; // "Octane"
}

export interface PlayerAccountStatsConstructor {
    playerName: string;
    statsVersion?: number;
    uid?: number;
    platformHardware?: PlatformHardware;
    level?: PlayerLevel;
    // rank?: Rank;
    battlePass?: PlayerBattlePass;
    accountStatus?: AccountStatus;
}

export class PlayerAccountStats implements PlayerAccountStatsConstructor {
    public playerName: string;
    public statsVersion?: number;
    public uid?: number;
    public platformHardware?: PlatformHardware;
    public level?: PlayerLevel;
    // public rank?: Rank;
    // public nextRank?: RankNext;
    public battlePass?: PlayerBattlePass;
    public accountStatus?: AccountStatus;

    constructor(ctor: PlayerAccountStatsConstructor) {
        this.playerName = ctor.playerName;
        this.statsVersion = ctor.statsVersion;
        this.uid = ctor.uid;
        this.platformHardware = ctor.platformHardware;
        this.level = ctor.level;
        // this.rank = ctor.rank;
        this.battlePass = ctor.battlePass;
        this.accountStatus = ctor.accountStatus;

        // if (this.rank) this.nextRank = new RankNext(this.rank);

        if (this.accountStatus && this.accountStatus?.selectedLegendName) {
            const legendId = Legend.generateLegendId(this.accountStatus.selectedLegendName);
            this.accountStatus!.selectedLegend = new Legend(legendId);
        }
    }
}

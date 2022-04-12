import { PlatformHardware } from "@allfather-app/app/common/platform";
import { PlayerAccountStats, PlayerBattlePass, PlayerLevel } from "@allfather-app/app/common/player-account-stats";
import { Rank } from "@allfather-app/app/common/rank/rank";
import { sanitizePlayerName } from "@allfather-app/app/common/utilities/player";
import { ɵ_sanitizeUrl } from "@angular/core";
import { cleanInt, isEmpty, mathClamp } from "common/utilities/";

export enum MozambiqueherePlatform {
    PC = "PC",
    X1 = "X1",
    PS4 = "PS4",
    Switch = "Switch", // Not in use
}

interface GlobalRankDTO {
    rankScore: number;
    rankName: string;
    rankDiv: number;
    ladderPosPlatform: number;
    rankImg: string;
    rankedSeason: string;
}

interface GlobalArenaDTO {
    rankName: string;
    rankDiv: number;
    ladderPosPlatform: number;
    rankImg: string;
    rankedSeason: string;
}

interface GlobalBattlePassDTO {
    level: number;
    history: {
        [seasonName: string]: number;
    };
}

interface GlobalDTO {
    name: string;
    uid: number;
    avatar: string;
    platform: string;
    level: number;
    toNextLevelPercent: number;
    internalUpdateCount: number;
    rank?: GlobalRankDTO;
    arena?: GlobalArenaDTO;
    battlepass?: GlobalBattlePassDTO;
}

interface RealtimeDTO {
    lobbyState: string;
    isOnline: boolean;
    isInGame: boolean;
    canJoin: boolean;
    partyFull: boolean;
    selectedLegend: string;
}

export class PlayerAccountStatsMozambiquehereDTO {
    public global?: GlobalDTO;
    public realtime?: RealtimeDTO;
    public Error?: string;

    constructor(json: unknown) {
        if (!isPlayerAccountStatsMozambiquehereDTO(json))
            throw Error(
                `Unable to create API MozambiqueHe.re Account Stats data transfer object.` +
                    (Array.isArray(json) ? " Array was provided instead; check to see if a list was provided to the API." : "")
            );
        this.global = this.sanitizeGlobal(json.global);
        this.realtime = this.sanitizeRealtime(json.realtime);
        this.Error = json.Error;
    }

    /**
     * @throws Error if JSON contains `.Error` property
     */
    public toPlayerAccountStats(): PlayerAccountStats {
        if (!isEmpty(this.Error)) {
            throw Error(this.Error);
        }

        const accountStatus = {
            partyPrivacy: (this.realtime?.lobbyState as "open" | "invite") ?? "open",
            isOnline: !!this.realtime?.isOnline,
            isInGame: !!this.realtime?.isInGame,
            isJoinable: !!this.realtime?.canJoin,
            isPartyFull: !!this.realtime?.partyFull,
            selectedLegendName: this.realtime?.selectedLegend ?? "",
        };
        const platform = this.global?.platform ?? MozambiqueherePlatform.PC;
        const platformHardware =
            platform === MozambiqueherePlatform.PC
                ? PlatformHardware.PC
                : platform === MozambiqueherePlatform.X1
                ? PlatformHardware.Xbox
                : platform === MozambiqueherePlatform.PS4
                ? PlatformHardware.PlayStation
                : platform === MozambiqueherePlatform.Switch
                ? PlatformHardware.Switch
                : PlatformHardware.PC;
        const level: PlayerLevel = {
            level: this.global?.level ?? 0,
            nextLevelPercent: cleanInt(this.global?.toNextLevelPercent ?? 0) / 100 ?? 0,
        };
        const battlePass: PlayerBattlePass = {
            level: this.global?.battlepass?.level ?? 0,
        };
        const rank: Rank = new Rank({
            score: this.global?.rank?.rankScore ?? 0,
            tierName: this.global?.rank?.rankName ?? "",
            tierDivision: this.global?.rank?.rankDiv ?? 0,
        });

        return new PlayerAccountStats({
            playerName: this.global?.name ?? "",
            statsVersion: this.global?.internalUpdateCount,
            uid: this.global?.uid,
            battlePass,
            level,
            platformHardware,
            rank,
            accountStatus,
        });
    }

    private sanitizeGlobal(input?: GlobalDTO): Optional<GlobalDTO> {
        if (!input) return;
        return {
            name: input.name ? sanitizePlayerName(input.name) : "",
            uid: cleanInt(input.uid),
            avatar: ɵ_sanitizeUrl(input.avatar),
            platform: input.platform ? this.sanitizeNonWordCharacters(input.platform) : "PC",
            level: cleanInt(input.level),
            toNextLevelPercent: mathClamp(cleanInt(input.toNextLevelPercent), 0, 100),
            internalUpdateCount: cleanInt(input.internalUpdateCount),
            rank: this.sanitizeGlobalRank(input.rank),
            battlepass: this.sanitizeGlobalBattlePass(input.battlepass),
        };
    }

    private sanitizeGlobalRank(input?: GlobalRankDTO): Optional<GlobalRankDTO> {
        if (!input) return;
        return {
            rankScore: cleanInt(input.rankScore),
            rankName: input.rankName ? this.sanitizeNonWordCharacters(input.rankName) : "Bronze",
            rankDiv: input.rankDiv ? cleanInt(input.rankDiv) : 4,
            ladderPosPlatform: cleanInt(input.ladderPosPlatform),
            rankImg: input.rankImg ? ɵ_sanitizeUrl(input.rankImg) : "",
            rankedSeason: this.sanitizeNonWordCharacters(input.rankedSeason),
        };
    }

    private sanitizeGlobalBattlePass(input?: GlobalBattlePassDTO): Optional<GlobalBattlePassDTO> {
        if (!input) return;
        const history: { [seasonNum: string]: number } = {};
        Object.entries(input.history ?? {}).forEach(([seasonName, level]) => {
            const newSeasonName = this.sanitizeNonWordCharacters(seasonName);
            const newLevel = cleanInt(level);
            history[newSeasonName] = newLevel;
        });
        return {
            level: cleanInt(input.level),
            history,
        };
    }

    private sanitizeRealtime(input?: RealtimeDTO): Optional<RealtimeDTO> {
        if (!input) return;
        return {
            lobbyState: this.sanitizeNonWordCharacters(input.lobbyState),
            isOnline: !!input.isOnline,
            isInGame: !!input.isInGame,
            canJoin: !!input.canJoin,
            partyFull: !!input.partyFull,
            selectedLegend: this.sanitizeNonWordCharacters(input.selectedLegend),
        };
    }

    private sanitizeNonWordCharacters(input?: string): string {
        return input?.replace(/\W+/gi, "") ?? "";
    }
}

function isPlayerAccountStatsMozambiquehereDTO(value: unknown): value is PlayerAccountStatsMozambiquehereDTO {
    if (typeof value !== "object") return false;
    if (
        isGlobal((value as PlayerAccountStatsMozambiquehereDTO).global) ||
        isRealtime((value as PlayerAccountStatsMozambiquehereDTO).realtime) ||
        typeof (value as PlayerAccountStatsMozambiquehereDTO).Error === "string"
    )
        return true;
    return false;
}

function isGlobal(value: unknown): value is GlobalDTO {
    if (typeof value !== "object") return false;
    if (typeof (value as GlobalDTO).name !== "string") return false;
    if (typeof (value as GlobalDTO).uid !== "number") return false;
    if (typeof (value as GlobalDTO).avatar !== "string") return false;
    if (typeof (value as GlobalDTO).platform !== "string") return false;
    if (typeof (value as GlobalDTO).level !== "number") return false;
    if (typeof (value as GlobalDTO).toNextLevelPercent !== "number") return false;
    if (typeof (value as GlobalDTO).internalUpdateCount !== "number") return false;
    if (!isGlobalRank((value as GlobalDTO).rank)) return false;
    if (!isGlobalBattlePass((value as GlobalDTO).battlepass)) return false;
    return true;
}

function isGlobalRank(value: unknown): value is GlobalRankDTO {
    if (typeof value !== "object") return false;
    if (typeof (value as GlobalRankDTO).rankScore !== "number") return false;
    if (typeof (value as GlobalRankDTO).rankName !== "string") return false;
    if (typeof (value as GlobalRankDTO).rankDiv !== "number") return false;
    if (typeof (value as GlobalRankDTO).rankImg !== "string") return false;
    if (typeof (value as GlobalRankDTO).rankedSeason !== "string") return false;
    return true;
}

function isGlobalBattlePass(value: unknown): value is GlobalBattlePassDTO {
    if (typeof value !== "object") return false;
    // given BattlePass Level is usually a string
    if (typeof (value as GlobalBattlePassDTO).level !== "number" && typeof (value as GlobalBattlePassDTO).level !== "string") return false;
    if (typeof (value as GlobalBattlePassDTO).history !== "object") return false;
    return true;
}

function isRealtime(value: unknown): value is RealtimeDTO {
    if (typeof value !== "object") return false;
    if (typeof (value as RealtimeDTO).lobbyState !== "string") return false;
    if (typeof (value as RealtimeDTO).isOnline !== "number") return false;
    if (typeof (value as RealtimeDTO).isInGame !== "number") return false;
    if (typeof (value as RealtimeDTO).canJoin !== "number") return false;
    if (typeof (value as RealtimeDTO).partyFull !== "number") return false;
    if (typeof (value as RealtimeDTO).selectedLegend !== "string") return false;
    return true;
}

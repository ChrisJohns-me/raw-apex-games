import { wordsToUpperCase } from "common/utilities/";
import { MatchGameModePlaylist } from "../game-mode-playlist";
import { MatchGameModeFriendlyName, MatchGameModeGenericId } from "./game-mode.enum";

interface MatchGameModeConstructor {
    gameModeId: string;
    /** Used as an alternate way to determine the game mode */
    gameModeIdRegExPattern?: string;
    gameModeName: MatchGameModeFriendlyName;
    gameModeGenericId: MatchGameModeGenericId;
    gamePlaylist: MatchGameModePlaylist;
    isReportable?: boolean;
    /** FiringRange or Training game modes */
    isSandboxGameMode?: boolean;
    isBattleRoyaleGameMode?: boolean;
    isControlGameMode?: boolean;
    isGunGameGameMode?: boolean;
    isRanked?: boolean;
}
export class MatchGameMode {
    public gameModeId: string;
    public gameModeIdRegExPattern?: string;
    public gameModeName: MatchGameModeFriendlyName;
    public gameModeGenericId: MatchGameModeGenericId;
    public gamePlaylist: MatchGameModePlaylist;
    public isReportable: boolean;
    public isSandboxGameMode: boolean;
    public isBattleRoyaleGameMode: boolean;
    public isControlGameMode: boolean;
    public isGunGameGameMode: boolean;

    constructor(ctor: MatchGameModeConstructor) {
        this.gameModeId = ctor.gameModeId;
        this.gameModeIdRegExPattern = ctor.gameModeIdRegExPattern;
        this.gameModeName = ctor.gameModeName;
        this.gameModeGenericId = ctor.gameModeGenericId;
        this.gamePlaylist = ctor.gamePlaylist;
        this.isReportable = ctor.isReportable ?? true;
        this.isSandboxGameMode = ctor.isSandboxGameMode ?? false;
        this.isBattleRoyaleGameMode = ctor.isBattleRoyaleGameMode ?? false;
        this.isControlGameMode = ctor.isControlGameMode ?? false;
        this.isGunGameGameMode = ctor.isGunGameGameMode ?? false;
    }

    //#region Static Methods
    public static getFromId(matchGameModeList: MatchGameMode[], gameModeId: string): MatchGameMode {
        const idCleanFn = (id: string): string => id.toLowerCase().replace(/[_\W]+/gi, "");

        // First: Try by raw ID
        const foundGameMode = matchGameModeList.find((gameMode) => idCleanFn(gameMode.gameModeId) === idCleanFn(gameModeId));
        if (foundGameMode) return foundGameMode;
        // Second: Try by regEx pattern
        const regExFoundGameMode = matchGameModeList.find((gameMode) => {
            if (!gameMode.gameModeIdRegExPattern) return false;
            return new RegExp(gameMode.gameModeIdRegExPattern, "i").test(gameModeId);
        });
        if (regExFoundGameMode) return regExFoundGameMode;
        // Third: Default to empty game mode
        return MatchGameMode.generateDefaultGameModeById(gameModeId);
    }

    private static generateDefaultGameModeById(gameModeId: string): MatchGameMode {
        let gameModeName = gameModeId.toLowerCase();
        gameModeName = gameModeName.replace("#pl_", "");
        gameModeName = gameModeName.replace("gamemode", "");
        gameModeName = gameModeName.replace("mode", "");
        gameModeName = gameModeName.replace("name", "");
        gameModeName = gameModeName.replace(/[_\W]+/gi, "");
        gameModeName = wordsToUpperCase(gameModeName);
        if (!gameModeName) gameModeName = "Unknown";

        let gamePlaylist = MatchGameModePlaylist.Sandbox;
        let isSandboxGameMode = false;
        let isBattleRoyaleGameMode = false;
        let isControlGameMode = false;
        let isGunGameGameMode = false;
        let isRanked = false;
        if (new RegExp("training|firingrange", "i").test(gameModeId)) {
            isSandboxGameMode = true;
            gamePlaylist = MatchGameModePlaylist.Sandbox;
        } else if (new RegExp("trios|duos|ranked_leagues", "i").test(gameModeId)) {
            isRanked = new RegExp("ranked_leagues", "i").test(gameModeId);
            isBattleRoyaleGameMode = true;
        } else if (new RegExp("control", "i").test(gameModeId)) {
            isControlGameMode = true;
        } else if (new RegExp("gungame", "i").test(gameModeId)) {
            isGunGameGameMode = true;
        }

        return new MatchGameMode({
            gameModeId,
            gameModeGenericId: gameModeId as MatchGameModeGenericId,
            gameModeName: gameModeName as MatchGameModeFriendlyName,
            gamePlaylist,
            isSandboxGameMode,
            isBattleRoyaleGameMode,
            isControlGameMode,
            isGunGameGameMode,
            isRanked,
        });
    }
    //#endregion
}

import { wordsToUpperCase } from "common/utilities/";
import { MatchGameModeFriendlyName, MatchGameModeGenericId } from "./game-mode.enum";

interface MatchGameModeConstructor {
    gameModeId: string;
    /** Used as an alternate way to determine the game mode */
    gameModeIdRegExPattern?: string;
    gameModeName: MatchGameModeFriendlyName;
    gameModeGenericId: MatchGameModeGenericId;
    isReportable?: boolean;
    /** FiringRange or Training game modes */
    isSandboxGameMode?: boolean;
    isBattleRoyaleGameMode: boolean;
    isControlGameMode: boolean;
    isRanked?: boolean;
}
export class MatchGameMode {
    public gameModeId: string;
    public gameModeIdRegExPattern?: string;
    public gameModeName: MatchGameModeFriendlyName;
    public gameModeGenericId: MatchGameModeGenericId;
    public isReportable: boolean;
    public isSandboxGameMode: boolean;
    public isBattleRoyaleGameMode: boolean;
    public isControlGameMode: boolean;

    constructor(ctor: MatchGameModeConstructor) {
        this.gameModeId = ctor.gameModeId;
        this.gameModeIdRegExPattern = ctor.gameModeIdRegExPattern;
        this.gameModeName = ctor.gameModeName;
        this.gameModeGenericId = ctor.gameModeGenericId;
        this.isReportable = ctor.isReportable ?? true;
        this.isSandboxGameMode = ctor.isSandboxGameMode ?? false;
        this.isBattleRoyaleGameMode = ctor.isBattleRoyaleGameMode;
        this.isControlGameMode = ctor.isControlGameMode;
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
        gameModeName = gameModeName.replace(/[_\W]+/gi, "");
        gameModeName = wordsToUpperCase(gameModeName);
        if (!gameModeName) gameModeName = "Unknown";
        const gameModeGenericId = gameModeId;
        const isBattleRoyaleGameMode = new RegExp("trios|duos|ranked_leagues", "i").test(gameModeId);
        const isControlGameMode = !isBattleRoyaleGameMode && new RegExp("control", "i").test(gameModeId);

        return new MatchGameMode({
            gameModeId,
            gameModeGenericId: gameModeGenericId as MatchGameModeGenericId,
            gameModeName: gameModeName as MatchGameModeFriendlyName,
            isBattleRoyaleGameMode,
            isControlGameMode,
        });
    }
    //#endregion
}

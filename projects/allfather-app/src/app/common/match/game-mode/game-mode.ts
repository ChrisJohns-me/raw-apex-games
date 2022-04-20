import { wordsToUpperCase } from "common/utilities/";
import { MatchGameModeFriendlyName, MatchGameModeGenericId } from "./game-mode.enum";

type ActiveDates = Array<{
    from: Date; // Useful to also cross-reference with the current date
    to?: Date; // if undefined, game mode is currently active
}>;

interface MatchGameModeConstructor {
    gameModeId: string;
    /** Used as an alternate way to determine the game mode */
    gameModeIdRegExPattern?: string;
    gameModeName: MatchGameModeFriendlyName;
    gameModeGenericId: MatchGameModeGenericId;
    /** Is supported by Allfather app; typically used by certain UI windows to display */
    isAFSupported?: boolean;
    isReportable?: boolean;
    isBattleRoyaleGameMode: boolean;
    isArenasGameMode: boolean;
    isControlGameMode: boolean;
    activeDates?: ActiveDates;
}
export class MatchGameMode {
    public gameModeId: string;
    public gameModeIdRegExPattern?: string;
    public gameModeName: MatchGameModeFriendlyName;
    public gameModeGenericId: MatchGameModeGenericId;
    public isAFSupported?: boolean;
    public isReportable?: boolean;
    public isBattleRoyaleGameMode: boolean;
    public isArenasGameMode: boolean;
    public isControlGameMode: boolean;
    public activeDates?: ActiveDates;

    public get isActive(): boolean {
        return !!this.activeDates?.some((date) => date.to == null && date.from <= new Date());
    }

    constructor(ctor: MatchGameModeConstructor) {
        this.gameModeId = ctor.gameModeId;
        this.gameModeIdRegExPattern = ctor.gameModeIdRegExPattern;
        this.gameModeName = ctor.gameModeName;
        this.gameModeGenericId = ctor.gameModeGenericId;
        this.isAFSupported = ctor.isAFSupported ?? true;
        this.isReportable = ctor.isReportable ?? true;
        this.isBattleRoyaleGameMode = ctor.isBattleRoyaleGameMode;
        this.isArenasGameMode = ctor.isArenasGameMode;
        this.isControlGameMode = ctor.isControlGameMode;
        this.activeDates = ctor.activeDates;
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
        const isArenasGameMode = !isBattleRoyaleGameMode && new RegExp("arena", "i").test(gameModeId);
        const isControlGameMode = !isBattleRoyaleGameMode && !isArenasGameMode && new RegExp("control", "i").test(gameModeId);

        return new MatchGameMode({
            gameModeId,
            gameModeGenericId: gameModeGenericId as MatchGameModeGenericId,
            gameModeName: gameModeName as MatchGameModeFriendlyName,
            isBattleRoyaleGameMode,
            isArenasGameMode,
            isControlGameMode,
        });
    }
    //#endregion
}

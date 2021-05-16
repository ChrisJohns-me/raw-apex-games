export enum MatchGameModeType {
    TRAINING = "training",
    FIRINGRANGE = "firingrange",
    ARENA = "arena",
    TRIOS = "trios",
    DUOS = "duos",
    RANKED = "ranked",
}

export class MatchGameMode {
    constructor(public gameModeId?: string) {}

    //#region Static Methods
    public static getBaseType(gameModeId?: string): Optional<MatchGameModeType> {
        return MatchGameMode.generateBaseType(gameModeId);
    }
    //#endregion

    //#region Instantiation Methods
    public get baseType(): Optional<MatchGameModeType> {
        return MatchGameMode.generateBaseType(this.gameModeId);
    }
    //#endregion

    private static generateBaseType(gameModeId?: string): Optional<MatchGameModeType> {
        if (gameModeId?.toLowerCase().includes("training")) return MatchGameModeType.TRAINING;
        if (gameModeId?.toLowerCase().includes("firingrange")) return MatchGameModeType.FIRINGRANGE;
        if (gameModeId?.toLowerCase().includes("arena")) return MatchGameModeType.ARENA;
        if (gameModeId?.toLowerCase().includes("rank")) return MatchGameModeType.RANKED;
        if (gameModeId?.toLowerCase().includes("trio")) return MatchGameModeType.TRIOS;
        if (gameModeId?.toLowerCase().includes("duo")) return MatchGameModeType.DUOS;
        return undefined;
    }
}

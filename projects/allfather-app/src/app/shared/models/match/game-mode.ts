export enum MatchGameModeType {
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
        if (gameModeId?.toLowerCase().includes("rank")) return MatchGameModeType.RANKED;
        if (gameModeId?.toLowerCase().includes("trio")) return MatchGameModeType.TRIOS;
        if (gameModeId?.toLowerCase().includes("duo")) return MatchGameModeType.DUOS;
        return undefined;
    }
}

export enum MatchGameModeType {
    Training = "training",
    FiringRange = "firingrange",
    Arenas = "arenas",
    BattleRoyale_Trios = "br_trios",
    BattleRoyale_Duos = "br_duos",
    BattleRoyale_Ranked = "br_ranked",
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
        if (gameModeId?.toLowerCase().includes("training")) return MatchGameModeType.Training;
        if (gameModeId?.toLowerCase().includes("firingrange")) return MatchGameModeType.FiringRange;
        if (gameModeId?.toLowerCase().includes("arena")) return MatchGameModeType.Arenas;
        if (gameModeId?.toLowerCase().includes("rank")) return MatchGameModeType.BattleRoyale_Ranked;
        if (gameModeId?.toLowerCase().includes("trio")) return MatchGameModeType.BattleRoyale_Trios;
        if (gameModeId?.toLowerCase().includes("duo")) return MatchGameModeType.BattleRoyale_Duos;
        return undefined;
    }
}

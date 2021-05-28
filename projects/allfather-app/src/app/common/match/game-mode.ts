import { exhaustiveEnumSwitch } from "shared/utilities/switch";

export enum MatchGameModeFriendlyName {
    Training = "Training",
    FiringRange = "Firing Range",
    Arenas = "Arenas",
    BattleRoyale_Trios = "Trios",
    BattleRoyale_Duos = "Duos",
    BattleRoyale_Ranked = "Ranked",
}

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
    /** Friendly name of Game Mode */
    public static getName(gameModeId?: string): Optional<MatchGameModeFriendlyName> {
        return MatchGameMode.generateName(gameModeId);
    }

    /** Genericized type of Game Mode */
    public static getBaseType(gameModeId?: string): Optional<MatchGameModeType> {
        return MatchGameMode.generateBaseType(gameModeId);
    }
    //#endregion

    //#region Instantiation Methods
    public get name(): Optional<MatchGameModeFriendlyName> {
        return MatchGameMode.generateName(this.gameModeId);
    }

    public get baseType(): Optional<MatchGameModeType> {
        return MatchGameMode.generateBaseType(this.gameModeId);
    }
    //#endregion

    private static generateName(gameModeId?: string): Optional<MatchGameModeFriendlyName> {
        const baseType = MatchGameMode.getBaseType(gameModeId);
        if (!baseType) return;

        switch (baseType) {
            case MatchGameModeType.Training:
                return MatchGameModeFriendlyName.Training;
            case MatchGameModeType.FiringRange:
                return MatchGameModeFriendlyName.FiringRange;
            case MatchGameModeType.Arenas:
                return MatchGameModeFriendlyName.Arenas;
            case MatchGameModeType.BattleRoyale_Trios:
                return MatchGameModeFriendlyName.BattleRoyale_Trios;
            case MatchGameModeType.BattleRoyale_Duos:
                return MatchGameModeFriendlyName.BattleRoyale_Duos;
            case MatchGameModeType.BattleRoyale_Ranked:
                return MatchGameModeFriendlyName.BattleRoyale_Ranked;
            default:
                console.error(`Unable to determine Game Mode name from ID "${gameModeId}".`);
                exhaustiveEnumSwitch(baseType);
        }
    }

    private static generateBaseType(gameModeId?: string): Optional<MatchGameModeType> {
        if (gameModeId?.toLowerCase().includes("training")) return MatchGameModeType.Training;
        if (gameModeId?.toLowerCase().includes("firingrange")) return MatchGameModeType.FiringRange;
        if (gameModeId?.toLowerCase().includes("arena")) return MatchGameModeType.Arenas;
        if (gameModeId?.toLowerCase().includes("rank")) return MatchGameModeType.BattleRoyale_Ranked;
        if (gameModeId?.toLowerCase().includes("trio")) return MatchGameModeType.BattleRoyale_Trios;
        if (gameModeId?.toLowerCase().includes("duo")) return MatchGameModeType.BattleRoyale_Duos;
        console.error(`Unable to determine Game Mode type from ID "${gameModeId}".`);
        return undefined;
    }
}

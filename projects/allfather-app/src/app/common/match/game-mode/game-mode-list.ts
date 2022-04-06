import { MatchGameMode } from "./game-mode";
import { MatchGameModeFriendlyName, MatchGameModeGenericId } from "./game-mode.enum";

/** Permanent Game Mode Types */
export const MatchGameModeList: MatchGameMode[] = [
    new MatchGameMode({
        gameModeId: "#PL_TRAINING",
        gameModeGenericId: MatchGameModeGenericId.Training,
        gameModeName: MatchGameModeFriendlyName.Training,
        gameModeIdRegExPattern: "training",
        isAFSupported: true,
        isReportable: false,
        isBattleRoyaleGameMode: false,
        isArenasGameMode: false,
        isControlGameMode: false,
        activeDates: [
            {
                from: new Date(0),
            },
        ],
    }),
    new MatchGameMode({
        gameModeId: "#PL_FIRINGRANGE",
        gameModeGenericId: MatchGameModeGenericId.FiringRange,
        gameModeName: MatchGameModeFriendlyName.FiringRange,
        gameModeIdRegExPattern: "firingrange",
        isAFSupported: true,
        isReportable: false,
        isBattleRoyaleGameMode: false,
        isArenasGameMode: false,
        isControlGameMode: false,
        activeDates: [
            {
                from: new Date(0),
            },
        ],
    }),
    new MatchGameMode({
        gameModeId: "#PL_TRIO",
        gameModeGenericId: MatchGameModeGenericId.BattleRoyale_Trios,
        gameModeName: MatchGameModeFriendlyName.BattleRoyale_Trios,
        gameModeIdRegExPattern: "trio",
        isBattleRoyaleGameMode: true,
        isArenasGameMode: false,
        isControlGameMode: false,
        activeDates: [
            {
                from: new Date(0),
            },
        ],
    }),
    new MatchGameMode({
        gameModeId: "#PL_DUO",
        gameModeGenericId: MatchGameModeGenericId.BattleRoyale_Duos,
        gameModeName: MatchGameModeFriendlyName.BattleRoyale_Duos,
        gameModeIdRegExPattern: "duo",
        isBattleRoyaleGameMode: true,
        isArenasGameMode: false,
        isControlGameMode: false,
        activeDates: [
            {
                from: new Date(0),
            },
        ],
    }),
    new MatchGameMode({
        gameModeId: "#PL_Ranked_Leagues",
        gameModeGenericId: MatchGameModeGenericId.BattleRoyale_Ranked,
        gameModeName: MatchGameModeFriendlyName.BattleRoyale_Ranked,
        gameModeIdRegExPattern: "ranked_leagues",
        isBattleRoyaleGameMode: true,
        isArenasGameMode: false,
        isControlGameMode: false,
        activeDates: [
            {
                from: new Date(0),
            },
        ],
    }),
    new MatchGameMode({
        gameModeId: "#GAMEMODE_ARENAS",
        gameModeGenericId: MatchGameModeGenericId.Arenas,
        gameModeName: MatchGameModeFriendlyName.Arenas,
        gameModeIdRegExPattern: "arenas",
        isReportable: false,
        isBattleRoyaleGameMode: false,
        isArenasGameMode: true,
        isControlGameMode: false,
        activeDates: [
            {
                from: new Date("May 04, 2021"),
            },
        ],
    }),
    new MatchGameMode({
        gameModeId: "#CONTROL_NAME",
        gameModeGenericId: MatchGameModeGenericId.Control,
        gameModeName: MatchGameModeFriendlyName.Control,
        gameModeIdRegExPattern: "control",
        isReportable: false,
        isBattleRoyaleGameMode: false,
        isArenasGameMode: false,
        isControlGameMode: true,
        activeDates: [
            {
                from: new Date("Mar 2, 2022"),
            },
        ],
    }),
];

/**
 * Sorts by:
 *  - Battle Royale game modes first
 *  - Arenas game modes second
 *  - Control game modes third
 *  - Alphabetically
 */
export function sortMatchGameModeList(matchGameModeList: MatchGameMode[]): MatchGameMode[] {
    return matchGameModeList.sort((a, b) => {
        if (a.isBattleRoyaleGameMode && !b.isBattleRoyaleGameMode) return -1;
        if (!a.isBattleRoyaleGameMode && b.isBattleRoyaleGameMode) return 1;
        if (a.isArenasGameMode && !b.isArenasGameMode) return -1;
        if (!a.isArenasGameMode && b.isArenasGameMode) return 1;
        if (a.isControlGameMode && !b.isControlGameMode) return -1;
        if (!a.isControlGameMode && b.isControlGameMode) return 1;
        if (a.gameModeName.toLowerCase() < b.gameModeName.toLowerCase()) return -1;
        if (a.gameModeName.toLowerCase() > b.gameModeName.toLowerCase()) return 1;
        return 0;
    });
}

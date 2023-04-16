import { MatchGameMode } from "./game-mode";
import { MatchGameModePlaylist } from "./game-mode-playlist.enum";
import { MatchGameModeFriendlyName, MatchGameModeGenericId } from "./game-mode.enum";

/** Permanent Game Mode Types */
export const MatchGameModeList: MatchGameMode[] = [
    new MatchGameMode({
        gameModeId: "#PL_TRAINING",
        gameModeGenericId: MatchGameModeGenericId.Training,
        gameModeName: MatchGameModeFriendlyName.Training,
        gameModeIdRegExPattern: "training",
        gamePlaylist: MatchGameModePlaylist.Sandbox,
        isReportable: false,
        isSandboxGameMode: true,
    }),
    new MatchGameMode({
        gameModeId: "#PL_FIRINGRANGE",
        gameModeGenericId: MatchGameModeGenericId.FiringRange,
        gameModeName: MatchGameModeFriendlyName.FiringRange,
        gameModeIdRegExPattern: "firingrange",
        gamePlaylist: MatchGameModePlaylist.Sandbox,
        isReportable: false,
        isSandboxGameMode: true,
    }),
    new MatchGameMode({
        gameModeId: "#PL_TRIO",
        gameModeGenericId: MatchGameModeGenericId.BattleRoyale_Trios,
        gameModeName: MatchGameModeFriendlyName.BattleRoyale_Trios,
        gamePlaylist: MatchGameModePlaylist.BattleRoyale,
        gameModeIdRegExPattern: "trio",
        isBattleRoyaleGameMode: true,
    }),
    new MatchGameMode({
        gameModeId: "#PL_DUO",
        gameModeGenericId: MatchGameModeGenericId.BattleRoyale_Duos,
        gameModeName: MatchGameModeFriendlyName.BattleRoyale_Duos,
        gamePlaylist: MatchGameModePlaylist.BattleRoyale,
        gameModeIdRegExPattern: "duo",
        isBattleRoyaleGameMode: true,
    }),
    new MatchGameMode({
        gameModeId: "#PL_Ranked_Leagues",
        gameModeGenericId: MatchGameModeGenericId.BattleRoyale_Ranked,
        gameModeName: MatchGameModeFriendlyName.BattleRoyale_Ranked,
        gamePlaylist: MatchGameModePlaylist.BattleRoyale,
        gameModeIdRegExPattern: "ranked_leagues",
        isBattleRoyaleGameMode: true,
        isRanked: true,
    }),
    new MatchGameMode({
        gameModeId: "#CONTROL_NAME",
        gameModeGenericId: MatchGameModeGenericId.Control,
        gameModeName: MatchGameModeFriendlyName.Control,
        gamePlaylist: MatchGameModePlaylist.Mixtape,
        gameModeIdRegExPattern: "control",
        isReportable: false,
        isControlGameMode: true,
    }),
    new MatchGameMode({
        gameModeId: "#GAME_MODE_GUNGAME",
        gameModeGenericId: MatchGameModeGenericId.GunGame,
        gameModeName: MatchGameModeFriendlyName.GunGame,
        gamePlaylist: MatchGameModePlaylist.Mixtape,
        gameModeIdRegExPattern: "gungame",
        isReportable: false,
        isGunGameGameMode: true,
    }),
];

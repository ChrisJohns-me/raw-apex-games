import { MatchGameModePlaylist } from "../../../../../app/src/app/common/match/game-mode/game-mode-playlist.enum.js";
import { MatchGameModeGenericId } from "../../../../../app/src/app/common/match/game-mode/game-mode.enum.js";
import { RawGameLobby } from "../../../../../shared/common/raw-games/raw-game-lobby.js";

const mockLobbies = [
    new RawGameLobby({
        joinCode: "abc123",
        gameModePlaylist: MatchGameModePlaylist.Sandbox,
        gameModeGenericId: MatchGameModeGenericId.FiringRange,
        organizerOriginId: "master123",
        playerOriginIds: ["master123", "charly"],
        isJoinable: true,
        isStarted: false,
    }),
];

export async function getLobby(joinCode: string): Promise<RawGameLobby> {
    const mockLobby = { ...mockLobbies[0] };
    mockLobby.joinCode = joinCode;
    return Promise.resolve(mockLobby);
}

export async function listLobbies(): Promise<RawGameLobby[]> {
    return Promise.resolve(mockLobbies);
}

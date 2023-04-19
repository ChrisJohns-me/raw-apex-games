import { MatchGameModePlaylist } from "../../../app/src/app/common/match/game-mode/game-mode-playlist.enum.js";
import { MatchGameModeGenericId } from "../../../app/src/app/common/match/game-mode/game-mode.enum.js";

interface RawGameLobbyConstructor {
    joinCode: string; // Serves as an ID
    gameModePlaylist: MatchGameModePlaylist;
    gameModeGenericId: MatchGameModeGenericId;
    organizerOriginId: string;
    playerOriginIds: string[];
    isJoinable: Optional<boolean>;
    isStarted: Optional<boolean>;
}

export class RawGameLobby {
    public joinCode: string;
    public gameModePlaylist: MatchGameModePlaylist;
    public gameModeGenericId: MatchGameModeGenericId;
    public organizerOriginId: string;
    public playerOriginIds: string[];
    public isJoinable: Optional<boolean>;
    public isStarted: Optional<boolean>;

    constructor(ctor: RawGameLobbyConstructor) {
        this.joinCode = ctor.joinCode;
        this.gameModePlaylist = ctor.gameModePlaylist;
        this.gameModeGenericId = ctor.gameModeGenericId;
        this.organizerOriginId = ctor.organizerOriginId;
        this.playerOriginIds = ctor.playerOriginIds ?? [];
        this.isJoinable = ctor.isJoinable;
        this.isStarted = ctor.isStarted;
    }
}

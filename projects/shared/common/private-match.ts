import { MatchGameModePlaylist } from "@app/app/common/match/game-mode/game-mode-playlist.enum";
import { MatchGameModeGenericId } from "@app/app/common/match/game-mode/game-mode.enum";

interface CustomMatchConstructor {
    gameModePlaylist: MatchGameModePlaylist;
    gameModeGenericId: MatchGameModeGenericId;
    joinCode: string;
}

export class CustomMatch {
    public gameModePlaylist: MatchGameModePlaylist;
    public gameModeGenericId: MatchGameModeGenericId;
    public joinCode: string;

    constructor(ctor: CustomMatchConstructor) {
        this.gameModePlaylist = ctor.gameModePlaylist;
        this.gameModeGenericId = ctor.gameModeGenericId;
        this.joinCode = ctor.joinCode;
    }
}

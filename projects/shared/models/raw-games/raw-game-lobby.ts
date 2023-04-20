import { MatchGameModePlaylist } from "@app/models/match/game-mode/game-mode-playlist.enum.js";
import { MatchGameModeGenericId } from "@app/models/match/game-mode/game-mode.enum.js";
import { parseBoolean, removeNonAlphaNumeric } from "@shared/utilities/index.js";
import { DocumentData, FirestoreDataConverter, PartialWithFieldValue, QueryDocumentSnapshot } from "firebase/firestore";
import { $enum } from "ts-enum-util";

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

    public static get firebaseConverter(): FirestoreDataConverter<RawGameLobby> {
        return {
            fromFirestore: (snap: QueryDocumentSnapshot): RawGameLobby => {
                const data = snap.data() as RawGameLobby;
                const rawGameLobby = new RawGameLobby(data);
                return rawGameLobby;
            },
            toFirestore: (data: PartialWithFieldValue<RawGameLobby>): DocumentData => {
                console.log("toFirestore just got called");
                const cleanGameModePlaylist = removeNonAlphaNumeric(data.gameModePlaylist?.toString() ?? "");
                const cleanGameModeGenericId = removeNonAlphaNumeric(data.gameModeGenericId?.toString() ?? "");

                const rawGameLobby: RawGameLobby = {
                    joinCode: removeNonAlphaNumeric(data.joinCode?.toString() ?? ""),
                    gameModePlaylist: $enum(MatchGameModePlaylist).getValueOrDefault(cleanGameModePlaylist, MatchGameModePlaylist.Sandbox),
                    gameModeGenericId: $enum(MatchGameModeGenericId).getValueOrDefault(
                        cleanGameModeGenericId,
                        MatchGameModeGenericId.FiringRange
                    ),
                    organizerOriginId: removeNonAlphaNumeric(data.organizerOriginId?.toString() ?? ""),
                    playerOriginIds: (Array.isArray(data.playerOriginIds) ? data.playerOriginIds : []).map((playerOriginId) =>
                        removeNonAlphaNumeric(playerOriginId?.toString() ?? "")
                    ),
                    isJoinable: parseBoolean(data.isJoinable),
                    isStarted: parseBoolean(data.isStarted),
                };
                return rawGameLobby;
            },
        };
    }
}

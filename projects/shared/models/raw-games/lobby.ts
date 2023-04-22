import { MatchGameModePlaylist } from "#app/models/match/game-mode/game-mode-playlist.enum.js";
import { MatchGameModeGenericId } from "#app/models/match/game-mode/game-mode.enum.js";
import { parseBoolean } from "#shared/utilities/primitives/boolean.js";
import { removeNonAlphaNumeric } from "#shared/utilities/primitives/string.js";
import { isDate } from "date-fns";
import { DocumentData, FirestoreDataConverter, PartialWithFieldValue, QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import { $enum } from "ts-enum-util";

interface RawGameLobbyConstructor {
    joinCode: string; // Serves as an ID
    gameModePlaylist: MatchGameModePlaylist;
    gameModeGenericId: MatchGameModeGenericId;
    organizerOriginId: string;
    playerOriginIds: string[];
    isJoinable?: Optional<boolean>;
    isStarted?: Optional<boolean>;
    createdDate?: Optional<Date>;
}

export class RawGameLobby {
    public joinCode: string;
    public gameModePlaylist: MatchGameModePlaylist;
    public gameModeGenericId: MatchGameModeGenericId;
    public organizerOriginId: string;
    public playerOriginIds: string[];
    public isJoinable?: Optional<boolean>;
    public isStarted?: Optional<boolean>;
    public createdDate?: Optional<Date>;

    constructor(ctor?: ModelCtor<RawGameLobbyConstructor>) {
        this.joinCode = ctor?.joinCode ?? "";
        this.gameModePlaylist = ctor?.gameModePlaylist ?? MatchGameModePlaylist.Sandbox;
        this.gameModeGenericId = ctor?.gameModeGenericId ?? MatchGameModeGenericId.FiringRange;
        this.organizerOriginId = ctor?.organizerOriginId ?? "";
        this.playerOriginIds = ctor?.playerOriginIds ?? [];
        this.isJoinable = ctor?.isJoinable;
        this.isStarted = ctor?.isStarted;
        this.createdDate = ctor?.createdDate;
    }

    public static get firebaseConverter(): FirestoreDataConverter<RawGameLobby> {
        return {
            fromFirestore: (snap: QueryDocumentSnapshot): RawGameLobby => {
                const data = snap.data() as RawGameLobby;
                const rawGameLobby = new RawGameLobby(data);
                return rawGameLobby;
            },
            toFirestore: (data: PartialWithFieldValue<RawGameLobby>): DocumentData => {
                const cleanGameModePlaylist = removeNonAlphaNumeric(data.gameModePlaylist?.toString() ?? "");
                const cleanGameModeGenericId = removeNonAlphaNumeric(data.gameModeGenericId?.toString() ?? "");

                const rawGameLobby: PartialWithFieldValue<RawGameLobby> = {
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
                    createdDate: isDate(data.createdDate) ? Timestamp.fromDate(new Date(data.createdDate as string)) : undefined,
                };
                return rawGameLobby;
            },
        };
    }
}

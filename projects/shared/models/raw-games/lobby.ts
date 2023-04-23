import { MatchGameModePlaylist } from "#app/models/match/game-mode/game-mode-playlist.enum.js";
import { MatchGameModeGenericId } from "#app/models/match/game-mode/game-mode.enum.js";
import { sanitizePlayerName } from "#shared/utilities/player.js";
import { parseBoolean } from "#shared/utilities/primitives/boolean.js";
import { removeNonAlphaNumeric, removeNonAlphaNumericHyphenUnderscore, removeNonNumeric } from "#shared/utilities/primitives/string.js";
import { isDate } from "date-fns";
import { DocumentData, FirestoreDataConverter, PartialWithFieldValue, QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import { $enum } from "ts-enum-util";
import { v4 as uuid } from "uuid";

interface RawGameLobbyConstructor {
    lobbyId: string; // UUID
    lobbyCode: string;
    gameModePlaylist: MatchGameModePlaylist;
    gameModeGenericId: MatchGameModeGenericId;
    organizerOriginId: string;
    organizerPlayerName: string;
    playerOriginIds: string[];
    isJoinable: boolean;
    isStarted: boolean;
    startDate?: Optional<Date>;
    endDate?: Optional<Date>;
}

/**
 * Represents an Apex Legends Custom/Private Lobby for Raw Apex Games.
 */
export class RawGameLobby {
    /** Main identifier for the lobby; Auto-generated if one isn't provided */
    public lobbyId: string;
    public lobbyCode: string;
    public gameModePlaylist: MatchGameModePlaylist;
    public gameModeGenericId: MatchGameModeGenericId;
    public organizerOriginId: string;
    public organizerPlayerName: string;
    public playerOriginIds: string[];
    public isJoinable: boolean;
    public isStarted: boolean;
    public startDate?: Optional<Date>;
    public endDate?: Optional<Date>;

    constructor(ctor?: ModelCtor<RawGameLobbyConstructor>) {
        this.lobbyId = removeNonAlphaNumericHyphenUnderscore(ctor?.lobbyId ?? uuid());
        this.lobbyCode = removeNonAlphaNumeric(ctor?.lobbyCode ?? "");
        this.gameModePlaylist = $enum(MatchGameModePlaylist).getValueOrDefault(ctor?.gameModePlaylist, MatchGameModePlaylist.Sandbox);
        this.gameModeGenericId = $enum(MatchGameModeGenericId).getValueOrDefault(
            ctor?.gameModeGenericId,
            MatchGameModeGenericId.FiringRange
        );
        this.organizerOriginId = removeNonNumeric(ctor?.organizerOriginId ?? "");
        this.organizerPlayerName = sanitizePlayerName(ctor?.organizerPlayerName ?? "");
        this.playerOriginIds = (ctor?.playerOriginIds && Array.isArray(ctor.playerOriginIds) ? ctor.playerOriginIds : []).map(
            (playerOriginId) => removeNonNumeric(playerOriginId?.toString() ?? "")
        );
        this.isJoinable = parseBoolean(ctor?.isJoinable);
        this.isStarted = parseBoolean(ctor?.isStarted);
        this.startDate = ctor?.startDate && isDate(ctor.startDate) ? new Date(ctor.startDate) : undefined;
        this.endDate = ctor?.endDate && isDate(ctor.endDate) ? new Date(ctor.endDate) : undefined;
    }

    public static get firebaseConverter(): FirestoreDataConverter<RawGameLobby> {
        return {
            fromFirestore: (snap: QueryDocumentSnapshot): RawGameLobby => {
                const data = snap.data() as RawGameLobby;
                const rawGameLobby = new RawGameLobby(data);
                return rawGameLobby;
            },
            toFirestore: (data: PartialWithFieldValue<RawGameLobby>): DocumentData => {
                const rawGameLobby: PartialWithFieldValue<RawGameLobby> = {
                    lobbyCode: data.lobbyCode?.toString() ?? "",
                    gameModePlaylist: $enum(MatchGameModePlaylist).getValueOrDefault(
                        data.gameModePlaylist?.toString(),
                        MatchGameModePlaylist.Sandbox
                    ),
                    gameModeGenericId: $enum(MatchGameModeGenericId).getValueOrDefault(
                        data.gameModeGenericId?.toString(),
                        MatchGameModeGenericId.FiringRange
                    ),
                    organizerOriginId: data.organizerOriginId?.toString() ?? "",
                    organizerPlayerName: data.organizerPlayerName?.toString() ?? "",
                    playerOriginIds: Array.isArray(data.playerOriginIds) ? data.playerOriginIds : [],
                    isJoinable: parseBoolean(data.isJoinable),
                    isStarted: parseBoolean(data.isStarted),
                    startDate: isDate(data.startDate) ? Timestamp.fromDate(new Date(data.startDate as string)) : Timestamp.now(),
                    endDate: isDate(data.endDate) ? Timestamp.fromDate(new Date(data.endDate as string)) : Timestamp.now(),
                };
                return rawGameLobby;
            },
        };
    }
}

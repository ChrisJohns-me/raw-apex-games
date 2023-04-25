import { MatchGameModePlaylist } from "#app/models/match/game-mode/game-mode-playlist.enum.js";
import { sanitizePlayerName } from "#shared/utilities/player.js";
import { removeNonAlphaNumeric, removeNonAlphaNumericHyphenUnderscore, removeNonNumeric } from "#shared/utilities/primitives/string.js";
import { DocumentData, FirestoreDataConverter, PartialWithFieldValue, QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import { $enum } from "ts-enum-util";

interface RawGameLobbyConstructor {
    lobbyId: string; // UUID
    lobbyCode: string;
    gameModePlaylist: MatchGameModePlaylist;
    organizerOriginId: string;
    organizerPlayerName: string;
    // playerOriginIds: string[]; // Future
    startDate?: Optional<Date>;
    endDate?: Optional<Date>;
}

/**
 * Represents an Apex Legends Custom/Private Lobby for Raw Apex Games.
 */
export class RawGameLobby {
    /** Has started, but not ended */
    public get isJoinable(): boolean {
        return this.hasStarted && !this.hasEnded;
    }
    public get hasStarted(): boolean {
        return this.startDate ? this.startDate <= new Date() : false;
    }
    public get hasEnded(): boolean {
        return this.endDate ? this.endDate <= new Date() : false;
    }

    /** Main identifier for the lobby; Auto-generated if one isn't provided */
    public lobbyId: string;
    public lobbyCode: string;
    public gameModePlaylist: MatchGameModePlaylist;
    public organizerOriginId: string;
    public organizerPlayerName: string;
    // public playerOriginIds: string[];
    public startDate?: Optional<Date>;
    public endDate?: Optional<Date>;

    constructor(ctor?: ModelCtor<RawGameLobbyConstructor>) {
        ctor = ctor ?? {};
        this.lobbyId = removeNonAlphaNumericHyphenUnderscore(ctor.lobbyId ?? "");
        this.lobbyCode = removeNonAlphaNumeric(ctor.lobbyCode ?? "");
        this.gameModePlaylist = $enum(MatchGameModePlaylist).asValueOrDefault(ctor.gameModePlaylist, MatchGameModePlaylist.Sandbox);
        this.organizerOriginId = removeNonNumeric(ctor.organizerOriginId ?? "");
        this.organizerPlayerName = sanitizePlayerName(ctor.organizerPlayerName ?? "");
        // this.playerOriginIds = (ctor.playerOriginIds && Array.isArray(ctor.playerOriginIds) ? ctor.playerOriginIds : []).map(
        //     (playerOriginId) => removeNonNumeric(playerOriginId?.toString() ?? "")
        // );
        this.startDate = ctor.startDate ? new Date(ctor.startDate) : undefined;
        this.endDate = ctor.endDate ? new Date(ctor.endDate) : undefined;
    }

    public static get firebaseConverter(): FirestoreDataConverter<RawGameLobby> {
        return {
            fromFirestore: (snap: QueryDocumentSnapshot): RawGameLobby => {
                const data = snap.data();
                data.startDate =
                    data.startDate instanceof Timestamp
                        ? (data.startDate as Timestamp).toDate()
                        : data.startDate
                        ? new Date(data.startDate)
                        : undefined;
                data.endDate =
                    data.endDate instanceof Timestamp
                        ? (data.endDate as Timestamp).toDate()
                        : data.endDate
                        ? new Date(data.endDate)
                        : undefined;
                const rawGameLobby = new RawGameLobby(data);
                return rawGameLobby;
            },
            toFirestore: (data: PartialWithFieldValue<RawGameLobby>): DocumentData => {
                const rawGameLobby: PartialWithFieldValue<RawGameLobby> = {
                    lobbyId: data.lobbyId?.toString() ?? "",
                    lobbyCode: data.lobbyCode?.toString() ?? "",
                    gameModePlaylist: $enum(MatchGameModePlaylist).asValueOrDefault(
                        data.gameModePlaylist?.toString(),
                        MatchGameModePlaylist.Sandbox
                    ),
                    organizerOriginId: data.organizerOriginId?.toString() ?? "",
                    organizerPlayerName: data.organizerPlayerName?.toString() ?? "",
                    // playerOriginIds: Array.isArray(data.playerOriginIds) ? data.playerOriginIds : [],
                    startDate: data.startDate ? Timestamp.fromDate(new Date(data.startDate as string)) : Timestamp.now(),
                    endDate: data.endDate ? Timestamp.fromDate(new Date(data.endDate as string)) : Timestamp.now(),
                };
                return rawGameLobby;
            },
        };
    }
}

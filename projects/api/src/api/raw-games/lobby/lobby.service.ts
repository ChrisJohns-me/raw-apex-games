import { collection, getDocs } from "firebase/firestore";
import { RawGameLobby } from "../../../../../shared/common/raw-games/raw-game-lobby.js";
import FirebaseUtil, { converter } from "../../../utils/firebase.util.js";

// const mockLobbies = [
//     new RawGameLobby({
//         joinCode: "abc123",
//         gameModePlaylist: MatchGameModePlaylist.Sandbox,
//         gameModeGenericId: MatchGameModeGenericId.FiringRange,
//         organizerOriginId: "master123",
//         playerOriginIds: ["master123", "charly"],
//         isJoinable: true,
//         isStarted: false,
//     }),
// ];

class LobbyService {
    private firestoreDb = FirebaseUtil.firestore;

    public async getLobby(joinCode: string): Promise<Optional<RawGameLobby>> {
        const lobbiesCol = collection(this.firestoreDb, "lobbies").withConverter(converter<RawGameLobby>());
        const lobbiesSnapshot = await getDocs(lobbiesCol);
        const lobby = lobbiesSnapshot.docs.find((doc) => doc.id === joinCode);
        return Promise.resolve(lobby?.data());
    }

    public async listLobbies(): Promise<RawGameLobby[]> {
        const lobbiesCol = collection(this.firestoreDb, "lobbies").withConverter(converter<RawGameLobby>());
        const lobbiesSnapshot = await getDocs(lobbiesCol);
        const lobbies = lobbiesSnapshot.docs.map((doc) => doc.data());
        return Promise.resolve(lobbies ?? []);
    }
}

export default new LobbyService();

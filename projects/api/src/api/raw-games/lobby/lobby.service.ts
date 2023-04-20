import { RawGameLobby } from "@shared/models/raw-games/raw-game-lobby.js";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import FirebaseUtil from "../../../utils/firebase.util.js";

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

    public async createLobby(lobbyData: RawGameLobby): Promise<void> {
        console.log("LobbyService.createLobby called");
        const docRef = doc(this.firestoreDb, "lobbies", lobbyData.joinCode).withConverter(RawGameLobby.firebaseConverter);
        return await setDoc(docRef, lobbyData);
    }

    public async getLobby(joinCode: string): Promise<Optional<RawGameLobby>> {
        const lobbiesCol = collection(this.firestoreDb, "lobbies").withConverter(RawGameLobby.firebaseConverter);
        const lobbiesSnapshot = await getDocs(lobbiesCol);
        const lobby = lobbiesSnapshot.docs.find((doc) => doc.id === joinCode);
        return Promise.resolve(lobby?.data());
    }

    public async listLobbies(): Promise<RawGameLobby[]> {
        const lobbiesCol = collection(this.firestoreDb, "lobbies").withConverter(RawGameLobby.firebaseConverter);
        const lobbiesSnapshot = await getDocs(lobbiesCol);
        const lobbies = lobbiesSnapshot.docs.map((doc) => doc.data());
        return Promise.resolve(lobbies ?? []);
    }
}

export default new LobbyService();

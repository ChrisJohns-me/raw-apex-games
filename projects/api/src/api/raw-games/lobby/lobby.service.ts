import FirebaseUtil from "#api/utils/firebase.util.js";
import { RawGameLobby } from "#shared/models/raw-games/lobby.js";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";

class LobbyService {
    private firestoreDb = FirebaseUtil.firestore;

    public async createLobby(lobbyData: RawGameLobby): Promise<void> {
        // TODO: endDate maybe max of 24hrs from startDate?
        const docRef = doc(this.firestoreDb, "lobbies", lobbyData.lobbyId).withConverter(RawGameLobby.firebaseConverter);
        return await setDoc(docRef, lobbyData);
    }

    public async listLobbies(): Promise<RawGameLobby[]> {
        const lobbiesCol = collection(this.firestoreDb, "lobbies").withConverter(RawGameLobby.firebaseConverter);
        const lobbiesSnapshot = await getDocs(lobbiesCol);
        const lobbies = lobbiesSnapshot.docs.map((doc) => doc.data());
        return Promise.resolve(lobbies ?? []);
    }

    public async getLobbyByLobbyId(lobbyId: string): Promise<Optional<RawGameLobby>> {
        const lobbiesCol = collection(this.firestoreDb, "lobbies").withConverter(RawGameLobby.firebaseConverter);
        const lobbiesSnapshot = await getDocs(lobbiesCol);
        const lobby = lobbiesSnapshot.docs.find((doc) => doc.id === lobbyId);
        return Promise.resolve(lobby?.data());
    }

    public async getLobbyByLobbyCode(lobbyCode: string): Promise<Optional<RawGameLobby>> {
        const lobbiesCol = collection(this.firestoreDb, "lobbies").withConverter(RawGameLobby.firebaseConverter);
        const lobbiesSnapshot = await getDocs(lobbiesCol);
        const lobby = lobbiesSnapshot.docs.find((doc) => doc.data().lobbyCode === lobbyCode);
        return Promise.resolve(lobby?.data());
    }

    public async getLobbyByOriginId(originId: string): Promise<Optional<RawGameLobby>> {
        const lobbiesCol = collection(this.firestoreDb, "lobbies").withConverter(RawGameLobby.firebaseConverter);
        const lobbiesSnapshot = await getDocs(lobbiesCol);
        const lobby = lobbiesSnapshot.docs.find((doc) => doc.data().organizerOriginId === originId);
        return Promise.resolve(lobby?.data());
    }

    public async updateLobby(lobbyData: RawGameLobby): Promise<void> {
        const docRef = doc(this.firestoreDb, "lobbies", lobbyData.lobbyId).withConverter(RawGameLobby.firebaseConverter);
        return await setDoc(docRef, lobbyData);
    }

    public async deleteLobbyById(lobbyId: string): Promise<void> {
        const docRef = doc(this.firestoreDb, "lobbies", lobbyId).withConverter(RawGameLobby.firebaseConverter);
        return await setDoc(docRef, null);
    }
}

export default new LobbyService();

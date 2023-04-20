import { FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { Firestore, PartialWithFieldValue, QueryDocumentSnapshot, connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import Configuration from "../config/configuration.js";

const EMULATOR_PORT = 5001; // Found in `firebase.json` file

export const converter = <T>() => ({
    toFirestore: (data: PartialWithFieldValue<T>) => {
        console.log("toFirestore");
        return data;
    },
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

class FirebaseUtil {
    public firestore!: Firestore;

    private firebaseOptions: FirebaseOptions = Configuration.config.firebase;

    constructor() {
        this.firebaseOptions = Configuration.config.firebase;
        this.initFirebase();
    }

    private initFirebase(): void {
        const firebaseApp = !getApps().length ? initializeApp(this.firebaseOptions) : getApp();
        this.firestore = getFirestore(firebaseApp);

        if (Configuration.isDevelopment) {
            console.info("Using Firestore Emulator...");
            connectFirestoreEmulator(this.firestore, "localhost", EMULATOR_PORT);
        }
    }
}

export default new FirebaseUtil();

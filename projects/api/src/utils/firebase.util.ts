import { FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { Firestore, PartialWithFieldValue, QueryDocumentSnapshot, connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import Configuration from "../config/configuration.js";

export const converter = <T>() => ({
    toFirestore: (data: PartialWithFieldValue<T>) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

class FirebaseUtil {
    public firestore!: Firestore;

    private firebaseOptions: FirebaseOptions;

    constructor() {
        this.firebaseOptions = this.getFirebaseOptions();
        this.initFirebase();
    }

    private initFirebase(): void {
        const firebaseApp = !getApps().length ? initializeApp(this.firebaseOptions) : getApp();
        this.firestore = getFirestore(firebaseApp);

        if (Configuration.isDevelopment) {
            const { host, port } = Configuration.config.firebase;
            connectFirestoreEmulator(this.firestore, host, port);
        }
    }

    private getFirebaseOptions(): FirebaseOptions {
        const { projectId, host, port } = Configuration.config.firebase;
        return {
            projectId,
            databaseURL: `${host}:${port}`,
        };
    }
}

export default new FirebaseUtil();

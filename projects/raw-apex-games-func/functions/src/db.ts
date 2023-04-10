import * as admin from "firebase-admin";

admin.initializeApp();
export const db = admin.firestore();

export enum DBCollection {
    OverwolfUsers = "overwolfUsers",
    ReportedPlayers = "reportedPlayers",
    Reports = "reports",
}

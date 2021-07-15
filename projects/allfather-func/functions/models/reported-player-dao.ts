import { subDays } from "date-fns";
import { firestore } from "firebase-admin";
import { ReportReason } from "../../../shared/player-report/report-reason";
import { ReportedPlayer } from "../../../shared/player-report/reported-player";
import { DBCollection } from "../src/db";

/** Structure of a Reported Player within the Firestore database */
interface ReportedPlayerDataStore {
    createdDate: firestore.Timestamp;
    lastReportedDate: firestore.Timestamp;
    inGameUsername: string;
    rosterHashes: string[];
    overwolfUserReports: {
        [overwolfUsername: string]: ReportReason;
    };
}

/** Class to interact with the Firestore database for Reported Players. */
export class ReportedPlayerDAO {
    constructor(private db: firestore.Firestore) {}

    public async create(
        inGameUsername: ReportedPlayerDataStore["inGameUsername"],
        rosterHashes: ReportedPlayerDataStore["rosterHashes"],
        overwolfUserReports: ReportedPlayerDataStore["overwolfUserReports"]
    ): Promise<ReportedPlayer> {
        const reportedPlayerDataStore: ReportedPlayerDataStore = {
            createdDate: firestore.Timestamp.now(),
            lastReportedDate: firestore.Timestamp.now(),
            inGameUsername,
            rosterHashes,
            overwolfUserReports,
        };
        const newReportedPlayerRef = await this.db.collection(DBCollection.ReportedPlayers).add(reportedPlayerDataStore);
        const newReportedPlayer = { ...((await newReportedPlayerRef.get()).data() as ReportedPlayer), id: newReportedPlayerRef.id };
        return newReportedPlayer;
    }

    public async getAll(): Promise<ReportedPlayer[]> {
        const reportedPlayersRef = await this.db.collection(DBCollection.ReportedPlayers).get();
        //TODO: Check if this is correct
        return await Promise.all(
            reportedPlayersRef.docs.map((r) => this.convertToReportedPlayer(r.id, r.data() as ReportedPlayerDataStore))
        );
    }

    public async getLatestByDays(numDays: number): Promise<ReportedPlayer[]> {
        const earliestDate = subDays(new Date(), numDays);
        const reportedPlayersRef = await this.db
            .collection(DBCollection.ReportedPlayers)
            .orderBy("lastReportedDate", "desc")
            .where("lastReportedDate", ">=", earliestDate)
            .get();

        return await Promise.all(
            reportedPlayersRef.docs.map((r) => this.convertToReportedPlayer(r.id, r.data() as ReportedPlayerDataStore))
        );
    }

    public async getFromId(reportedPlayerId: string): Promise<Optional<ReportedPlayer>> {
        const reportedPlayerRef = await this.db.collection(DBCollection.ReportedPlayers).doc(reportedPlayerId).get();
        const reportedPlayerDataStore = reportedPlayerRef?.data() as ReportedPlayerDataStore;
        if (!reportedPlayerDataStore) return;
        return this.convertToReportedPlayer(reportedPlayerRef.id, reportedPlayerDataStore);
    }

    public async getFromInGameUsername(inGameUsername: string): Promise<Optional<ReportedPlayer>> {
        const reportedPlayerRef = (
            await this.db.collection(DBCollection.ReportedPlayers).where("inGameUsername", "==", inGameUsername).get()
        ).docs?.[0];
        const reportedPlayerDataStore = reportedPlayerRef?.data() as ReportedPlayerDataStore;
        if (!reportedPlayerDataStore) return;
        return this.convertToReportedPlayer(reportedPlayerRef?.id, reportedPlayerDataStore);
    }

    /** Reported Player must already exist in the database */
    public async insertOverwolfUserReport(reportedPlayerId: string, overwolfUsername: string, reportReason: ReportReason): Promise<void> {
        await this.db
            .collection(DBCollection.ReportedPlayers)
            .doc(reportedPlayerId)
            .update({ [`overwolfUserReports.${overwolfUsername}`]: reportReason });
    }

    /** Reported Player must already exist in the database */
    public async insertRosterHashes(reportedPlayerId: string, rosterHash: string): Promise<void> {
        await this.db
            .collection(DBCollection.ReportedPlayers)
            .doc(reportedPlayerId)
            .update({ rosterHashes: firestore.FieldValue.arrayUnion(rosterHash) });
    }

    public async update(reportedPlayerId: string, reportedPlayer: ReportedPlayer): Promise<void> {
        await this.db.collection(DBCollection.ReportedPlayers).doc(reportedPlayerId).update(reportedPlayer);
    }

    public async delete(reportedPlayerId: string): Promise<void> {
        await this.db.collection(DBCollection.ReportedPlayers).doc(reportedPlayerId).delete();
    }

    /**
     * @returns {ReportedPlayer} For public API consumption
     */
    private convertToReportedPlayer(reportedPlayerId: string, reportedPlayerDataStore: ReportedPlayerDataStore): ReportedPlayer {
        const reportedReasons: ReportedPlayer["reportedReasons"] = {};
        Object.entries(reportedPlayerDataStore.overwolfUserReports).forEach(([, reportReason]) => {
            reportedReasons[reportReason] = (reportedReasons[reportReason] || 0) + 1;
        });

        return {
            id: reportedPlayerId,
            inGameUsername: reportedPlayerDataStore.inGameUsername,
            firstReportedDate: new Date(reportedPlayerDataStore.createdDate.toMillis()),
            lastReportedDate: new Date(reportedPlayerDataStore.lastReportedDate.toMillis()),
            rosterHashes: reportedPlayerDataStore.rosterHashes,
            reportedReasons,
        };
    }
}

import * as functions from "firebase-functions";
import { ReportedPlayerDAO } from "../models/reported-player-dao";
import { db } from "./db";

const reportedPlayerDAO = new ReportedPlayerDAO(db);
const MAX_NUM_DAYS = 31;

export const latestReportedPlayers = functions.https.onRequest(async (request, response): Promise<void> => {
    if (functions.config().environment?.dev) {
        response.set("Access-Control-Allow-Origin", "*");
        response.set("Access-Control-Allow-Headers", "*");
    }

    const numDays = parseInt(request.query.numDays as string);

    const reportedPlayers = await reportedPlayerDAO.getLatestByDays(numDays <= MAX_NUM_DAYS ? numDays : MAX_NUM_DAYS);
    response.send(reportedPlayers);
});

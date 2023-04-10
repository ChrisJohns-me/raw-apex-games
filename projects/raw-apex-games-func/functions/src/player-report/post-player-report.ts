import * as functions from "firebase-functions";
import { ReportedPlayerDAO } from "../../models/reported-player-dao";
import { db } from "../db";
import { isPostPlayerReportDTO } from "./post-player-report-dto";

const reportedPlayerDAO = new ReportedPlayerDAO(db);

export const postPlayerReport = async (request: functions.https.Request, response: functions.Response<any>): Promise<void> => {
    const playerReportDTO = request.body;
    if (!isPostPlayerReportDTO(playerReportDTO)) {
        response.status(400).send({
            error: {
                code: 400,
                msg: "Invalid player report",
            },
        });
        return;
    }

    const existingReportedPlayer = await reportedPlayerDAO.getFromInGameUsername(playerReportDTO.reportedPlayerInGameUsername);
    let reportedPlayerId: string;
    if (!existingReportedPlayer) {
        const inGameUsername = playerReportDTO.reportedPlayerInGameUsername;
        const rosterHashes = [playerReportDTO.rosterHash];
        const overwolfUserReports = {
            [playerReportDTO.myOverwolfUsername]: playerReportDTO.reportedReason,
        };

        console.log(`Creating Reported Player: ${inGameUsername}`);
        const createReportedPlayer = await reportedPlayerDAO.create(inGameUsername, rosterHashes, overwolfUserReports);
        reportedPlayerId = createReportedPlayer.id;
    } else {
        console.log(`Updating Reported Player: ${playerReportDTO.reportedPlayerInGameUsername}`);
        reportedPlayerDAO.insertOverwolfUserReport(
            existingReportedPlayer.id,
            playerReportDTO.myOverwolfUsername,
            playerReportDTO.reportedReason
        );
        reportedPlayerDAO.insertRosterHashes(existingReportedPlayer.id, playerReportDTO.rosterHash);
        reportedPlayerId = existingReportedPlayer.id;
    }

    if (reportedPlayerId) {
        response.status(reportedPlayerId ? 200 : 500).send({
            reportedPlayerId,
        });
    } else {
        response.status(500).send({
            error: {
                code: 500,
                msg: "Failed to create reported player",
            },
        });
    }
};

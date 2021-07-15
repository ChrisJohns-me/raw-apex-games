/*
 * To prevent object stores from becoming stale,
 *  all database interfaces should be explicit (ie. no imported interfaces).
 * Dates should be stored as their primitive self (provides compression).
 */

import { ReportReason } from "@shared/player-report/report-reason";

/**
 * @class ReportedPlayersDataStore
 * @classdesc Class to hold reported players.
 */
export interface ReportedPlayerDataStore {
    id: string;
    inGameUsername: string;
    firstReportedDate: Date;
    lastReportedDate: Date;
    rosterHashes: string[];
    reportedReasons: { [key in ReportReason]?: number };
}

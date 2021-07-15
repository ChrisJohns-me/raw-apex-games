import { ReportReason } from "../../shared/player-report/report-reason";

export interface ReportedPlayer {
    id: string;
    inGameUsername: string;
    firstReportedDate: Date;
    lastReportedDate: Date;
    rosterHashes: string[];
    reportedReasons: { [key in ReportReason]?: number };
}

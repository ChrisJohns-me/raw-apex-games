import { isEmpty } from "../../../../../common/utilities";
import { ReportReason } from "../../../../shared/player-report/report-reason";

export interface PostPlayerReportDTO {
    rosterHash: string;
    myOverwolfUsername: string;
    myInGameUsername: string;
    reportedPlayerInGameUsername: string;
    reportedReason: ReportReason;
}

export function isPostPlayerReportDTO(value: unknown): value is PostPlayerReportDTO {
    if (typeof value !== "object") return false;
    if ((value as PostPlayerReportDTO).rosterHash?.length !== 32) return false;
    if (isEmpty((value as PostPlayerReportDTO).myOverwolfUsername)) return false;
    if (isEmpty((value as PostPlayerReportDTO).myInGameUsername)) return false;
    if (isEmpty((value as PostPlayerReportDTO).reportedPlayerInGameUsername)) return false;
    if (!Object.values(ReportReason).includes((value as PostPlayerReportDTO).reportedReason)) return false;
    return true;
}

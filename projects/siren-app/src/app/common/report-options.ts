import { ReportReason } from "@shared/player-report/report-reason";
import { ReportCategory } from "./report-category";

export const ReportOptions = {
    [ReportCategory.Cheating]: {
        aimbot: ReportReason.Aimbot,
        wallESP: ReportReason.WallESP,
        macros: ReportReason.Macros,
        movement: ReportReason.Movement,
    },
    [ReportCategory.Unsportmanlike]: {
        disrespectfulBehavior: ReportReason.DisrespectfulBehavior,
        harassment: ReportReason.Harassment,
        sabatoge: ReportReason.Sabatoge,
        afk: ReportReason.AFK,
    },
    [ReportCategory.Unfair]: {
        streamSniping: "streamsniping",
        teamSniping: "teamsniping",
        boosting: "boosting",
        teaming: "teaming",
        glitches: "glitches",
    },
};

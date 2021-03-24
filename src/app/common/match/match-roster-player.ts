import { PlatformHardware, PlatformSoftware } from "@common/platform";

export interface MatchRosterPlayer {
    name: string;
    teamId?: number;
    rosterKey?: string;
    platformHardware?: PlatformHardware;
    platformSoftware?: PlatformSoftware;
}

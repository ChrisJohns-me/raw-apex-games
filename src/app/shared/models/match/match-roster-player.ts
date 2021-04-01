import { PlatformHardware, PlatformSoftware } from "../platform";

export interface MatchRosterPlayer {
    name: string;
    teamId?: number;
    rosterKey?: string;
    platformHardware?: PlatformHardware;
    platformSoftware?: PlatformSoftware;
}

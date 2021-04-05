import { PlatformHardware, PlatformSoftware } from "../platform";

export interface MatchRosterPlayer {
    name: string;
    teamId?: number;
    rosterId?: number;
    platformHardware?: PlatformHardware;
    platformSoftware?: PlatformSoftware;
}

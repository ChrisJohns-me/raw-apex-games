import { PlatformHardware, PlatformSoftware } from "@common/platform";

export interface MatchRosterPlayer {
    name: string;
    rosterKey: string;
    teamId: number;
    platformHardware: PlatformHardware;
    platformSoftware: PlatformSoftware;
}

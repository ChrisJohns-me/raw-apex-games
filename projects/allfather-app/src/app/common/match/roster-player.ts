import { PlatformHardware, PlatformSoftware } from "../platform";

export interface MatchRosterPlayer {
    name: string;
    isMe: boolean;
    teamId?: number;
    rosterId?: number;
    platformHardware?: PlatformHardware;
    platformSoftware?: PlatformSoftware;
}

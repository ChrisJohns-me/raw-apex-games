import { PlatformHardware, PlatformSoftware } from "../platform";

export interface MatchRosterPlayer {
    name: string;
    isMe: boolean;
    teamId?: number;
    rosterId?: number;
    originId?: string;
    platformId?: string;
    platformHardware?: PlatformHardware;
    platformSoftware?: PlatformSoftware;
}

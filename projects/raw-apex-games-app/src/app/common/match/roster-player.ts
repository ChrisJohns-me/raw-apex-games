import { PlatformHardware, PlatformSoftware } from "../platform";

export interface MatchRosterPlayer {
    name: string;
    isMe: boolean;
    teamId?: number;
    rosterId?: number;
    originId?: string; // TODO: NEW!
    platformHardware?: PlatformHardware;
    platformSoftware?: PlatformSoftware;
}

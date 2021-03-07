import { PlatformHardware, PlatformSoftware } from "@common/game";

export interface DamageAction {
    timestamp: Date;
    hasShield?: boolean;
    isKnocked?: boolean;
    isEliminated?: boolean;
    shieldDamage?: number;
    healthDamage?: number;
}

export interface PlayerPlatformInfo {
    hardware: PlatformHardware;
    software: PlatformSoftware;
}

export interface RosterPlayer {
    playerName: string;
    platformInfo: PlayerPlatformInfo;
    teamId: number;
    hasShield: boolean;
    isKnocked: boolean;
    isEliminated: boolean;
}

export interface Roster {
    [key: number]: RosterPlayer;
}

export interface RosterPlayerDamageActions {
    [playerName: string]: DamageAction[];
}

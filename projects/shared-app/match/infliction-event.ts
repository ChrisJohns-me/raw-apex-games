import { WeaponItem } from "../items/weapon-item";
import { MatchRosterPlayer } from "./roster-player";

export interface MatchInflictionEvent {
    timestamp: Date;
    victim: MatchRosterPlayer;
    attacker?: MatchRosterPlayer;
    hasShield?: boolean;
    isHeadshot?: boolean;
    shieldDamage?: number;
    healthDamage?: number;
    isKnockdown?: boolean;
    isElimination?: boolean;
    weapon?: WeaponItem;
}

// Accumulated version of MatchInflictionEvents
export interface MatchInflictionEventAccum {
    victim: Optional<MatchRosterPlayer>;
    shieldDamageSum: number;
    healthDamageSum: number;
    hasShield: boolean;
    isKnocked: boolean;
    isEliminated: boolean;
    latestAttacker: Optional<MatchRosterPlayer>;
    latestTimestamp: Optional<Date>;
}

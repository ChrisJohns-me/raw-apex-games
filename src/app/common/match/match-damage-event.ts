import { WeaponItem } from "../items/weapon-item";
import { MatchRosterPlayer } from "./match-roster-player";

export interface MatchDamageEvent {
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

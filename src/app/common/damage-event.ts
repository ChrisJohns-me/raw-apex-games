import { Player } from "./player";
import { WeaponItem } from "./weapon-item";

export interface DamageEvent {
    timestamp: Date;
    victim: Player;
    attacker?: Player;
    hasShield?: boolean;
    isHeadshot?: boolean;
    shieldDamage?: number;
    healthDamage?: number;
    isKnocked?: boolean;
    isEliminated?: boolean;
    weapon?: WeaponItem;
}

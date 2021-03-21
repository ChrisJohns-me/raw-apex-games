import { Player } from "./player";
import { WeaponItem } from "./weapon-item";

export interface KillfeedEvent {
    timestamp: Date;
    attacker?: Player;
    victim: Player;
    isKnockdown: boolean;
    isElimination: boolean;
    weapon: WeaponItem;
}

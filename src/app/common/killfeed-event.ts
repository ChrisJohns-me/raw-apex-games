import { Player } from "./player";
import { Weapon } from "./weapon";

export interface KillfeedEvent {
    attacker?: Player;
    victim: Player;
    isKnockdown: boolean;
    isElimination: boolean;
    weapon: Weapon;
}

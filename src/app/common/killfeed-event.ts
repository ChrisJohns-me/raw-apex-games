import { Weapon } from "./weapon";

export interface KillfeedEvent {
    attackerName?: string;
    victimName: string;
    isKnockdown: boolean;
    isElimination: boolean;
    weapon: Weapon;
}

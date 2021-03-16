import { WeaponItem } from "./weapon-item";

export interface KillfeedEvent {
    attackerName?: string;
    victimName: string;
    isKnockdown: boolean;
    isElimination: boolean;
    weapon: WeaponItem;
}

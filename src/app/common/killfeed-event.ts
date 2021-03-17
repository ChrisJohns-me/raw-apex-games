import { WeaponItem } from "./weapon-item";

export interface KillfeedEvent {
    timestamp: Date;
    attackerName?: string;
    victimName: string;
    isKnockdown: boolean;
    isElimination: boolean;
    weapon: WeaponItem;
}

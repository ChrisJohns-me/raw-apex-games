import { isEmpty } from "common/utilities/";
import { Item, ItemType } from "./item";
// import * as WeaponJSONData from "./weapon-list.json";
// import WeaponJSONData from "./weapon-list.json";

enum WeaponAmmo {
    Light = "light",
    Heavy = "heavy",
    Energy = "energy",
    Shotgun = "shotgun",
    Sniper = "sniper",
}

enum WeaponClassName {
    AssultRifle = "assault_rifle",
    SMG = "smg",
    LMG = "lmg",
    Sniper = "sniper",
    Pistol = "pistol",
    Shotgun = "shotgun",
}

interface WeaponStatistics {
    rateOfFire: number;
    bodyDamagePerSecond: number;
    headDamagePerSecond: number;
    bodyDamage: number;
    headDamage: number;
    legDamage: number;
}

// type WeaponJSONItem = typeof WeaponJSONData["weapons"][0];
type WeaponItemConstructor = {
    fromId?: string;
    fromInGameEventName?: string;
    fromInGameInfoName?: string;
    fromInGameInventoryId?: string;
};

// TODO: Load statistics from JSON
export class WeaponItem extends Item {
    public ammoType?: WeaponAmmo;
    public class?: WeaponClassName;
    public statistics?: WeaponStatistics;

    public static isWeaponId(itemId?: string): boolean {
        if (typeof itemId !== "string") return false;
        const item = new Item({ fromId: itemId });
        return item.itemType === ItemType.Weapon;
    }

    public static isWeapon(item: Item): item is WeaponItem {
        return item.itemType === ItemType.Weapon;
    }

    /**
     * @param {string} fromId Create weapon based on it's identifier.
     * @param {string} fromInGameEventName Create weapon from Overwolf's `"name": "kill_feed"` event naming.
     * @param {string} fromInGameInfoName Create weapon from Overwolf's `"feature": "inventory"` event naming.
     * @param {string} fromInGameInventoryId Overwolf's inventory item slot name; from the "inventory_0.name" feature.
     */
    constructor({ fromId, fromInGameEventName, fromInGameInfoName, fromInGameInventoryId }: WeaponItemConstructor) {
        if (isEmpty(fromId) && isEmpty(fromInGameEventName) && isEmpty(fromInGameInfoName) && isEmpty(fromInGameInventoryId)) {
            fromId = "empty_handed";
        }
        super({ fromId, fromInGameEventName, fromInGameInfoName, fromInGameInventoryId });
        if (this.itemType !== ItemType.Weapon) console.error(`Tried to create new WeaponItem; Item "${this.itemId}" is not a weapon`);
    }
}

import { isEmpty } from "common/utilities/";
import { Item, ItemType } from "./item";

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

// type WeaponJSONItem = typeof WeaponJSONData["weapons"][0];
type WeaponItemConstructor = {
    fromId?: string;
    fromInGameEventName?: string;
    fromInGameInfoName?: string;
    fromInGameInventoryId?: string;
};

export class WeaponItem extends Item {
    public ammoType?: WeaponAmmo;
    public class?: WeaponClassName;

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
        if (
            isEmpty(fromId) &&
            isEmpty(fromInGameEventName) &&
            (isEmpty(fromInGameInfoName) || fromInGameInfoName === "unknown") &&
            isEmpty(fromInGameInventoryId)
        ) {
            fromId = "empty_handed";
        }
        super({ fromId, fromInGameEventName, fromInGameInfoName, fromInGameInventoryId });
        if (fromId !== "empty_handed" && this.itemType !== ItemType.Weapon) {
            console.error(`Tried to create new WeaponItem; Item "${this.itemId}" is not a weapon`);
        }
    }
}

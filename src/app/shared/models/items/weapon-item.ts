import { isEmpty } from "@shared/utilities";
import { Item } from "./item";
// import * as WeaponJSONData from "./weapon-list.json";
// TODO: Load weapon statistics from json

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
};

// TODO: Load statistics from JSON
export class WeaponItem extends Item {
    public ammoType?: WeaponAmmo;
    public class?: WeaponClassName;
    public statistics?: WeaponStatistics;

    /**
     * @param {string} fromId Create weapon based on it's identifier.
     * @param {string} fromInGameEventName Create weapon from Overwolf's `"name": "kill_feed"` event naming.
     * @param {string} fromInGameInfoName Create weapon from Overwolf's `"feature": "inventory"` event naming.
     */
    constructor({ fromId, fromInGameEventName, fromInGameInfoName }: WeaponItemConstructor) {
        if (isEmpty(fromId) && isEmpty(fromInGameEventName) && isEmpty(fromInGameInfoName)) {
            fromId = "empty_handed";
        }
        super({ fromId, fromInGameEventName, fromInGameInfoName });
    }
}

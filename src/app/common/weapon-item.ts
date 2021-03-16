import { Item } from "./item";
// import * as WeaponJSONData from "./weapon-list.json";

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

// TODO: Load statistics from JSON
export class WeaponItem extends Item {
    public ammoType?: WeaponAmmo;
    public class?: WeaponClassName;
    public statistics?: WeaponStatistics;

    /**
     * @param {string} init.fromId Create weapon based on it's identifier.
     * @param {string} init.fromKillfeedName Create weapon from Overwolf's `"name": "kill_feed"` event naming.
     * @param {string} init.fromInfoWeapons Create weapon from Overwolf's `"feature": "inventory"` event naming.
     */
    constructor(init?: { fromId?: string; fromKillfeedName?: string; fromInfoWeapons?: string }) {
        super(init);
    }
}

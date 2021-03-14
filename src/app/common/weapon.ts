import { wordsToUpperCase } from "src/utilities/string";
import * as WeaponJSONData from "./weapon-list.json";

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

type WeaponJSONItem = typeof WeaponJSONData["weapons"][0];

export class Weapon {
    public id?: string;
    public friendlyName?: string;
    public ammoType?: WeaponAmmo;
    public imageName?: string;
    public class?: WeaponClassName;
    public statistics?: WeaponStatistics;
    public isEmpty = false;

    /**
     * @param {string} init.fromId Create weapon based on it's identifier.
     * @param {string} init.fromKillfeedName Create weapon from Overwolf's `"name": "kill_feed"` event naming.
     * @param {string} init.fromInfoWeapons Create weapon from Overwolf's `"feature": "inventory"` event naming.
     */
    constructor(init?: { fromId?: string; fromKillfeedName?: string; fromInfoWeapons?: string }) {
        if (init?.fromId) this.loadById(init.fromId);
        else if (init?.fromKillfeedName) this.loadByKillfeedName(init.fromKillfeedName);
        else if (init?.fromInfoWeapons) this.loadByInfoWeaponName(init.fromInfoWeapons);

        this.isEmpty = !init || !init.fromKillfeedName || !init.fromInfoWeapons || !init.fromId;
    }

    private loadById(id: string): void {
        const callbackFn = (weaponJSONItem: WeaponJSONItem) => weaponJSONItem.id === id;
        this.loadFromJSON(id, callbackFn);
    }

    private loadByKillfeedName(killfeedName: string): void {
        const callbackFn = (weaponJSONItem: WeaponJSONItem) =>
            !!new RegExp(weaponJSONItem.killfeedRegExPattern).test(killfeedName);
        this.loadFromJSON(killfeedName, callbackFn);
    }

    private loadByInfoWeaponName(infoWeaponName: string): void {
        const callbackFn = (weaponJSONItem: WeaponJSONItem) =>
            !!new RegExp(weaponJSONItem.matchInfoRegExPattern).test(infoWeaponName);
        this.loadFromJSON(infoWeaponName, callbackFn);
    }

    private loadFromJSON(searchItemName: string, callbackFn: (input: WeaponJSONItem) => boolean): void {
        const weaponList = WeaponJSONData.weapons;
        const foundWeapon = weaponList.find((w) => callbackFn(w));

        if (!foundWeapon) {
            console.warn(`Unable to find weapon with name "${searchItemName}"`);
            return;
        }

        this.id = foundWeapon.id;
        this.friendlyName = foundWeapon.friendlyName;
        this.ammoType = foundWeapon.ammoType as WeaponAmmo;
        this.class = foundWeapon.class as WeaponClassName;
        // this.imageName = foundWeapon.imageName;
        // this.statistics = foundWeapon.statistics;
    }

    /**
     * @param keyName "assault_rifle"
     * @returns "Assault Rifle"
     */
    private getFriendlyClassName(weaponClassName: WeaponClassName | string): string {
        if (!weaponClassName) return "";
        let newMapName = weaponClassName.toLowerCase();
        newMapName = newMapName.replace(/_/g, " ");
        newMapName = wordsToUpperCase(newMapName);
        return newMapName ?? "";
    }
}

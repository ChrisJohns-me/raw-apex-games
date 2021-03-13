import { wordsToUpperCase } from "src/utilities/string";
import * as WeaponListJSON from "./weapon-list.json";

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

export class Weapon {
    public id?: string;
    public friendlyName?: string;
    public ammoType?: WeaponAmmo;
    public imageName?: string;
    public class?: WeaponClassName;
    public statistics?: WeaponStatistics;

    constructor(init?: { fromKillfeedName?: string; fromId?: string }) {
        if (init?.fromKillfeedName) {
            this.loadFromJSON(init.fromKillfeedName);
        } else if (init?.fromId) {
            this.loadFromJSON(undefined, init.fromId);
        }
    }

    private loadFromJSON(killfeedName?: string, id?: string): void {
        const weaponList = WeaponListJSON.weapons;
        const foundWeapon = weaponList.find((w) => {
            killfeedName ? new RegExp(w.killfeedRegExPattern).test(killfeedName) : w.id === id;
        });

        if (!foundWeapon) {
            console.debug(`Unable to find weapon with name "${killfeedName ?? id}"`);
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

import * as ItemListJSONData from "./items.json";

// new Item({ fromId: "melee" }
// new Item({ fromId: "frag_grenade" }
// new WeaponItem({ fromId: "eva8_auto" })
// new InventoryItem({ fromId: "shield_cell" })
// playerInventory = new PlayerInventory("MasterKriff");
// playerInventory.setSlot()
// playerInventory.setWeapons();

type ItemJSON = typeof ItemListJSONData["items"][number];

export class Item {
    public id?: string;
    public friendlyName?: string;
    public imageName?: string;
    /** Empty handed, or empty item */
    public isDefault = true;

    /**
     * @param {string} init.fromId Unique identifier; unique to this app.
     * @param {string} init.fromInGameEventName Overwolf's killfeed event name; from the "kill_feed" event.
     * @param {string} init.fromInGameInfoName Overwolf's inventory item slot name; from the "inventory.inUse" feature.
     * @param {string} init.fromInGameInventoryId Overwolf's inventory item slot name; from the "inventory_0.name" feature.
     */
    constructor(init?: {
        fromId?: string;
        fromInGameEventName?: string;
        fromInGameInfoName?: string;
        fromInGameInventoryId?: string;
    }) {
        if (init?.fromId) this.loadById(init.fromId);
        else if (init?.fromInGameEventName) this.loadByInGameEventName(init.fromInGameEventName);
        else if (init?.fromInGameInfoName) this.loadByInGameInfoName(init.fromInGameInfoName);
        else if (init?.fromInGameInventoryId) this.loadByInGameInventoryId(init.fromInGameInventoryId);
        else if (!init) this.isDefault = true;
    }

    /**
     * @example "r99", "r301", "flatline"
     */
    private loadById(id: string): void {
        const callbackFn = (predicateItem: ItemJSON) => predicateItem.id === id;
        this.loadFromJSON(String(id), callbackFn);
    }

    /**
     * @example "r97", "energy_ar", "3030repeater", "Melee", "rui/ordnance_icons/grenade_frag"
     */
    private loadByInGameEventName(inGameEventName: string): void {
        const callbackFn = (predicateItem: ItemJSON) => {
            if (!predicateItem.inGameEventNameRegExPattern) return false;
            return new RegExp(predicateItem.inGameEventNameRegExPattern).test(inGameEventName);
        };
        this.loadFromJSON(inGameEventName, callbackFn);
    }

    /**
     * @example "G7 Scout", "Melee", "R-301 Carbine", "mp_weapon_3030", "Knockdown Shield"
     */
    private loadByInGameInfoName(inGameInfoName: string): void {
        const callbackFn = (predicateItem: ItemJSON) => {
            if (!predicateItem.inGameInfoNameRegExPattern) return false;
            return new RegExp(predicateItem.inGameInfoNameRegExPattern).test(inGameInfoName);
        };
        this.loadFromJSON(inGameInfoName, callbackFn);
    }

    /**
     * @example "159", "136"
     */
    private loadByInGameInventoryId(inGameInventoryId: string): void {
        const callbackFn = (predicateItem: ItemJSON) => {
            if (!predicateItem.inGameInventoryIdRegExPattern) return false;
            return new RegExp(predicateItem.inGameInventoryIdRegExPattern).test(inGameInventoryId);
        };
        this.loadFromJSON(inGameInventoryId, callbackFn);
    }

    private loadFromJSON(searchItemName: string, callbackFn: (input: ItemJSON) => boolean): void {
        const foundItem = ItemListJSONData.items.find((w) => callbackFn(w));

        if (!foundItem) {
            console.warn(`Unable to find inventory item with name "${searchItemName}"`);
            return;
        }

        this.id = foundItem.id;
        this.friendlyName = foundItem.friendlyName;
        // this.imageName = foundItem.imageName;
    }
}

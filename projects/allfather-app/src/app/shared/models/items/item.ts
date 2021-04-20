import * as ItemListJSONData from "./items.json";

type ItemJSON = typeof ItemListJSONData["items"][number];
type ItemConstructor = {
    fromId?: string;
    fromInGameEventName?: string;
    fromInGameInfoName?: string;
    fromInGameInventoryId?: string;
};

export class Item {
    public itemId?: string;
    public friendlyName?: string;
    public imageName?: string;

    /**
     * @param {string} fromId Unique identifier; unique to this app.
     * @param {string} fromInGameEventName Overwolf's killfeed event name; from the "kill_feed" event.
     * @param {string} fromInGameInfoName Overwolf's inventory item slot name; from the "inventory.inUse" feature.
     * @param {string} fromInGameInventoryId Overwolf's inventory item slot name; from the "inventory_0.name" feature.
     */
    constructor({ fromId, fromInGameEventName, fromInGameInfoName, fromInGameInventoryId }: ItemConstructor) {
        if (fromId) this.loadById(fromId);
        else if (fromInGameEventName) this.loadByInGameEventName(fromInGameEventName);
        else if (fromInGameInfoName) this.loadByInGameInfoName(fromInGameInfoName);
        else if (fromInGameInventoryId) this.loadByInGameInventoryId(fromInGameInventoryId);
    }

    /**
     * @example "empty", "r99", "r301", "flatline"
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
            return new RegExp(predicateItem.inGameEventNameRegExPattern, "i").test(inGameEventName);
        };
        this.loadFromJSON(inGameEventName, callbackFn);
    }

    /**
     * @example "G7 Scout", "Melee", "R-301 Carbine", "mp_weapon_3030", "Knockdown Shield"
     */
    private loadByInGameInfoName(inGameInfoName: string): void {
        const callbackFn = (predicateItem: ItemJSON) => {
            if (!predicateItem.inGameInfoNameRegExPattern) return false;
            return new RegExp(predicateItem.inGameInfoNameRegExPattern, "i").test(inGameInfoName);
        };
        this.loadFromJSON(inGameInfoName, callbackFn);
    }

    /**
     * @example "159", "136"
     */
    private loadByInGameInventoryId(inGameInventoryId: string): void {
        const callbackFn = (predicateItem: ItemJSON) => {
            if (!predicateItem.inGameInventoryIdRegExPattern) return false;
            return new RegExp(predicateItem.inGameInventoryIdRegExPattern, "i").test(inGameInventoryId);
        };
        this.loadFromJSON(inGameInventoryId, callbackFn);
    }

    private loadFromJSON(searchItemName: string, callbackFn: (input: ItemJSON) => boolean): void {
        const foundItem = ItemListJSONData.items.find((w) => callbackFn(w));

        if (!foundItem) {
            console.warn(`Unable to find inventory item with name "${searchItemName}"`);
            this.itemId = `unknown_${searchItemName}`;
            this.friendlyName = `unknown_${searchItemName}`;
            return;
        }

        this.itemId = foundItem.id;
        this.friendlyName = foundItem.friendlyName;
        // this.imageName = foundItem.imageName;
    }
}

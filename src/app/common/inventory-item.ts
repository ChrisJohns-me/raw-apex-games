import * as InventoryListJSON from "./inventory-list.json";

// // TODO: Need to classify every inventory item, mapped to a number
// export enum InventoryItem {
//     KnockdownShield = 0,
//     ShotgunAmmo = 126,
//     HeavyAmmo = 127,
//     Syringe = 132,
//     Grenade = 133,
//     ShieldCell = 134,
//     some = 156,
//     ArcStar = 158,
// }
// AND PLACE INTO JSON FILE..

type InventoryJSONItem = typeof InventoryListJSON["inventoryItems"][0];

export class InventoryItem {
    public id?: string;
    public friendlyName?: string;
    public imageName?: string;

    /**
     * @param {string} init.fromId Create inventory item based on it's Overwolf identifier.
     */
    constructor(init?: { fromId?: string; fromInUseName?: string }) {
        if (init?.fromId) this.loadById(init.fromId);
        else if (init?.fromInUseName) this.loadByInUseName(init.fromInUseName);
    }

    private loadById(id: string): void {
        const callbackFn = (inventoryJSONItem: InventoryJSONItem) => inventoryJSONItem.id === id;
        this.loadFromJSON(String(id), callbackFn);
    }

    private loadByInUseName(inUseName: string): void {
        const callbackFn = (inventoryJSONItem: InventoryJSONItem) =>
            new RegExp(inventoryJSONItem.inUseRegExPattern).test(inUseName);
        this.loadFromJSON(inUseName, callbackFn);
    }

    private loadFromJSON(searchItemName: string, callbackFn: (input: InventoryJSONItem) => boolean): void {
        const inventoryList = InventoryListJSON.inventoryItems;
        const foundItem = inventoryList.find((w) => callbackFn(w));

        if (!foundItem) {
            console.warn(`Unable to find inventory item with name "${searchItemName}"`);
            return;
        }

        this.id = foundItem.id;
        this.friendlyName = foundItem.friendlyName;
        // this.imageName = foundItem.imageName;
    }
}

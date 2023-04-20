import { Item } from "./items/item.js";

export interface InventorySlot<T extends Item = Item> {
    item: T;
    amount?: number;
}

export interface InventorySlots<T extends Item = Item> {
    [slotId: number]: Optional<InventorySlot<T>>;
}

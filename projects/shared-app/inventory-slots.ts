import { Item } from "./items/item";

export interface InventorySlots<T extends Item = Item> {
    [slotId: number]: Optional<{
        item: T;
        amount?: number;
    }>;
}

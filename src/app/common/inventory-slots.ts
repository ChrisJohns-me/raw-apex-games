import { Item } from "./items/item";

export interface InventorySlots<T = Item> {
    [slotId: number]: Optional<{
        item: T;
        amount?: number;
    }>;
}

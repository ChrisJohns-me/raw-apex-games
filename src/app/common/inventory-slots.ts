import { Item } from "./item";

export type InventorySlotItem<T = Item> = T & { amount?: number };
export interface InventorySlots<T = InventorySlotItem> {
    [slotId: number]: Optional<T>;
}

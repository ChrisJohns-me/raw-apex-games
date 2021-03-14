import { InventoryItem } from "./inventory-item";

type InventorySlotItem = InventoryItem & { amount?: number };

interface InventorySlot {
    [slotId: number]: Optional<InventorySlotItem>;
}

export class InventoryStore {
    public get slots(): InventorySlot {
        return this._slots;
    }

    private _slots: InventorySlot = {};

    public setSlot(slotId: number, item: InventoryItem, amount = 1): void {
        if (isNaN(amount)) amount = 1;
        this._slots[slotId] = { ...item, amount } as InventorySlotItem;
    }

    public clearSlot(slotId: number): void {
        this._slots[slotId] = undefined;
    }
}

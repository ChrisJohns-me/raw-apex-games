import { InventorySlots } from "@common/inventory-slots";
import { Item } from "@common/items/item";
import { WeaponItem } from "@common/items/weapon-item";
import { BehaviorSubject } from "rxjs";

export class MockMatchPlayerInventoryService {
    public myInUseItem$ = new BehaviorSubject<Optional<Item>>(undefined);
    public myWeaponSlots$ = new BehaviorSubject<InventorySlots<WeaponItem>>({});
    public myInventorySlots$ = new BehaviorSubject<InventorySlots>({});
}

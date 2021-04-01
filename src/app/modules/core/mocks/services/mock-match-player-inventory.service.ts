import { InventorySlots } from "@shared/models/inventory-slots";
import { Item } from "@shared/models/items/item";
import { WeaponItem } from "@shared/models/items/weapon-item";
import { BehaviorSubject } from "rxjs";

export class MockMatchPlayerInventoryService {
    public myInUseItem$ = new BehaviorSubject<Optional<Item>>(undefined);
    public myWeaponSlots$ = new BehaviorSubject<InventorySlots<WeaponItem>>({});
    public myInventorySlots$ = new BehaviorSubject<InventorySlots>({});
}

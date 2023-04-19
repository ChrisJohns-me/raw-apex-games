import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { cleanInt, findKeyByKeyRegEx } from "../../../../../../../common/utilities/";
import { InventorySlots } from "../../../common/inventory-slots";
import { Item } from "../../../common/items/item";
import { WeaponItem } from "../../../common/items/weapon-item";
import { SingletonServiceProviderFactory } from "../../../singleton-service.provider.factory";
import { BaseService } from "../base-service.abstract";
import { OWInfoUpdates2Event, OWMatchInfoMeInventory, OWMatchInfoMeWeapons, OverwolfGameDataService } from "../overwolf";
import { MatchService } from "./match.service";

/**
 * @classdesc Provides general inventory, weapon, and in-use information about the local player.
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchPlayerInventoryService", MatchPlayerInventoryService, deps),
})
export class MatchPlayerInventoryService extends BaseService {
    /**
     * Local player's current weapon, throwable, inventory, ultimate, etc. item in use.
     * Emits new data only when match is started.
     */
    public readonly myInUseItem$ = new BehaviorSubject<Optional<Item>>(undefined);
    /**
     * Local player's current weapons.
     * Emits new data only when match is started.
     */
    public readonly myWeaponSlots$ = new BehaviorSubject<InventorySlots<WeaponItem>>({});
    /**
     * Local player's current backpack inventory.
     * Emits new data only when match is started.
     * Emits empty_handed when weapons are dropped.
     */
    public readonly myInventorySlots$ = new BehaviorSubject<InventorySlots>({});

    private inventoryInfoUpdates$: Observable<OWInfoUpdates2Event>;

    constructor(private readonly match: MatchService, private readonly overwolfGameData: OverwolfGameDataService) {
        super();
        this.inventoryInfoUpdates$ = this.overwolfGameData.infoUpdates$.pipe(
            filter((infoUpdate) => infoUpdate.feature === "inventory"),
            takeUntil(this.destroy$)
        );
        this.setupOnMatchStart();
        this.setupMyInventorySlots();
        this.setupMyInUseItem();
        this.setupMyWeapons();
    }

    /**
     * Reset states on match start
     */
    private setupOnMatchStart(): void {
        this.match.startedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.myInUseItem$.next(undefined);
            this.myWeaponSlots$.next({});
            this.myInventorySlots$.next({});
        });
    }

    /**
     * Updates backpack inventory item updates
     */
    private setupMyInventorySlots(): void {
        this.inventoryInfoUpdates$
            .pipe(
                filter(() => this.match.isActive),
                map((infoUpdate) => infoUpdate.info.me)
            )
            .subscribe((me) => {
                const infoSlotName = findKeyByKeyRegEx(me, /^inventory_/);
                if (!infoSlotName) return;
                const slotMatch = infoSlotName?.match(/\d+/)?.[0];
                const newSlotId = slotMatch ? parseInt(slotMatch) : undefined;
                if (!newSlotId && newSlotId !== 0) return;
                const infoSlotValue: OWMatchInfoMeInventory = (me as any)[infoSlotName];

                const slotUpdate = infoSlotValue
                    ? {
                          item: new Item({ fromInGameInventoryId: infoSlotValue.name }),
                          amount: cleanInt(infoSlotValue.amount),
                      }
                    : undefined;

                const newInventorySlotItems: InventorySlots<Item> = {
                    ...this.myInventorySlots$.value,
                    [newSlotId]: slotUpdate,
                };

                this.myInventorySlots$.next(newInventorySlotItems);
            });
    }

    private setupMyInUseItem(): void {
        this.inventoryInfoUpdates$
            .pipe(
                filter(() => this.match.isActive),
                filter((infoUpdate) => typeof infoUpdate.info.me?.inUse?.inUse === "string"),
                map((infoUpdate) => infoUpdate.info.me?.inUse?.inUse),
                filter((inUse) => !!inUse) // match_start defaults this to "", which we don't want
            )
            .subscribe((inUse) => {
                const newInventoryItem = new Item({ fromInGameInfoName: inUse });
                this.myInUseItem$.next(newInventoryItem);
            });
    }

    /**
     * @overwolfQuirk - When all weapons are dropped, "Thermite Grenade" is returned as the weapon in use.
     */
    private setupMyWeapons(): void {
        const blacklistedItemIds = ["unknown", "grenade_arc_star", "grenade_frag", "grenade_thermite", "empty_handed"];

        this.inventoryInfoUpdates$
            .pipe(
                filter(() => this.match.isActive),
                filter((infoUpdate) => Object.keys(infoUpdate?.info?.me ?? {}).includes("weapons")),
                map((infoUpdate) => (infoUpdate.info.me?.weapons ? infoUpdate.info.me?.weapons : {}) as OWMatchInfoMeWeapons)
            )
            .subscribe((weapons) => {
                let newWeaponSlotItems: InventorySlots<WeaponItem> = {};
                Object.entries(weapons).forEach(([weaponSlotId, weaponName]) => {
                    const slotMatch = weaponSlotId?.match(/\d+/)?.[0];
                    const newSlotId = slotMatch ? parseInt(slotMatch) : undefined;
                    if (!newSlotId && newSlotId !== 0) return;
                    const weaponItem = new WeaponItem({ fromInGameInfoName: weaponName });
                    if (weaponItem.itemId && blacklistedItemIds.includes(weaponItem.itemId)) return;
                    newWeaponSlotItems[newSlotId] = { item: weaponItem };
                });

                // No weapons, so empty handed
                if (!Object.keys(newWeaponSlotItems).length) {
                    newWeaponSlotItems = {
                        0: { item: new WeaponItem({ fromId: "empty_handed" }) },
                    };
                }

                const sizeChanged = Object.keys(this.myWeaponSlots$.value).length !== Object.keys(newWeaponSlotItems).length;
                let hasChanged = false;
                Object.entries(this.myWeaponSlots$.value).forEach(([_slotId, slotItem]) => {
                    const slotId = parseInt(_slotId);
                    if (!hasChanged) hasChanged = newWeaponSlotItems[slotId]?.item?.itemId !== slotItem.item?.itemId;
                });

                if (hasChanged || sizeChanged) this.myWeaponSlots$.next(newWeaponSlotItems);
            });
    }
}

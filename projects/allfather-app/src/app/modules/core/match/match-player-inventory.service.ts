import { InventorySlots } from "@allfather-app/app/common/inventory-slots";
import { Item } from "@allfather-app/app/common/items/item";
import { WeaponItem } from "@allfather-app/app/common/items/weapon-item";
import { BaseService } from "@allfather-app/app/common/services/base-service.abstract";
import { OverwolfGameDataService, OWInfoUpdates2Event, OWMatchInfoMeInventory } from "@allfather-app/app/common/services/overwolf";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { cleanInt, findKeyByKeyRegEx } from "common/utilities/";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
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
    /** Local player's current weapon, throwable, inventory, ultimate, etc. item in use. Emits new data only when match is started. */
    public readonly myInUseItem$ = new BehaviorSubject<Optional<Item>>(undefined);
    /** Local player's current weapons. Emits new data only when match is started. */
    public readonly myWeaponSlots$ = new BehaviorSubject<InventorySlots<WeaponItem>>({});
    /** Local player's current backpack inventory. Emits new data only when match is started.*/
    public readonly myInventorySlots$ = new BehaviorSubject<InventorySlots>({});

    private inventoryInfoUpdates$: Observable<OWInfoUpdates2Event>;
    private isMatchStarted = false;

    constructor(private readonly match: MatchService, private readonly overwolfGameData: OverwolfGameDataService) {
        super();
        this.inventoryInfoUpdates$ = this.overwolfGameData.infoUpdates$.pipe(
            takeUntil(this.destroy$),
            filter((infoUpdate) => infoUpdate.feature === "inventory")
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
            this.isMatchStarted = true;
        });
        this.match.endedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.isMatchStarted = false;
        });
    }

    /**
     * Updates backpack inventory item updates
     */
    private setupMyInventorySlots(): void {
        this.inventoryInfoUpdates$
            .pipe(
                map((infoUpdate) => infoUpdate.info.me),
                filter(() => this.isMatchStarted)
            )
            .subscribe((me) => {
                const infoSlotName = findKeyByKeyRegEx(me, /^inventory_/);
                if (!infoSlotName) return;
                const slotMatch = infoSlotName?.match(/\d+/)?.[0];
                const newSlotId = slotMatch ? parseInt(slotMatch) : undefined;
                if (!newSlotId) return;
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
                filter((infoUpdate) => typeof infoUpdate.info.me?.inUse?.inUse === "string"),
                map((infoUpdate) => infoUpdate.info.me?.inUse?.inUse),
                filter((inUse) => !!inUse), // match_start defaults this to "", which we don't want
                filter(() => this.isMatchStarted)
            )
            .subscribe((inUse) => {
                const newInventoryItem = new Item({ fromInGameInfoName: inUse });
                this.myInUseItem$.next(newInventoryItem);
            });
    }

    private setupMyWeapons(): void {
        this.inventoryInfoUpdates$
            .pipe(
                filter((infoUpdate) => typeof infoUpdate.info.me?.weapons === "object"),
                map((infoUpdate) => infoUpdate.info.me?.weapons),
                filter(() => this.isMatchStarted)
            )
            .subscribe((weapons) => {
                const infoSlotName = findKeyByKeyRegEx(weapons, /^weapon/);
                if (!infoSlotName) return;
                const slotMatch = infoSlotName?.match(/\d+/)?.[0];
                const newSlotId = slotMatch ? parseInt(slotMatch) : undefined;
                if (!newSlotId) return;
                const infoSlotValue: string = (weapons as any)[infoSlotName];

                const slotUpdate = infoSlotValue ? { item: new WeaponItem({ fromInGameInfoName: infoSlotValue }) } : undefined;

                const newWeaponSlotItems: InventorySlots<Item> = {
                    ...this.myWeaponSlots$.value,
                    [newSlotId]: slotUpdate,
                };

                this.myWeaponSlots$.next(newWeaponSlotItems);
            });
    }
}

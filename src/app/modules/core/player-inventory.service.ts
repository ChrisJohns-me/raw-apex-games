import { Injectable, OnDestroy } from "@angular/core";
import { InventorySlotItem, InventorySlots } from "@common/inventory-slots";
import { Item } from "@common/item";
import { WeaponItem } from "@common/weapon-item";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { findKeyByKeyRegEx, findValueByKeyRegEx } from "src/utilities";
import { MatchService } from "./match.service";
import { OverwolfDataProviderService, OWInfoUpdates2Event, OWMatchInfoMeInventory } from "./overwolf-data-provider";

@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfDataProviderService],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("PlayerInventoryService", PlayerInventoryService, deps),
})
export class PlayerInventoryService implements OnDestroy {
    public readonly inUse$ = new BehaviorSubject<Optional<Item>>(undefined);
    public readonly weaponSlots$ = new BehaviorSubject<InventorySlots<WeaponItem>>({});
    public readonly inventorySlots$ = new BehaviorSubject<InventorySlots>({});

    private inventoryInfoUpdates$: Observable<OWInfoUpdates2Event>;
    private readonly _unsubscribe = new Subject<void>();

    constructor(private readonly match: MatchService, private readonly overwolf: OverwolfDataProviderService) {
        this.inventoryInfoUpdates$ = this.overwolf.infoUpdates$.pipe(
            takeUntil(this._unsubscribe),
            filter((infoUpdate) => infoUpdate.feature === "inventory")
        );
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupMatchStateEvents();
        this.setupInventorySlots();
        this.setupInUse();
        this.setupWeapons();
    }

    private setupMatchStateEvents(): void {
        this.match.started$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this.inUse$.next(undefined);
            this.weaponSlots$.next({});
            this.inventorySlots$.next({});
        });
    }

    //#region Inventory Slots
    private setupInventorySlots(): void {
        this.inventoryInfoUpdates$.subscribe((infoUpdate) => {
            const inventorySlotId = findKeyByKeyRegEx(infoUpdate.info.me, /^inventory_/);
            const inventoryUpdate = findValueByKeyRegEx<OWMatchInfoMeInventory>(infoUpdate.info.me, /^inventory_/);
            if (!inventorySlotId || !inventoryUpdate) return;

            const slotId = parseInt(inventorySlotId.replace("inventory_", ""));
            const item = new Item({ fromInGameInventoryId: inventoryUpdate.name });
            const amount = parseInt(String(inventoryUpdate.amount));

            const newInventorySlots = { ...this.inventorySlots$.value } as InventorySlots;
            newInventorySlots[slotId] = { ...item, amount: amount } as InventorySlotItem;

            this.inventorySlots$.next(newInventorySlots);
        });
    }
    //#endregion

    //#region Item in use
    private setupInUse(): void {
        this.inventoryInfoUpdates$
            .pipe(
                filter((infoUpdate) => typeof infoUpdate.info.me?.inUse?.inUse === "string"),
                map((infoUpdate) => infoUpdate.info.me?.inUse?.inUse),
                filter((inUse) => !!inUse)
            )
            .subscribe((inUse) => {
                const newInventoryItem = new Item({ fromInGameInfoName: inUse });
                this.inUse$.next(newInventoryItem);
            });
    }
    //#endregion

    //#region Weapons
    private setupWeapons(): void {
        this.inventoryInfoUpdates$
            .pipe(
                filter((infoUpdate) => typeof infoUpdate.info.me?.weapons === "object"),
                map((infoUpdate) => infoUpdate.info.me?.weapons)
            )
            .subscribe((weapons) => {
                const newWeapons: [WeaponItem, WeaponItem] = [
                    new WeaponItem({ fromInGameInfoName: weapons?.weapon0 }),
                    new WeaponItem({ fromInGameInfoName: weapons?.weapon1 }),
                ];
                this.weaponSlots$.next(newWeapons);
            });
    }
    //#endregion
}

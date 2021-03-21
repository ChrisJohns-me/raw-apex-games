import { Injectable, OnDestroy } from "@angular/core";
import { InventorySlotItem, InventorySlots } from "@common/inventory-slots";
import { Item } from "@common/item";
import { WeaponItem } from "@common/weapon-item";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { findKeyByKeyRegEx, findValueByKeyRegEx } from "src/utilities";
import { cleanInt } from "src/utilities/number";
import { MatchService } from "./match.service";
import { OverwolfDataProviderService, OWInfoUpdates2Event, OWMatchInfoMeInventory } from "./overwolf-data-provider";

@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfDataProviderService],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("PlayerInventoryService", PlayerInventoryService, deps),
})
export class PlayerInventoryService implements OnDestroy {
    public readonly myInUseItem$ = new BehaviorSubject<Optional<Item>>(undefined);
    public readonly myWeaponSlots$ = new BehaviorSubject<InventorySlots<WeaponItem>>({});
    public readonly myInventorySlots$ = new BehaviorSubject<InventorySlots>({});

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
        this.setupMyInventorySlots();
        this.setupMyInUseItem();
        this.setupMyWeapons();
    }

    private setupMatchStateEvents(): void {
        this.match.started$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this.myInUseItem$.next(undefined);
            this.myWeaponSlots$.next({});
            this.myInventorySlots$.next({});
        });
    }

    //#region Inventory Slots
    private setupMyInventorySlots(): void {
        this.inventoryInfoUpdates$.subscribe((infoUpdate) => {
            const inventorySlotId = findKeyByKeyRegEx(infoUpdate.info.me, /^inventory_/);
            const inventoryUpdate = findValueByKeyRegEx<OWMatchInfoMeInventory>(infoUpdate.info.me, /^inventory_/);
            if (!inventorySlotId || !inventoryUpdate) return;

            const slotId = parseInt(inventorySlotId.replace("inventory_", ""));
            const item = new Item({ fromInGameInventoryId: inventoryUpdate.name });
            const amount = cleanInt(inventoryUpdate.amount);

            const newInventorySlots = { ...this.myInventorySlots$.value } as InventorySlots;
            newInventorySlots[slotId] = { ...item, amount: amount } as InventorySlotItem;

            this.myInventorySlots$.next(newInventorySlots);
        });
    }
    //#endregion

    //#region Item in use
    private setupMyInUseItem(): void {
        this.inventoryInfoUpdates$
            .pipe(
                filter((infoUpdate) => typeof infoUpdate.info.me?.inUse?.inUse === "string"),
                map((infoUpdate) => infoUpdate.info.me?.inUse?.inUse),
                filter((inUse) => !!inUse)
            )
            .subscribe((inUse) => {
                const newInventoryItem = new Item({ fromInGameInfoName: inUse });
                this.myInUseItem$.next(newInventoryItem);
            });
    }
    //#endregion

    //#region Weapons
    private setupMyWeapons(): void {
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
                this.myWeaponSlots$.next(newWeapons);
            });
    }
    //#endregion
}

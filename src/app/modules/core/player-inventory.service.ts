import { Injectable, OnDestroy } from "@angular/core";
import { InventorySlotItem, InventorySlots } from "@common/inventory-slots";
import { Item } from "@common/item";
import { MatchState } from "@common/match";
import { WeaponItem } from "@common/weapon-item";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { findKeyByKeyRegEx, findValueByKeyRegEx } from "src/utilities";
import { MatchService } from "./match.service";
import { OverwolfDataProviderService, OWMatchInfoMeInventory } from "./overwolf-data-provider";

@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfDataProviderService],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("PlayerInventoryService", PlayerInventoryService, deps),
})
export class PlayerInventoryService implements OnDestroy {
    public readonly inUse$ = new BehaviorSubject<Optional<Item>>(undefined);
    public readonly weaponSlots$ = new BehaviorSubject<Optional<InventorySlots<WeaponItem>>>(undefined);
    public readonly inventorySlots$ = new BehaviorSubject<Optional<InventorySlots>>(undefined);

    private inventoryInfoUpdates$ = this.overwolf.infoUpdates$.pipe(
        filter((infoUpdate) => infoUpdate.feature === "inventory")
    );
    private readonly _unsubscribe = new Subject<void>();

    constructor(private readonly match: MatchService, private readonly overwolf: OverwolfDataProviderService) {}

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupInventorySlots();
        this.setupInUse();
        this.setupWeapons();
    }

    //#region Inventory Slots
    private setupInventorySlots(): void {
        this.match.state$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((matchState) => matchState === MatchState.Active),
                tap(() => this.inventorySlots$.next(undefined)),
                switchMap(() => this.inventoryInfoUpdates$)
            )
            .subscribe((infoUpdate) => {
                const inventorySlotId = findKeyByKeyRegEx(infoUpdate.info.me, /^inventory_/);
                const inventoryUpdate = findValueByKeyRegEx<OWMatchInfoMeInventory>(infoUpdate.info.me, /^inventory_/);
                if (!inventorySlotId || !inventoryUpdate) return;

                const slotId = parseInt(inventorySlotId.replace("inventory_", ""));
                const item = new Item({ fromInGameInventoryId: inventoryUpdate.name });
                const amount = parseInt(String(inventoryUpdate.amount));

                const newInventorySlots = { ...this.inventorySlots$ } as InventorySlots;
                newInventorySlots[slotId] = { ...item, amount: amount } as InventorySlotItem;

                this.inventorySlots$.next(newInventorySlots);
            });
    }
    //#endregion

    //#region Item in use
    private setupInUse(): void {
        this.match.state$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((matchState) => matchState === MatchState.Active),
                tap(() => this.inUse$.next(undefined)),
                switchMap(() => this.inventoryInfoUpdates$),
                map((infoUpdate) => infoUpdate.info.me?.inUse?.inUse)
            )
            .subscribe((inUse) => {
                const newInventoryItem = new Item({ fromInGameInfoName: inUse });
                this.inUse$.next(newInventoryItem);
            });
    }
    //#endregion

    //#region Weapons
    private setupWeapons(): void {
        this.match.state$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((matchState) => matchState === MatchState.Active),
                tap(() => this.weaponSlots$.next(undefined)),
                switchMap(() => this.inventoryInfoUpdates$),
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

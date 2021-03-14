import { Injectable, OnDestroy } from "@angular/core";
import { InventoryItem } from "@common/inventory-item";
import { InventoryStore } from "@common/inventory-store";
import { MatchState } from "@common/match";
import { Weapon } from "@common/weapon";
import { BehaviorSubject, Subject } from "rxjs";
import { distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
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
    public readonly inventory$ = new BehaviorSubject<InventoryStore>(new InventoryStore());
    public readonly inUse$ = new BehaviorSubject<InventoryItem>(new InventoryItem());
    public readonly weapons$ = new BehaviorSubject<[Weapon, Weapon]>([new Weapon(), new Weapon()]);

    private _inventory?: InventoryStore;

    private readonly _unsubscribe = new Subject<void>();

    constructor(private readonly match: MatchService, private readonly overwolf: OverwolfDataProviderService) {
        console.debug(`[${this.constructor.name}] Instantiated`);

        this.start();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private start(): void {
        this.setupInventory();
        this.setupInUse();
        this.setupWeapons();
    }

    //#region Inventory
    private setupInventory(): void {
        this.match.state$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((matchState) => matchState === MatchState.Active),
                tap(() => {
                    this._inventory = new InventoryStore();
                    this.inventory$.next(this._inventory);
                }),
                switchMap(() => this.overwolf.infoUpdates$),
                filter((infoUpdate) => infoUpdate.feature === "inventory")
            )
            .subscribe((infoUpdate) => {
                const inventorySlotId = findKeyByKeyRegEx(infoUpdate.info.me, /^inventory_/);
                const inventoryUpdate = findValueByKeyRegEx<OWMatchInfoMeInventory>(infoUpdate.info.me, /^inventory_/);
                if (!inventorySlotId || !inventoryUpdate) return;

                const slotId = parseInt(inventorySlotId.replace("inventory_", ""));
                const item = new InventoryItem({ fromId: inventoryUpdate.name });
                const amount = parseInt((inventoryUpdate.amount as unknown) as string);

                this._inventory?.setSlot(slotId, item, amount);
                if (this._inventory) this.inventory$.next(this._inventory);
            });
    }
    //#endregion

    //#region Item in use
    private setupInUse(): void {
        this.match.state$
            .pipe(
                takeUntil(this._unsubscribe),
                distinctUntilChanged(),
                filter((matchState) => matchState === MatchState.Active),
                tap(() => this.inUse$.next(new InventoryItem())),
                switchMap(() => this.overwolf.infoUpdates$),
                filter((infoUpdate) => infoUpdate.feature === "inventory"),
                map((infoUpdate) => infoUpdate.info.me?.inUse?.inUse)
            )
            .subscribe((inUse) => {
                const newInventoryItem = new InventoryItem({ fromInUseName: inUse });
                this.inUse$.next(newInventoryItem);
            });
    }
    //#endregion

    //#region Weapons
    private setupWeapons(): void {
        this.match.state$
            .pipe(
                takeUntil(this._unsubscribe),
                distinctUntilChanged(),
                filter((matchState) => matchState === MatchState.Active),
                tap(() => this.weapons$.next([new Weapon(), new Weapon()])),
                switchMap(() => this.overwolf.infoUpdates$),
                filter((infoUpdate) => infoUpdate.feature === "inventory"),
                map((infoUpdate) => infoUpdate.info.me?.weapons)
            )
            .subscribe((weapons) => {
                const newWeapons: [Weapon, Weapon] = [
                    new Weapon({ fromInfoWeapons: weapons?.weapon0 }),
                    new Weapon({ fromInfoWeapons: weapons?.weapon1 }),
                ];
                this.weapons$.next(newWeapons);
            });
    }
    //#endregion
}

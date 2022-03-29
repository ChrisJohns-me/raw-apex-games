import { InventorySlot, InventorySlots } from "@allfather-app/app/common/inventory-slots";
import { Item } from "@allfather-app/app/common/items/item";
import { MatchLocationPhase } from "@allfather-app/app/common/match/location";
import { MatchState, MatchStateChangedEvent } from "@allfather-app/app/common/match/state";
import { PlayerState } from "@allfather-app/app/common/player-state";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { MatchPlayerInventoryService } from "@allfather-app/app/modules/core/match/match-player-inventory.service";
import { MatchPlayerLocationService } from "@allfather-app/app/modules/core/match/match-player-location.service";
import { MatchPlayerService } from "@allfather-app/app/modules/core/match/match-player.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { combineLatest, Observable, Subject } from "rxjs";
import { distinctUntilChanged, map, takeUntil } from "rxjs/operators";

// Item IDs from items.json
const VISIBLEITEMIDS: string[] = [
    "syringe",
    "med_kit",
    "shield_battery",
    "shield_cell",
    "phoenix_kit",
    "grenade_thermite",
    "grenade_frag",
    "grenade_arc_star",
    "ultimate_accelerant",
];

@Component({
    selector: "app-hud-mini-inventory-window",
    templateUrl: "./mini-inventory-window.component.html",
    styleUrls: ["./mini-inventory-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniInventoryWindowComponent implements OnInit, OnDestroy {
    public isVisible = false; // based on match state + player state
    public myInventorySlotList: InventorySlot<Item>[] = [];

    //#region Config

    //#endregion
    private readonly visibleStates$: Observable<[MatchStateChangedEvent, PlayerState, Optional<MatchLocationPhase>]>;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly configuration: ConfigurationService,
        private readonly match: MatchService,
        private readonly matchPlayer: MatchPlayerService,
        private readonly matchPlayerInventory: MatchPlayerInventoryService,
        private readonly matchPlayerLocation: MatchPlayerLocationService
    ) {
        this.configuration.config$.pipe(takeUntil(this.destroy$)).subscribe((config) => {});
        this.visibleStates$ = combineLatest([this.match.state$, this.matchPlayer.myState$, this.matchPlayerLocation.myLocationPhase$]).pipe(
            takeUntil(this.destroy$),
            distinctUntilChanged()
        );
    }

    public ngOnInit(): void {
        this.setupOnMatchStart();
        this.setupVisibleStates();
        this.setupInventoryEvents();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupOnMatchStart(): void {
        this.match.startedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.myInventorySlotList = [];
        });
    }

    private setupVisibleStates(): void {
        this.visibleStates$.subscribe(([stateChanged, myState, locationPhase]) => {
            this.isVisible =
                stateChanged.state === MatchState.Active && myState === PlayerState.Alive && locationPhase === MatchLocationPhase.HasLanded;
            this.cdr.detectChanges();
        });
    }

    private setupInventoryEvents(): void {
        this.matchPlayerInventory.myInventorySlots$
            .pipe(
                takeUntil(this.destroy$),
                map((inventoryKeySlots: InventorySlots<Item>) => Object.values(inventoryKeySlots)),
                map((inventorySlots: InventorySlot<Item>[]) => {
                    return inventorySlots.filter((inventorySlot: Optional<InventorySlot<Item>>) => {
                        return inventorySlot?.item?.itemId && VISIBLEITEMIDS.includes(inventorySlot.item.itemId);
                    });
                }),
                map((inventorySlots: InventorySlot<Item>[]) => this.consolidateInventorySlots(inventorySlots))
            )
            .subscribe((inventorySlots: InventorySlot<Item>[]) => {
                this.myInventorySlotList = inventorySlots;
                this.cdr.detectChanges();
            });
    }

    /**
     * Finds duplicates, adds the amount, and removes the duplicates.
     */
    private consolidateInventorySlots(inventorySlots: InventorySlot<Item>[]): InventorySlot<Item>[] {
        let consolidatedInventorySlots: InventorySlot<Item>[] = [];
        inventorySlots.forEach((inventorySlot: InventorySlot<Item>) => {
            const existingSlot = consolidatedInventorySlots.find((consolidatedSlot: InventorySlot<Item>) => {
                return consolidatedSlot.item.itemId === inventorySlot.item.itemId;
            });

            if (!existingSlot) {
                consolidatedInventorySlots.push(inventorySlot);
            } else {
                const copySlot: InventorySlot<Item> = {
                    item: new Item({ fromId: inventorySlot.item.itemId }),
                    amount: (existingSlot.amount ?? 0) + (inventorySlot.amount ?? 0),
                };
                consolidatedInventorySlots = consolidatedInventorySlots.filter((consolidatedInventorySlot: InventorySlot<Item>) => {
                    return consolidatedInventorySlot.item.itemId !== inventorySlot.item.itemId;
                });
                consolidatedInventorySlots.push(copySlot);
            }
        });
        return consolidatedInventorySlots;
    }
}

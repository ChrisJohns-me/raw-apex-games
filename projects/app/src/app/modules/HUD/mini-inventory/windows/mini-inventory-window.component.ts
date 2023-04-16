import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { InventorySlot, InventorySlots } from "@app/app/common/inventory-slots";
import { Item } from "@app/app/common/items/item";
import { MatchLocationPhase } from "@app/app/common/match/location";
import { MatchState, MatchStateChangedEvent } from "@app/app/common/match/state";
import { OverwolfWindowName } from "@app/app/common/overwolf-window";
import { PlayerState } from "@app/app/common/player-state";
import { MatchPlayerInventoryService } from "@app/app/modules/core/match/match-player-inventory.service";
import { MatchPlayerLocationService } from "@app/app/modules/core/match/match-player-location.service";
import { MatchPlayerStatsService } from "@app/app/modules/core/match/match-player-stats.service";
import { MatchPlayerService } from "@app/app/modules/core/match/match-player.service";
import { MatchService } from "@app/app/modules/core/match/match.service";
import { Observable, Subject, combineLatest } from "rxjs";
import { distinctUntilChanged, map, takeUntil } from "rxjs/operators";

// TODO: Make mini-inventory only visible in RAW APEX GAMES matches

// Item IDs from items.json
// Also is a reference for sorting.
const VISIBLEITEMIDS: string[] = [
    "shield_cell",
    "shield_battery",
    "syringe",
    "med_kit",
    "phoenix_kit",
    "grenade_arc_star",
    "grenade_frag",
    "grenade_thermite",
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

    public readonly OverwolfWindowName = OverwolfWindowName;

    private readonly visibleStates$: Observable<[MatchStateChangedEvent, PlayerState, Optional<MatchLocationPhase>, boolean]>;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly match: MatchService,
        private readonly matchPlayer: MatchPlayerService,
        private readonly matchPlayerInventory: MatchPlayerInventoryService,
        private readonly matchPlayerLocation: MatchPlayerLocationService,
        private readonly matchPlayerStats: MatchPlayerStatsService
    ) {
        this.visibleStates$ = combineLatest([
            this.match.state$,
            this.matchPlayer.myState$,
            this.matchPlayerLocation.myLocationPhase$,
            this.matchPlayerStats.victory$,
        ]).pipe(takeUntil(this.destroy$), distinctUntilChanged());
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
        this.visibleStates$.subscribe(([stateChanged, myState, locationPhase, victory]) => {
            this.isVisible =
                stateChanged.state === MatchState.Active &&
                myState === PlayerState.Alive &&
                locationPhase === MatchLocationPhase.Landed &&
                victory === false;
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
                map((inventorySlots: InventorySlot<Item>[]) => this.consolidateInventorySlots(inventorySlots)),
                map((inventorySlots: InventorySlot<Item>[]) => this.sortInventorySlots(inventorySlots, VISIBLEITEMIDS))
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

    private sortInventorySlots(inventorySlots: InventorySlot<Item>[], sortingArray: string[]): InventorySlot<Item>[] {
        return inventorySlots.slice().sort((a, b) => {
            return sortingArray.indexOf(a.item.itemId ?? "") - sortingArray.indexOf(b.item.itemId ?? "");
        });
    }
}

import { InventorySlot } from "@allfather-app/app/common/inventory-slots";
import { MatchLocationPhase } from "@allfather-app/app/common/match/location";
import { MatchRing } from "@allfather-app/app/common/match/ring";
import { MatchState, MatchStateChangedEvent } from "@allfather-app/app/common/match/state";
import { PlayerState } from "@allfather-app/app/common/player-state";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { MatchPlayerInventoryService } from "@allfather-app/app/modules/core/match/match-player-inventory.service";
import { MatchPlayerLocationService } from "@allfather-app/app/modules/core/match/match-player-location.service";
import { MatchPlayerStatsService } from "@allfather-app/app/modules/core/match/match-player-stats.service";
import { MatchPlayerService } from "@allfather-app/app/modules/core/match/match-player.service";
import { MatchRingService } from "@allfather-app/app/modules/core/match/match-ring.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { combineLatest, Observable, Subject } from "rxjs";
import { distinctUntilChanged, filter, map, takeUntil } from "rxjs/operators";

type HealingItemHealthTime = {
    id: string;
    neededHealthTime: number; // (damagePerTick / ringTickRate) * duration
};
type HealingItem = { id: string; duration: number };
const HEALINGITEMS: HealingItem[] = [
    { id: "syringe", duration: 5000 },
    { id: "med_kit", duration: 8000 },
    { id: "phoenix_kit", duration: 10000 },
];

@Component({
    selector: "app-hud-healing-helper-window",
    templateUrl: "./healing-helper-window.component.html",
    styleUrls: ["./healing-helper-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealingHelperWindowComponent implements OnInit, OnDestroy {
    public isVisible = false; // based on match state + player state
    public availableHealingItems: HealingItemHealthTime[] = [];
    //#region Config

    //#endregion
    private currentRing: Optional<MatchRing>;
    private ringDamageTickRateMs = 1500;
    private maxHealth = 100;
    private readonly visibleStates$: Observable<[MatchStateChangedEvent, PlayerState, Optional<MatchLocationPhase>, boolean]>;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly configuration: ConfigurationService,
        private readonly match: MatchService,
        private readonly matchPlayer: MatchPlayerService,
        private readonly matchPlayerInventory: MatchPlayerInventoryService,
        private readonly matchPlayerLocation: MatchPlayerLocationService,
        private readonly matchPlayerStats: MatchPlayerStatsService,
        private readonly matchRing: MatchRingService
    ) {
        this.configuration.config$.pipe(takeUntil(this.destroy$)).subscribe((config) => {
            this.ringDamageTickRateMs = config.brFacts.ringDamageTickRate;
            this.maxHealth = config.facts.maxHealth;
        });
        this.visibleStates$ = combineLatest([
            this.match.state$,
            this.matchPlayer.myState$,
            this.matchPlayerLocation.myLocationPhase$,
            this.matchPlayerStats.victory$,
        ]).pipe(takeUntil(this.destroy$), distinctUntilChanged());
    }

    public ngOnInit(): void {
        this.setupHealingHealthItems();
        this.setupVisibleStates();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupHealingHealthItems(): void {
        const ring$ = this.matchRing.currentBRRing$.pipe(filter((ring) => !!ring));
        const inventory$ = this.matchPlayerInventory.myInventorySlots$.pipe(
            map((inventorySlots) => Object.values(inventorySlots)),
            map((inventorySlots) => this.filterInventorySlots(inventorySlots, HEALINGITEMS))
        );

        combineLatest([ring$, inventory$])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([ring, inventory]) => {
                this.currentRing = ring;
                this.availableHealingItems = this.getHealingItemHealthTimes(HEALINGITEMS);
                this.availableHealingItems = this.filterHealingItemHealthTimes(this.availableHealingItems, inventory);

                this.cdr.detectChanges();
            });
    }

    private setupVisibleStates(): void {
        this.visibleStates$.subscribe(([stateChanged, myState, locationPhase, victory]) => {
            this.isVisible =
                stateChanged.state === MatchState.Active &&
                myState === PlayerState.Alive &&
                locationPhase === MatchLocationPhase.HasLanded &&
                victory === false;
            this.cdr.detectChanges();
        });
    }

    private getHealingItemHealthTimes(healingItems: HealingItem[]): HealingItemHealthTime[] {
        if (!this.currentRing) return [];
        return healingItems.map((item) => {
            const damagePerSecond = this.currentRing!.damagePerTick / this.ringDamageTickRateMs;
            const neededHealthTime = damagePerSecond * item.duration;
            console.info(
                `[HealingHelperWindow] neededHealthTime ${neededHealthTime}hp` +
                    ` for "${item.id}", for ring ${this.currentRing!.ringNumber}` +
                    ` (damagePerSecond: ${damagePerSecond})`
            );
            return {
                id: item.id,
                neededHealthTime: neededHealthTime + damagePerSecond, // add one second buffer
            };
        });
    }

    /**
     * Ensures items are between 0 and maxHealth
     * Removes items that are not in the inventory
     * @param healingItemHealthTimes {HealingItemHealthTime[]}
     * @returns {HealingItemHealthTime[]}
     */
    private filterHealingItemHealthTimes(
        healingItemHealthTimes: HealingItemHealthTime[],
        inventory: InventorySlot[]
    ): HealingItemHealthTime[] {
        return healingItemHealthTimes.filter((item) => {
            if (item.neededHealthTime <= 0) return false;
            if (item.neededHealthTime >= this.maxHealth) return false;
            const itemInInventory = inventory.find((i) => i.item.itemId === item.id);
            if (!itemInInventory) return false;
            return true;
        });
    }

    /**
     * Removes non-healing items from the inventory
     * @param inventorySlots {InventorySlot[]}
     */
    private filterInventorySlots(inventorySlots: InventorySlot[], healingItems: HealingItem[]): InventorySlot[] {
        return inventorySlots.filter((slot) => {
            const item = slot.item;
            if (!item) return false;
            const healingItemFound = healingItems.find((healingItem) => healingItem.id === item.itemId);
            if (!healingItemFound) return false;
            return true;
        });
    }
}

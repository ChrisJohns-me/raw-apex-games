import { MatchLocationPhase } from "@allfather-app/app/common/match/location";
import { MatchRing } from "@allfather-app/app/common/match/ring";
import { MatchState, MatchStateChangedEvent } from "@allfather-app/app/common/match/state";
import { PlayerState } from "@allfather-app/app/common/player-state";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { MatchPlayerInventoryService } from "@allfather-app/app/modules/core/match/match-player-inventory.service";
import { MatchPlayerLocationService } from "@allfather-app/app/modules/core/match/match-player-location.service";
import { MatchPlayerService } from "@allfather-app/app/modules/core/match/match-player.service";
import { MatchRingService } from "@allfather-app/app/modules/core/match/match-ring.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { combineLatest, Observable, Subject } from "rxjs";
import { distinctUntilChanged, takeUntil } from "rxjs/operators";

type HealingItemHealthTime = {
    id: string;
    neededHealthTime: number; // (damagePerTick / ringTickRate) * duration
};

const HEALINGITEMS: { id: string; duration: number }[] = [
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
    private readonly visibleStates$: Observable<[MatchStateChangedEvent, PlayerState, Optional<MatchLocationPhase>]>;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly configuration: ConfigurationService,
        private readonly match: MatchService,
        private readonly matchPlayer: MatchPlayerService,
        private readonly matchPlayerInventory: MatchPlayerInventoryService,
        private readonly matchPlayerLocation: MatchPlayerLocationService,
        private readonly matchRing: MatchRingService
    ) {
        this.configuration.config$.pipe(takeUntil(this.destroy$)).subscribe((config) => {
            this.ringDamageTickRateMs = config.brFacts.ringDamageTickRate;
            this.maxHealth = config.facts.maxHealth;
        });
        this.visibleStates$ = combineLatest([this.match.state$, this.matchPlayer.myState$, this.matchPlayerLocation.myLocationPhase$]).pipe(
            takeUntil(this.destroy$),
            distinctUntilChanged()
        );
    }

    public ngOnInit(): void {
        this.setupMatchRing();
        this.setupVisibleStates();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupMatchRing(): void {
        this.matchRing.currentBRRing$.pipe(takeUntil(this.destroy$)).subscribe((ring) => {
            this.currentRing = ring;
            this.calcAvailableHealingItems();
            this.cdr.detectChanges();
        });
    }

    private setupVisibleStates(): void {
        this.visibleStates$.subscribe(([stateChanged, myState, locationPhase]) => {
            this.isVisible =
                stateChanged.state === MatchState.Active && myState === PlayerState.Alive && locationPhase === MatchLocationPhase.HasLanded;
            this.cdr.detectChanges();
        });
    }

    private calcAvailableHealingItems(): void {
        if (!this.currentRing) return;
        this.availableHealingItems = HEALINGITEMS.map((item) => {
            const damagePerSecond = this.currentRing!.damagePerTick / this.ringDamageTickRateMs;
            const neededHealthTime = damagePerSecond * item.duration;
            console.info(
                `[HealingHelperWindow] neededHealthTime ${neededHealthTime}hp ` +
                    `for "${item.id}", for ring ${this.currentRing!.ringNumber}` +
                    `(damagePerSecond: ${damagePerSecond})`
            );
            return {
                id: item.id,
                neededHealthTime: neededHealthTime + damagePerSecond, // add one second buffer
            };
        }).filter((item) => {
            if (!item) return false;
            if (item.neededHealthTime <= 0) return false;
            if (item.neededHealthTime >= this.maxHealth) return false;
            return true;
        });
    }
}

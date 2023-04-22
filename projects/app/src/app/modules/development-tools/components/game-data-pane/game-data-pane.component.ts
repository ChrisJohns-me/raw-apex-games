import { FeatureState, FeatureStates } from "#app/models/feature-status.js";
import { GamePhase } from "#app/models/game-phase.js";
import { MatchLocationPhase } from "#app/models/match/location.js";
import { MatchState } from "#app/models/match/state.js";
import { PlayerState } from "#app/models/player-state.js";
import { GameProcessService } from "#app/modules/core/game-process.service.js";
import { GameService } from "#app/modules/core/game.service.js";
import { MatchMapService } from "#app/modules/core/match/match-map.service.js";
import { MatchPlayerInventoryService } from "#app/modules/core/match/match-player-inventory.service.js";
import { MatchPlayerLegendService } from "#app/modules/core/match/match-player-legend.service.js";
import { MatchPlayerLocationService } from "#app/modules/core/match/match-player-location.service.js";
import { MatchPlayerStatsService } from "#app/modules/core/match/match-player-stats.service.js";
import { MatchPlayerService } from "#app/modules/core/match/match-player.service.js";
import { MatchRingService } from "#app/modules/core/match/match-ring.service.js";
import { MatchRosterService } from "#app/modules/core/match/match-roster.service.js";
import { MatchService } from "#app/modules/core/match/match.service.js";
import { ExposedOverwolfGameDataService } from "#app/modules/core/overwolf-exposed-data.service.js";
import { OverwolfFeatureStatusService } from "#app/modules/core/overwolf/overwolf-feature-status.service.js";
import { PlayerNameService } from "#app/modules/core/player-name.service.js";
import { PlayerOriginIdService } from "#app/modules/core/player-origin-id.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { interval, Subject, Subscription, timer } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { v4 as uuid } from "uuid";

@Component({
    selector: "app-game-data-pane",
    templateUrl: "./game-data-pane.component.html",
    styleUrls: ["./game-data-pane.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameDataPaneComponent implements OnInit, OnDestroy {
    public Infinity = Infinity;
    public changedHighlightColor = "#ffc9c9";
    public autoUltimate = false;

    public get featureStatus(): FeatureState {
        return this.overwolfFeatureStatusService.checkAllFeatureStates();
    }

    public get matchDuration(): Date {
        const startDate = this.match.state$.value.startDate ?? new Date();
        const endDate = this.match.state$.value.endDate ?? new Date();
        return new Date(endDate.getTime() - startDate.getTime());
    }

    public get matchBRRingNumber(): number {
        return this.matchRing.currentBRRing$.value?.ringNumber ?? 0;
    }

    private autoUltimateTime = 10000;
    private ultimatePercentOverride?: number = undefined;
    private autoUltimateSubscription?: Subscription;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly exposedOverwolfData: ExposedOverwolfGameDataService,
        public readonly game: GameService,
        public readonly gameProcess: GameProcessService,
        public readonly match: MatchService,
        public readonly matchMap: MatchMapService,
        public readonly matchPlayer: MatchPlayerService,
        public readonly matchPlayerInventory: MatchPlayerInventoryService,
        public readonly matchPlayerLegend: MatchPlayerLegendService,
        public readonly matchPlayerLocation: MatchPlayerLocationService,
        public readonly matchPlayerStats: MatchPlayerStatsService,
        public readonly matchRing: MatchRingService,
        public readonly matchRoster: MatchRosterService,
        public readonly overwolfFeatureStatusService: OverwolfFeatureStatusService,
        public readonly playerName: PlayerNameService,
        public readonly playerOriginId: PlayerOriginIdService
    ) {}

    public ngOnInit(): void {
        // Refresh UI Timer
        interval(5000)
            .pipe()
            .subscribe(() => this.cdr.detectChanges());
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onAutoUltimateChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (!target) return;
        this.autoUltimate = target.checked;

        this.autoUltimateSubscription?.unsubscribe();
        if (this.autoUltimate) {
            this.autoUltimateSubscription = timer(0, this.autoUltimateTime)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    this.incrementUltimatePercent();
                });
        }
    }

    public onChangeGameProcessIsRunningClick(): void {
        this.gameProcess.isRunning$.next(!this.gameProcess.isRunning$.value);
    }

    public onChangeGameProcessIsInFocusClick(): void {
        this.gameProcess.isInFocus$.next(!this.gameProcess.isInFocus$.value);
    }

    public onChangeMatchStateClick(): void {
        const state = this.match.state$.value;
        if (state.state === MatchState.Active) {
            this.match.endedEvent$.next({
                startDate: state.startDate,
                endDate: new Date(),
                state: MatchState.Inactive,
                matchId: this.match.state$.value.matchId,
            });
        } else {
            this.match.startedEvent$.next({ startDate: new Date(), state: MatchState.Active, matchId: uuid() });
        }
    }

    public onChangeGamePhaseClick(): void {
        const phase = this.game.phase$.value;
        const newPhase =
            phase === GamePhase.Lobby
                ? GamePhase.LoadingScreen
                : phase === GamePhase.LoadingScreen
                ? GamePhase.LegendSelection
                : phase === GamePhase.LegendSelection
                ? GamePhase.InGame
                : phase === GamePhase.InGame
                ? GamePhase.MatchSummary
                : GamePhase.Lobby;
        this.game.phase$.next(newPhase);
    }

    public onChangeBRRingClick(): void {
        const ringNumber = this.matchBRRingNumber;
        const newRingNumber = ringNumber < 6 ? ringNumber + 1 : 0;
        const newBRRing = this.matchRing.allBRRings$.value.find((ring) => ring.ringNumber === newRingNumber);
        this.matchRing.currentBRRing$.next(newBRRing);
    }

    public onChangeOverwolfGEPClick(): void {
        const featureStates = { ...this.overwolfFeatureStatusService.featureStates$.value } as FeatureStates;
        const keys = Object.keys(featureStates) as (keyof FeatureStates)[];

        let newValue = FeatureState.Unavailable;
        if (keys.some((key) => featureStates[key] === FeatureState.Unsupported)) {
            newValue = FeatureState.Good;
        } else if (keys.some((key) => featureStates[key] === FeatureState.Good)) {
            newValue = FeatureState.Partial;
        } else if (keys.some((key) => featureStates[key] === FeatureState.Partial)) {
            newValue = FeatureState.Unavailable;
        } else if (keys.some((key) => featureStates[key] === FeatureState.Unavailable)) {
            newValue = FeatureState.Unsupported;
        }
        keys.forEach((key) => (featureStates[key] = newValue));
        this.overwolfFeatureStatusService.featureStates$.next(featureStates);
    }

    public onChangeLocationPhaseClick(): void {
        const phase = this.matchPlayerLocation.myLocationPhase$.value;
        const newPhase = !phase
            ? MatchLocationPhase.Aircraft
            : phase === MatchLocationPhase.Aircraft
            ? MatchLocationPhase.Freefly
            : phase === MatchLocationPhase.Freefly
            ? MatchLocationPhase.Landed
            : undefined;
        this.matchPlayerLocation.myLocationPhase$.next(newPhase);
    }

    public onChangePlayerStateClick(): void {
        const state = this.matchPlayer.myState$.value;
        const newState =
            state === PlayerState.Disconnected
                ? PlayerState.Alive
                : state === PlayerState.Alive
                ? PlayerState.Knocked
                : state === PlayerState.Knocked
                ? PlayerState.Eliminated
                : PlayerState.Disconnected;

        this.matchPlayer.myState$.next(newState);
    }

    public onChangePlayerUltimatePercentClick(): void {
        this.incrementUltimatePercent();
    }

    public lastFeatureStatesToArray(): FeatureStates {
        return this.overwolfFeatureStatusService.featureStates$.value;
    }

    public reloadOWGEPStatus(): void {
        this.overwolfFeatureStatusService
            .getFeatureStates$()
            .pipe(takeUntil(this.destroy$))
            .subscribe((states) => console.debug(`Refreshed OW GEP Status`, states));
    }

    private incrementUltimatePercent(): void {
        if (this.ultimatePercentOverride == null) {
            this.ultimatePercentOverride = 0;
        } else if (this.ultimatePercentOverride >= 100) {
            this.ultimatePercentOverride = undefined;
        } else {
            this.ultimatePercentOverride += 5;
        }

        this.exposedOverwolfData.injectOnInfoUpdates2({
            info: { me: { ultimate_cooldown: { ultimate_cooldown: this.ultimatePercentOverride } } },
            feature: "me",
        });
    }
}

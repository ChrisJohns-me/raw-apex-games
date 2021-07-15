import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FeatureState, FeatureStatusList } from "@shared-app/feature-status";
import { GamePhase } from "@shared-app/game-phase";
import { MatchState } from "@shared-app/match/state";
import { PlayerState } from "@shared-app/player-state";
import { GameProcessService } from "@shared-app/services/game-process.service";
import { ExposedOverwolfGameDataService } from "@shared-app/services/overwolf-exposed-data.service";
import { OverwolfFeatureStatusService } from "@shared-app/services/overwolf/overwolf-feature-status.service";
import { GameService } from "@siren-app/app/modules/core/game.service";
import { MatchPlayerService } from "@siren-app/app/modules/core/match/match-player.service";
import { MatchRosterService } from "@siren-app/app/modules/core/match/match-roster.service";
import { MatchService } from "@siren-app/app/modules/core/match/match.service";
import { PlayerService } from "@siren-app/app/modules/core/player.service";
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
        return this.overwolfFeatureStatusService.checkAllFeatureStatus();
    }

    public get matchDuration(): Date {
        const startDate = this.match.state$.value.startDate ?? new Date();
        const endDate = this.match.state$.value.endDate ?? new Date();
        return new Date(endDate.getTime() - startDate.getTime());
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
        public readonly matchPlayer: MatchPlayerService,
        public readonly matchRoster: MatchRosterService,
        public readonly overwolfFeatureStatusService: OverwolfFeatureStatusService,
        public readonly player: PlayerService
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
                ? GamePhase.LegendSelection
                : phase === GamePhase.LegendSelection
                ? GamePhase.PreGame
                : phase === GamePhase.PreGame
                ? GamePhase.InGame
                : GamePhase.Lobby;
        this.game.phase$.next(newPhase);
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

    public lastFeatureStatusListToArray(): FeatureStatusList {
        return this.overwolfFeatureStatusService.featureStatusList$.value;
    }

    public reloadOWGEPStatus(): void {
        this.overwolfFeatureStatusService
            .getFeatureStatusList$()
            .pipe(takeUntil(this.destroy$))
            .subscribe((statusList) => console.debug(`Refreshed OW GEP Status`, statusList));
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

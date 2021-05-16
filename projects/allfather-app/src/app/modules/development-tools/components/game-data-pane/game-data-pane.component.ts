import { GamePhase } from "@allfather-app/app/common/game-phase";
import { MatchLocationPhase } from "@allfather-app/app/common/match/location";
import { MatchState } from "@allfather-app/app/common/match/state";
import { PlayerState } from "@allfather-app/app/common/player-state";
import { GameProcessService } from "@allfather-app/app/modules/core/game-process.service";
import { GameService } from "@allfather-app/app/modules/core/game.service";
import { MatchMapService } from "@allfather-app/app/modules/core/match/match-map.service";
import { MatchPlayerInventoryService } from "@allfather-app/app/modules/core/match/match-player-inventory.service";
import { MatchPlayerLegendService } from "@allfather-app/app/modules/core/match/match-player-legend.service";
import { MatchPlayerLocationService } from "@allfather-app/app/modules/core/match/match-player-location.service";
import { MatchPlayerStatsService } from "@allfather-app/app/modules/core/match/match-player-stats.service";
import { MatchPlayerService } from "@allfather-app/app/modules/core/match/match-player.service";
import { MatchRosterService } from "@allfather-app/app/modules/core/match/match-roster.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { ExposedOverwolfGameDataService } from "@allfather-app/app/modules/core/overwolf-exposed-data.service";
import { OverwolfFeatureState } from "@allfather-app/app/modules/core/overwolf/dto/overwolf-feature-status-dto";
import { FeatureStatusList, OverwolfFeatureStatusService } from "@allfather-app/app/modules/core/overwolf/overwolf-feature-status.service";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { interval } from "rxjs";
import { v4 as uuid } from "uuid";

@Component({
    selector: "app-game-data-pane",
    templateUrl: "./game-data-pane.component.html",
    styleUrls: ["./game-data-pane.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameDataPaneComponent implements OnInit {
    public Infinity = Infinity;
    public changedHighlightColor = "#ffc9c9";

    public get featureStatus(): OverwolfFeatureState {
        return this.overwolfFeatureStatusService.checkAllFeatureStatus();
    }

    public get matchDuration(): Date {
        const startDate = this.match.state$.value.startDate ?? new Date();
        const endDate = this.match.state$.value.endDate ?? new Date();
        return new Date(endDate.getTime() - startDate.getTime());
    }

    private ultimatePercentOverride?: number = undefined;

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

    public onChangeLocationPhaseClick(): void {
        const phase = this.matchPlayerLocation.myLocationPhase$.value;
        const newPhase = !phase
            ? MatchLocationPhase.Dropship
            : phase === MatchLocationPhase.Dropship
            ? MatchLocationPhase.Dropping
            : phase === MatchLocationPhase.Dropping
            ? MatchLocationPhase.HasLanded
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

    public lastFeatureStatusListToArray(): FeatureStatusList {
        return this.overwolfFeatureStatusService.featureStatusList$.value;
    }
}

import { Component } from "@angular/core";
import { GamePhase } from "@common/game-phase";
import { MatchLocationPhase } from "@common/match/match-location";
import { MatchState } from "@common/match/match-state";
import { PlayerState } from "@common/player-state";
import { GameProcessService } from "@core/game-process.service";
import { GameService } from "@core/game.service";
import { MatchMapService } from "@core/match/match-map.service";
import { MatchPlayerInventoryService } from "@core/match/match-player-inventory.service";
import { MatchPlayerLegendService } from "@core/match/match-player-legend.service";
import { MatchPlayerLocationService } from "@core/match/match-player-location.service";
import { MatchPlayerStatsService } from "@core/match/match-player-stats.service";
import { MatchPlayerService } from "@core/match/match-player.service";
import { MatchRosterService } from "@core/match/match-roster.service";
import { MatchService } from "@core/match/match.service";
import { PlayerService } from "@core/player.service";

@Component({
    selector: "app-game-data-pane",
    templateUrl: "./game-data-pane.component.html",
    styleUrls: ["./game-data-pane.component.scss"],
})
export class GameDataPaneComponent {
    public Infinity = Infinity;
    public changedHighlightColor = "#ffc9c9";

    public get matchDuration(): Date {
        const startDate = this.match.state$.value.startDate ?? new Date();
        const endDate = this.match.state$.value.endDate ?? new Date();
        return new Date(endDate.getTime() - startDate.getTime());
    }

    constructor(
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
        public readonly player: PlayerService
    ) {}

    public onChangeGameProcessIsRunningClick(): void {
        this.gameProcess.isRunning$.next(!this.gameProcess.isRunning$.value);
    }

    public onChangeGameProcessIsInFocusClick(): void {
        this.gameProcess.isInFocus$.next(!this.gameProcess.isInFocus$.value);
    }

    public onChangeMatchStateClick(): void {
        const state = this.match.state$.value;
        if (state.state === MatchState.Active) {
            this.match.state$.next({ startDate: state.startDate, endDate: new Date(), state: MatchState.Inactive });
        } else {
            this.match.state$.next({ startDate: new Date(), state: MatchState.Active });
        }
    }

    public onChangeGamePhaseClick(): void {
        const phase = this.game.phase$.value;
        const newPhase =
            phase === GamePhase.Lobby
                ? GamePhase.LegendSelection
                : phase === GamePhase.LegendSelection
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
        const newState = !state
            ? PlayerState.Alive
            : state === PlayerState.Alive
            ? PlayerState.Knocked
            : state === PlayerState.Knocked
            ? PlayerState.Eliminated
            : undefined;

        this.matchPlayer.myState$.next(newState);
    }
}

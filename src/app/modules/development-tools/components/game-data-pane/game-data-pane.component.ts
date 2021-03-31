import { Component } from "@angular/core";
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
}

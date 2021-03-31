import { ComponentFixture, TestBed } from "@angular/core/testing";
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
import { MockGameProcessService } from "src/app/mocks/mock-game-process.service";
import { MockGameService } from "src/app/mocks/mock-game.service";
import { MockMatchMapService } from "src/app/mocks/mock-match-map.service";
import { MockMatchPlayerInventoryService } from "src/app/mocks/mock-match-player-inventory.service";
import { MockMatchPlayerLegendService } from "src/app/mocks/mock-match-player-legend.service";
import { MockMatchPlayerLocationService } from "src/app/mocks/mock-match-player-location.service";
import { MockMatchPlayerStatsService } from "src/app/mocks/mock-match-player-stats.service";
import { MockMatchPlayerService } from "src/app/mocks/mock-match-player.service";
import { MockMatchRosterService } from "src/app/mocks/mock-match-roster.service";
import { MockMatchService } from "src/app/mocks/mock-match.service";
import { MockPlayerService } from "src/app/mocks/mock-player.service";
import { GameDataPaneComponent } from "./game-data-pane.component";

describe("GameDataPaneComponent", () => {
    let component: GameDataPaneComponent;
    let fixture: ComponentFixture<GameDataPaneComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameDataPaneComponent],
            providers: [
                { provide: GameService, useClass: MockGameService },
                { provide: GameProcessService, useClass: MockGameProcessService },
                { provide: MatchService, useClass: MockMatchService },
                { provide: MatchMapService, useClass: MockMatchMapService },
                { provide: MatchPlayerService, useClass: MockMatchPlayerService },
                { provide: MatchPlayerInventoryService, useClass: MockMatchPlayerInventoryService },
                { provide: MatchPlayerLegendService, useClass: MockMatchPlayerLegendService },
                { provide: MatchPlayerLocationService, useClass: MockMatchPlayerLocationService },
                { provide: MatchPlayerStatsService, useClass: MockMatchPlayerStatsService },
                { provide: MatchRosterService, useClass: MockMatchRosterService },
                { provide: PlayerService, useClass: MockPlayerService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameDataPaneComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

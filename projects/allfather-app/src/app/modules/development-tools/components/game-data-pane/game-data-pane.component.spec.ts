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
import { MockGameProcessService } from "@allfather-app/app/modules/core/mocks/services/mock-game-process.service";
import { MockGameService } from "@allfather-app/app/modules/core/mocks/services/mock-game.service";
import { MockMatchMapService } from "@allfather-app/app/modules/core/mocks/services/mock-match-map.service";
import { MockMatchPlayerInventoryService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player-inventory.service";
import { MockMatchPlayerLegendService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player-legend.service";
import { MockMatchPlayerLocationService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player-location.service";
import { MockMatchPlayerStatsService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player-stats.service";
import { MockMatchPlayerService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player.service";
import { MockMatchRosterService } from "@allfather-app/app/modules/core/mocks/services/mock-match-roster.service";
import { MockMatchService } from "@allfather-app/app/modules/core/mocks/services/mock-match.service";
import { MockOverwolfExposedDataService } from "@allfather-app/app/modules/core/mocks/services/mock-overwolf-exposed-data.service";
import { MockPlayerService } from "@allfather-app/app/modules/core/mocks/services/mock-player.service";
import { OverwolfExposedDataService } from "@allfather-app/app/modules/core/overwolf-exposed-data.service";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GameDataPaneComponent } from "./game-data-pane.component";

describe("GameDataPaneComponent", () => {
    let component: GameDataPaneComponent;
    let fixture: ComponentFixture<GameDataPaneComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameDataPaneComponent],
            providers: [
                { provide: GameService, useClass: MockGameService },
                { provide: OverwolfExposedDataService, useClass: MockOverwolfExposedDataService },
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

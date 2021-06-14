import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { GameProcessService } from "@allfather-app/app/modules/core/game-process.service";
import { LocalDatabaseService } from "@allfather-app/app/modules/core/local-database/local-database.service";
import { MapRotationService } from "@allfather-app/app/modules/core/map-rotation/map-rotation.service";
import { MatchMapService } from "@allfather-app/app/modules/core/match/match-map.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MockConfigurationService } from "@allfather-app/app/modules/core/mocks/services/mock-configuration.service";
import { MockGameProcessService } from "@allfather-app/app/modules/core/mocks/services/mock-game-process.service";
import { MockLocalDatabaseService } from "@allfather-app/app/modules/core/mocks/services/mock-local-database.service";
import { MockMapRotationService } from "@allfather-app/app/modules/core/mocks/services/mock-map-rotation.service";
import { MockMatchMapService } from "@allfather-app/app/modules/core/mocks/services/mock-match-map.service";
import { MockMatchService } from "@allfather-app/app/modules/core/mocks/services/mock-match.service";
import { MockPlayerAccountStatsService } from "@allfather-app/app/modules/core/mocks/services/mock-player-account-stats.service";
import { MockPlayerStatsService } from "@allfather-app/app/modules/core/mocks/services/mock-player-stats.service";
import { MockPlayerService } from "@allfather-app/app/modules/core/mocks/services/mock-player.service";
import { PlayerAccountStatsService } from "@allfather-app/app/modules/core/player-account-stats/player-account-stats.service";
import { PlayerLocalStatsService } from "@allfather-app/app/modules/core/player-local-stats.service";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AccountStatsDisplayComponent } from "./components/account-stats-display.component";
import { LegendIconsBoardComponent } from "./components/legend-icons-board.component";
import { MapRotationDisplayComponent } from "./components/map-rotation-display.component";
import { DashboardPageComponent } from "./dashboard-page.component";

describe("DashboardPageComponent", () => {
    let component: DashboardPageComponent;
    let fixture: ComponentFixture<DashboardPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardPageComponent, LegendIconsBoardComponent, MapRotationDisplayComponent, AccountStatsDisplayComponent],
            providers: [
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: LocalDatabaseService, useClass: MockLocalDatabaseService },
                { provide: PlayerService, useClass: MockPlayerService },
                { provide: PlayerLocalStatsService, useClass: MockPlayerStatsService },
                { provide: MatchMapService, useClass: MockMatchMapService },
                { provide: MapRotationService, useClass: MockMapRotationService },
                { provide: GameProcessService, useClass: MockGameProcessService },
                { provide: MatchService, useClass: MockMatchService },
                { provide: PlayerAccountStatsService, useClass: MockPlayerAccountStatsService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

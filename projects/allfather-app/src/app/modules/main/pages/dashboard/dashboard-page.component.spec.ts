import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { LocalDatabaseService } from "@allfather-app/app/modules/core/local-database/local-database.service";
import { MapRotationService } from "@allfather-app/app/modules/core/map-rotation/map-rotation.service";
import { MatchMapService } from "@allfather-app/app/modules/core/match/match-map.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MockConfigurationService } from "@allfather-app/app/modules/core/mocks/mock-configuration.service";
import { MockLocalDatabaseService } from "@allfather-app/app/modules/core/mocks/mock-local-database.service";
import { MockMatchMapService } from "@allfather-app/app/modules/core/mocks/mock-match-map.service";
import { MockMatchService } from "@allfather-app/app/modules/core/mocks/mock-match.service";
import { PlayerLocalStatsService } from "@allfather-app/app/modules/core/player-local-stats.service";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockGameProcessService } from "@shared-app/mocks/services/mock-game-process.service";
import { MockGoogleAnalyticsService } from "@shared-app/mocks/services/mock-google-analytics.service";
import { MockMapRotationService } from "@shared-app/mocks/services/mock-map-rotation.service";
import { MockPlayerAccountStatsService } from "@shared-app/mocks/services/mock-player-account-stats.service";
import { MockPlayerStatsService } from "@shared-app/mocks/services/mock-player-stats.service";
import { MockPlayerService } from "@shared-app/mocks/services/mock-player.service";
import { GameProcessService } from "@shared-app/services/game-process.service";
import { GoogleAnalyticsService } from "@shared-app/services/google-analytics.service";
import { PlayerAccountStatsService } from "@shared-app/services/player-account-stats/player-account-stats.service";
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
                { provide: GameProcessService, useClass: MockGameProcessService },
                { provide: GoogleAnalyticsService, useClass: MockGoogleAnalyticsService },
                { provide: LocalDatabaseService, useClass: MockLocalDatabaseService },
                { provide: MapRotationService, useClass: MockMapRotationService },
                { provide: MatchMapService, useClass: MockMatchMapService },
                { provide: MatchService, useClass: MockMatchService },
                { provide: PlayerAccountStatsService, useClass: MockPlayerAccountStatsService },
                { provide: PlayerLocalStatsService, useClass: MockPlayerStatsService },
                { provide: PlayerService, useClass: MockPlayerService },
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

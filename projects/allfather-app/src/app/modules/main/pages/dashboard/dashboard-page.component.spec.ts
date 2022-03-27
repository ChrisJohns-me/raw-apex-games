import { GameProcessService } from "@allfather-app/app/common/services/game-process.service";
import { GoogleAnalyticsService } from "@allfather-app/app/common/services/google-analytics.service";
import { OverwolfGameDataService } from "@allfather-app/app/common/services/overwolf";
import { OverwolfProfileService } from "@allfather-app/app/common/services/overwolf/overwolf-profile.service";
import { PlayerAccountStatsService } from "@allfather-app/app/common/services/player-account-stats/player-account-stats.service";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { LocalDatabaseService } from "@allfather-app/app/modules/core/local-database/local-database.service";
import { MapRotationService } from "@allfather-app/app/modules/core/map-rotation/map-rotation.service";
import { MatchMapService } from "@allfather-app/app/modules/core/match/match-map.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MockConfigurationService } from "@allfather-app/app/modules/core/mocks/services/mock-configuration.service";
import { MockGameProcessService } from "@allfather-app/app/modules/core/mocks/services/mock-game-process.service";
import { MockGoogleAnalyticsService } from "@allfather-app/app/modules/core/mocks/services/mock-google-analytics.service";
import { MockLocalDatabaseService } from "@allfather-app/app/modules/core/mocks/services/mock-local-database.service";
import { MockMapRotationService } from "@allfather-app/app/modules/core/mocks/services/mock-map-rotation.service";
import { MockMatchMapService } from "@allfather-app/app/modules/core/mocks/services/mock-match-map.service";
import { MockMatchService } from "@allfather-app/app/modules/core/mocks/services/mock-match.service";
import { MockOverwolfGameDataService } from "@allfather-app/app/modules/core/mocks/services/mock-overwolf-game-data.service";
import { MockOverwolfProfileService } from "@allfather-app/app/modules/core/mocks/services/mock-overwolf-profile.service";
import { MockPlayerAccountStatsService } from "@allfather-app/app/modules/core/mocks/services/mock-player-account-stats.service";
import { MockPlayerStatsService } from "@allfather-app/app/modules/core/mocks/services/mock-player-stats.service";
import { MockPlayerService } from "@allfather-app/app/modules/core/mocks/services/mock-player.service";
import { PlayerLocalStatsService } from "@allfather-app/app/modules/core/player-local-stats.service";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AccountStatsDisplayComponent } from "./components/account-stats-display.component";
import { ComplimentaryLegendsComponent } from "./components/complimentary-legends.component";
import { LegendIconsBoardComponent } from "./components/legend-icons-board.component";
import { MapRotationDisplayComponent } from "./components/map-rotation-display.component";
import { DashboardPageComponent } from "./dashboard-page.component";

describe("DashboardPageComponent", () => {
    let component: DashboardPageComponent;
    let fixture: ComponentFixture<DashboardPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                AccountStatsDisplayComponent,
                ComplimentaryLegendsComponent,
                DashboardPageComponent,
                LegendIconsBoardComponent,
                MapRotationDisplayComponent,
            ],
            providers: [
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: GameProcessService, useClass: MockGameProcessService },
                { provide: GoogleAnalyticsService, useClass: MockGoogleAnalyticsService },
                { provide: LocalDatabaseService, useClass: MockLocalDatabaseService },
                { provide: MapRotationService, useClass: MockMapRotationService },
                { provide: MatchMapService, useClass: MockMatchMapService },
                { provide: MatchService, useClass: MockMatchService },
                { provide: OverwolfGameDataService, useClass: MockOverwolfGameDataService },
                { provide: OverwolfProfileService, useClass: MockOverwolfProfileService },
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

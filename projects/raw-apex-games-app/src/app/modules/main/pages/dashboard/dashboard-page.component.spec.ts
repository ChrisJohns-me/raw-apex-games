import { ComponentFixture, TestBed } from "@angular/core/testing";
import { supressConsoleLog } from "@raw-apex-games-app/app/common/testing-helpers";
import { ConfigurationService } from "@raw-apex-games-app/app/modules/core/configuration.service";
import { GameProcessService } from "@raw-apex-games-app/app/modules/core/game-process.service";
import { GoogleAnalyticsService } from "@raw-apex-games-app/app/modules/core/google-analytics.service";
import { LocalDatabaseService } from "@raw-apex-games-app/app/modules/core/local-database/local-database.service";
import { MapRotationService } from "@raw-apex-games-app/app/modules/core/map-rotation/map-rotation.service";
import { MatchMapService } from "@raw-apex-games-app/app/modules/core/match/match-map.service";
import { MatchRosterService } from "@raw-apex-games-app/app/modules/core/match/match-roster.service";
import { MatchService } from "@raw-apex-games-app/app/modules/core/match/match.service";
import { MockConfigurationService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-configuration.service";
import { MockGameProcessService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-game-process.service";
import { MockGoogleAnalyticsService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-google-analytics.service";
import { MockLocalDatabaseService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-local-database.service";
import { MockMapRotationService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-map-rotation.service";
import { MockMatchMapService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match-map.service";
import { MockMatchRosterService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match-roster.service";
import { MockMatchService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match.service";
import { MockMyPlayerAccountStatsService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-my-player-account-stats.service";
import { MockOverwolfGameDataService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-overwolf-game-data.service";
import { MockOverwolfProfileService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-overwolf-profile.service";
import { MockPlayerAccountStatsService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-player-account-stats.service";
import { MockPlayerLocalStatsService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-player-local-stats.service";
import { MockPlayerService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-player.service";
import { MockReportingService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-reporting.service";
import { OverwolfGameDataService } from "@raw-apex-games-app/app/modules/core/overwolf";
import { OverwolfProfileService } from "@raw-apex-games-app/app/modules/core/overwolf/overwolf-profile.service";
import { MyPlayerAccountStatsService } from "@raw-apex-games-app/app/modules/core/player-account-stats/my-player-account-stats.service";
import { PlayerAccountStatsService } from "@raw-apex-games-app/app/modules/core/player-account-stats/player-account-stats.service";
import { PlayerLocalStatsService } from "@raw-apex-games-app/app/modules/core/player-local-stats.service";
import { PlayerService } from "@raw-apex-games-app/app/modules/core/player.service";
import { ReportingService } from "@raw-apex-games-app/app/modules/core/reporting/reporting.service";
import { ComplimentaryWeaponsComponent } from "@raw-apex-games-app/app/shared/components/complimentary-weapons/complimentary-weapons.component";
import { WelcomeContentComponent } from "@raw-apex-games-app/app/shared/components/welcome-content/welcome-content.component";
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
                ComplimentaryWeaponsComponent,
                DashboardPageComponent,
                LegendIconsBoardComponent,
                MapRotationDisplayComponent,
                WelcomeContentComponent,
            ],
            providers: [
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: GameProcessService, useClass: MockGameProcessService },
                { provide: GoogleAnalyticsService, useClass: MockGoogleAnalyticsService },
                { provide: LocalDatabaseService, useClass: MockLocalDatabaseService },
                { provide: MapRotationService, useClass: MockMapRotationService },
                { provide: MatchMapService, useClass: MockMatchMapService },
                { provide: MatchRosterService, useClass: MockMatchRosterService },
                { provide: MatchService, useClass: MockMatchService },
                { provide: OverwolfGameDataService, useClass: MockOverwolfGameDataService },
                { provide: OverwolfProfileService, useClass: MockOverwolfProfileService },
                { provide: PlayerAccountStatsService, useClass: MockPlayerAccountStatsService },
                { provide: PlayerLocalStatsService, useClass: MockPlayerLocalStatsService },
                { provide: PlayerService, useClass: MockPlayerService },
                { provide: ReportingService, useClass: MockReportingService },
                { provide: MyPlayerAccountStatsService, useClass: MockMyPlayerAccountStatsService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        supressConsoleLog();
        fixture = TestBed.createComponent(DashboardPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { supressConsoleLog } from "@app/app/common/testing-helpers";
import { ConfigurationService } from "@app/app/modules/core/configuration.service";
import { GameProcessService } from "@app/app/modules/core/game-process.service";
import { GoogleAnalyticsService } from "@app/app/modules/core/google-analytics.service";
import { LocalDatabaseService } from "@app/app/modules/core/local-database/local-database.service";
import { MatchMapService } from "@app/app/modules/core/match/match-map.service";
import { MatchRosterService } from "@app/app/modules/core/match/match-roster.service";
import { MatchService } from "@app/app/modules/core/match/match.service";
import { MockConfigurationService } from "@app/app/modules/core/mocks/services/mock-configuration.service";
import { MockGameProcessService } from "@app/app/modules/core/mocks/services/mock-game-process.service";
import { MockGoogleAnalyticsService } from "@app/app/modules/core/mocks/services/mock-google-analytics.service";
import { MockLocalDatabaseService } from "@app/app/modules/core/mocks/services/mock-local-database.service";
import { MockMatchMapService } from "@app/app/modules/core/mocks/services/mock-match-map.service";
import { MockMatchRosterService } from "@app/app/modules/core/mocks/services/mock-match-roster.service";
import { MockMatchService } from "@app/app/modules/core/mocks/services/mock-match.service";
import { MockOverwolfGameDataService } from "@app/app/modules/core/mocks/services/mock-overwolf-game-data.service";
import { MockOverwolfProfileService } from "@app/app/modules/core/mocks/services/mock-overwolf-profile.service";
import { MockPlayerLocalStatsService } from "@app/app/modules/core/mocks/services/mock-player-local-stats.service";
import { MockPlayerService } from "@app/app/modules/core/mocks/services/mock-player.service";
import { MockReportingService } from "@app/app/modules/core/mocks/services/mock-reporting.service";
import { OverwolfGameDataService } from "@app/app/modules/core/overwolf";
import { OverwolfProfileService } from "@app/app/modules/core/overwolf/overwolf-profile.service";
import { PlayerLocalStatsService } from "@app/app/modules/core/player-local-stats.service";
import { PlayerService } from "@app/app/modules/core/player.service";
import { ReportingService } from "@app/app/modules/core/reporting/reporting.service";
import { WelcomeContentComponent } from "@app/app/shared/components/welcome-content/welcome-content.component";
import { AccountStatsDisplayComponent } from "./components/account-stats-display.component";
import { LegendIconsBoardComponent } from "./components/legend-icons-board.component";
import { DashboardPageComponent } from "./dashboard-page.component";

describe("DashboardPageComponent", () => {
    let component: DashboardPageComponent;
    let fixture: ComponentFixture<DashboardPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AccountStatsDisplayComponent, DashboardPageComponent, LegendIconsBoardComponent, WelcomeContentComponent],
            providers: [
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: GameProcessService, useClass: MockGameProcessService },
                { provide: GoogleAnalyticsService, useClass: MockGoogleAnalyticsService },
                { provide: LocalDatabaseService, useClass: MockLocalDatabaseService },
                { provide: MatchMapService, useClass: MockMatchMapService },
                { provide: MatchRosterService, useClass: MockMatchRosterService },
                { provide: MatchService, useClass: MockMatchService },
                { provide: OverwolfGameDataService, useClass: MockOverwolfGameDataService },
                { provide: OverwolfProfileService, useClass: MockOverwolfProfileService },
                { provide: PlayerLocalStatsService, useClass: MockPlayerLocalStatsService },
                { provide: PlayerService, useClass: MockPlayerService },
                { provide: ReportingService, useClass: MockReportingService },
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

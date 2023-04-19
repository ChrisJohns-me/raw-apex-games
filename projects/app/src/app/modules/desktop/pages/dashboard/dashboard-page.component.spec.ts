import { ComponentFixture, TestBed } from "@angular/core/testing";
import { supressConsoleLog } from "../../../../common/testing-helpers";
import { WelcomeContentComponent } from "../../../../shared/components/welcome-content/welcome-content.component";
import { ConfigurationService } from "../../../core/configuration.service";
import { GameProcessService } from "../../../core/game-process.service";
import { GoogleAnalyticsService } from "../../../core/google-analytics.service";
import { LocalDatabaseService } from "../../../core/local-database/local-database.service";
import { MatchMapService } from "../../../core/match/match-map.service";
import { MatchRosterService } from "../../../core/match/match-roster.service";
import { MatchService } from "../../../core/match/match.service";
import { MockConfigurationService } from "../../../core/mocks/services/mock-configuration.service";
import { MockGameProcessService } from "../../../core/mocks/services/mock-game-process.service";
import { MockGoogleAnalyticsService } from "../../../core/mocks/services/mock-google-analytics.service";
import { MockLocalDatabaseService } from "../../../core/mocks/services/mock-local-database.service";
import { MockMatchMapService } from "../../../core/mocks/services/mock-match-map.service";
import { MockMatchRosterService } from "../../../core/mocks/services/mock-match-roster.service";
import { MockMatchService } from "../../../core/mocks/services/mock-match.service";
import { MockOverwolfGameDataService } from "../../../core/mocks/services/mock-overwolf-game-data.service";
import { MockOverwolfProfileService } from "../../../core/mocks/services/mock-overwolf-profile.service";
import { MockPlayerLocalStatsService } from "../../../core/mocks/services/mock-player-local-stats.service";
import { MockPlayerService } from "../../../core/mocks/services/mock-player.service";
import { MockReportingService } from "../../../core/mocks/services/mock-reporting.service";
import { OverwolfGameDataService } from "../../../core/overwolf";
import { OverwolfProfileService } from "../../../core/overwolf/overwolf-profile.service";
import { PlayerLocalStatsService } from "../../../core/player-local-stats.service";
import { PlayerService } from "../../../core/player.service";
import { ReportingService } from "../../../core/reporting/reporting.service";
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

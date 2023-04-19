import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { IconComponent } from "../../../../../../shared/components/icon/icon.component";
import { supressConsoleLog } from "../../../common/testing-helpers";
import { GameEventsStatusIndicatorComponent } from "../../../shared/components/game-events-status-indicator/game-events-status-indicator.component";
import { BackgroundService } from "../../background/background.service";
import { HotkeyService } from "../../background/hotkey.service";
import { ConfigurationService } from "../../core/configuration.service";
import { FileService } from "../../core/file.service";
import { GameProcessService } from "../../core/game-process.service";
import { GoogleAnalyticsService } from "../../core/google-analytics.service";
import { LocalDatabaseService } from "../../core/local-database/local-database.service";
import { LocalStorageService } from "../../core/local-storage/local-storage.service";
import { MatchRosterService } from "../../core/match/match-roster.service";
import { MatchService } from "../../core/match/match.service";
import { MockUIContainerComponent } from "../../core/mocks/components/mock-ui-container.component";
import { MockFullHeightDirective } from "../../core/mocks/directives/mock-full-height.directive";
import { MockBackgroundService } from "../../core/mocks/services/mock-background.service";
import { MockConfigurationService } from "../../core/mocks/services/mock-configuration.service";
import { MockDesktopWindowService } from "../../core/mocks/services/mock-desktop-window.service";
import { MockFileService } from "../../core/mocks/services/mock-file.service";
import { MockGameProcessService } from "../../core/mocks/services/mock-game-process.service";
import { MockGoogleAnalyticsService } from "../../core/mocks/services/mock-google-analytics.service";
import { MockHotkeyService } from "../../core/mocks/services/mock-hotkey.service";
import { MockLocalDatabaseService } from "../../core/mocks/services/mock-local-database.service";
import { MockLocalStorageService } from "../../core/mocks/services/mock-local-storage.service";
import { MockMatchRosterService } from "../../core/mocks/services/mock-match-roster.service";
import { MockMatchService } from "../../core/mocks/services/mock-match.service";
import { MockOverwolfFeatureStatusService } from "../../core/mocks/services/mock-overwolf-feature-status.service";
import { MockOverwolfProfileService } from "../../core/mocks/services/mock-overwolf-profile.service";
import { MockPlayerLocalStatsService } from "../../core/mocks/services/mock-player-local-stats.service";
import { MockPlayerService } from "../../core/mocks/services/mock-player.service";
import { MockReportingService } from "../../core/mocks/services/mock-reporting.service";
import { MockSettingsService } from "../../core/mocks/services/mock-settings.service";
import { MockVersionService } from "../../core/mocks/services/mock-version.service";
import { OverwolfFeatureStatusService } from "../../core/overwolf/overwolf-feature-status.service";
import { OverwolfProfileService } from "../../core/overwolf/overwolf-profile.service";
import { PlayerLocalStatsService } from "../../core/player-local-stats.service";
import { PlayerService } from "../../core/player.service";
import { ReportingService } from "../../core/reporting/reporting.service";
import { SettingsService } from "../../core/settings.service";
import { VersionService } from "../../core/version.service";
import { NavbarComponent } from "../components/navbar.component";
import { ChartingPageComponent } from "../pages/charting/charting-page.component";
import { StatsChartComponent } from "../pages/charting/components/stats-chart.component";
import { AccountStatsDisplayComponent } from "../pages/dashboard/components/account-stats-display.component";
import { LegendIconsBoardComponent } from "../pages/dashboard/components/legend-icons-board.component";
import { DashboardPageComponent } from "../pages/dashboard/dashboard-page.component";
import { MatchExplorerPageComponent } from "../pages/match-explorer/match-explorer-page.component";
import { SettingsPageComponent } from "../pages/settings/settings-page.component";
import { DesktopWindowComponent } from "./desktop-window.component";
import { DesktopWindowService } from "./desktop-window.service";

describe("MainWindowComponent", () => {
    let component: DesktopWindowComponent;
    let fixture: ComponentFixture<DesktopWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NoopAnimationsModule],
            declarations: [
                AccountStatsDisplayComponent,
                ChartingPageComponent,
                DashboardPageComponent,
                GameEventsStatusIndicatorComponent,
                IconComponent,
                LegendIconsBoardComponent,
                DesktopWindowComponent,
                MatchExplorerPageComponent,
                MockFullHeightDirective,
                MockUIContainerComponent,
                NavbarComponent,
                SettingsPageComponent,
                StatsChartComponent,
            ],
            providers: [
                { provide: BackgroundService, useClass: MockBackgroundService },
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: FileService, useClass: MockFileService },
                { provide: GameProcessService, useClass: MockGameProcessService },
                { provide: GoogleAnalyticsService, useClass: MockGoogleAnalyticsService },
                { provide: HotkeyService, useClass: MockHotkeyService },
                { provide: LocalDatabaseService, useClass: MockLocalDatabaseService },
                { provide: LocalStorageService, useClass: MockLocalStorageService },
                { provide: DesktopWindowService, useClass: MockDesktopWindowService },
                { provide: MatchRosterService, useClass: MockMatchRosterService },
                { provide: MatchService, useClass: MockMatchService },
                { provide: OverwolfFeatureStatusService, useClass: MockOverwolfFeatureStatusService },
                { provide: OverwolfProfileService, useClass: MockOverwolfProfileService },
                { provide: PlayerLocalStatsService, useClass: MockPlayerLocalStatsService },
                { provide: PlayerService, useClass: MockPlayerService },
                { provide: ReportingService, useClass: MockReportingService },
                { provide: SettingsService, useClass: MockSettingsService },
                { provide: VersionService, useClass: MockVersionService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        supressConsoleLog();
        fixture = TestBed.createComponent(DesktopWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

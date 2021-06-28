import { IconComponent } from "@allfather-app/app/shared/components/icon/icon.component";
import { FullHeightDirective } from "@allfather-app/app/shared/directives/full-height.directive";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { BackgroundService } from "../../background/background.service";
import { ConfigurationService } from "../../core/configuration.service";
import { FileService } from "../../core/file.service";
import { GameProcessService } from "../../core/game-process.service";
import { GoogleAnalyticsService } from "../../core/google-analytics.service";
import { LocalDatabaseService } from "../../core/local-database/local-database.service";
import { MapRotationService } from "../../core/map-rotation/map-rotation.service";
import { MatchMapService } from "../../core/match/match-map.service";
import { MatchService } from "../../core/match/match.service";
import { MockUIContainerComponent } from "../../core/mocks/components/mock-ui-container.component";
import { MockBackgroundService } from "../../core/mocks/services/mock-background.service";
import { MockConfigurationService } from "../../core/mocks/services/mock-configuration.service";
import { MockFileService } from "../../core/mocks/services/mock-file.service";
import { MockGameProcessService } from "../../core/mocks/services/mock-game-process.service";
import { MockGoogleAnalyticsService } from "../../core/mocks/services/mock-google-analytics.service";
import { MockLocalDatabaseService } from "../../core/mocks/services/mock-local-database.service";
import { MockMainWindowService } from "../../core/mocks/services/mock-main-window.service";
import { MockMapRotationService } from "../../core/mocks/services/mock-map-rotation.service";
import { MockMatchMapService } from "../../core/mocks/services/mock-match-map.service";
import { MockMatchService } from "../../core/mocks/services/mock-match.service";
import { MockPlayerStatsService } from "../../core/mocks/services/mock-player-stats.service";
import { MockPlayerService } from "../../core/mocks/services/mock-player.service";
import { MockSettingsService } from "../../core/mocks/services/mock-settings.service";
import { PlayerAccountStatsService } from "../../core/player-account-stats/player-account-stats.service";
import { PlayerLocalStatsService } from "../../core/player-local-stats.service";
import { PlayerService } from "../../core/player.service";
import { SettingsService } from "../../core/settings.service";
import { BrowserWindowRef, WINDOW } from "../../core/window.service";
import { NavbarComponent } from "../components/navbar.component";
import { ChartingPageComponent } from "../pages/charting/charting-page.component";
import { LineGraphComponent } from "../pages/charting/components/line-graph.component";
import { AccountStatsDisplayComponent } from "../pages/dashboard/components/account-stats-display.component";
import { LegendIconsBoardComponent } from "../pages/dashboard/components/legend-icons-board.component";
import { MapRotationDisplayComponent } from "../pages/dashboard/components/map-rotation-display.component";
import { DashboardPageComponent } from "../pages/dashboard/dashboard-page.component";
import { MatchExplorerPageComponent } from "../pages/match-explorer/match-explorer-page.component";
import { SettingsPageComponent } from "../pages/settings/settings-page.component";
import { MainWindowComponent } from "./main-window.component";
import { MainWindowService } from "./main-window.service";

describe("MainWindowComponent", () => {
    let component: MainWindowComponent;
    let fixture: ComponentFixture<MainWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, NoopAnimationsModule],
            declarations: [
                ChartingPageComponent,
                LineGraphComponent,
                DashboardPageComponent,
                IconComponent,
                LegendIconsBoardComponent,
                MainWindowComponent,
                MatchExplorerPageComponent,
                MockUIContainerComponent,
                NavbarComponent,
                SettingsPageComponent,
                MapRotationDisplayComponent,
                AccountStatsDisplayComponent,
                FullHeightDirective,
            ],
            providers: [
                { provide: BackgroundService, useClass: MockBackgroundService },
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: FileService, useClass: MockFileService },
                { provide: GameProcessService, useClass: MockGameProcessService },
                { provide: GoogleAnalyticsService, useClass: MockGoogleAnalyticsService },
                { provide: LocalDatabaseService, useClass: MockLocalDatabaseService },
                { provide: MainWindowService, useClass: MockMainWindowService },
                { provide: MapRotationService, useClass: MockMapRotationService },
                { provide: MatchMapService, useClass: MockMatchMapService },
                { provide: MatchService, useClass: MockMatchService },
                { provide: PlayerAccountStatsService, useClass: MockPlayerStatsService },
                { provide: PlayerLocalStatsService, useClass: MockPlayerStatsService },
                { provide: PlayerService, useClass: MockPlayerService },
                { provide: SettingsService, useClass: MockSettingsService },
                { provide: WINDOW, useClass: BrowserWindowRef },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MainWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

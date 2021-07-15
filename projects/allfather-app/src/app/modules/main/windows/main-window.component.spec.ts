import { MapRotationService } from "@allfather-app/app/modules/core/map-rotation/map-rotation.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MockBackgroundService } from "@allfather-app/app/modules/core/mocks/mock-background.service";
import { MockConfigurationService } from "@allfather-app/app/modules/core/mocks/mock-configuration.service";
import { MockMainWindowService } from "@allfather-app/app/modules/core/mocks/mock-main-window.service";
import { MockMatchService } from "@allfather-app/app/modules/core/mocks/mock-match.service";
import { MockSettingsService } from "@allfather-app/app/modules/core/mocks/mock-settings.service";
import { SettingsService } from "@allfather-app/app/modules/core/settings.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { FullHeightDirective } from "@shared-app/directives/full-height.directive";
import { MockUIContainerComponent } from "@shared-app/mocks/components/mock-ui-container.component";
import { MockFileService } from "@shared-app/mocks/services/mock-file.service";
import { MockGameProcessService } from "@shared-app/mocks/services/mock-game-process.service";
import { MockGoogleAnalyticsService } from "@shared-app/mocks/services/mock-google-analytics.service";
import { MockMapRotationService } from "@shared-app/mocks/services/mock-map-rotation.service";
import { MockPlayerStatsService } from "@shared-app/mocks/services/mock-player-stats.service";
import { MockPlayerService } from "@shared-app/mocks/services/mock-player.service";
import { FileService } from "@shared-app/services/file.service";
import { GameProcessService } from "@shared-app/services/game-process.service";
import { GoogleAnalyticsService } from "@shared-app/services/google-analytics.service";
import { PlayerAccountStatsService } from "@shared-app/services/player-account-stats/player-account-stats.service";
import { BrowserWindowRef, WINDOW } from "@shared-app/services/window.service";
import { IconComponent } from "@shared/components/icon/icon.component";
import { BackgroundService } from "../../background/background.service";
import { ConfigurationService } from "../../core/configuration.service";
import { LocalDatabaseService } from "../../core/local-database/local-database.service";
import { MatchMapService } from "../../core/match/match-map.service";
import { MockLocalDatabaseService } from "../../core/mocks/mock-local-database.service";
import { MockMatchMapService } from "../../core/mocks/mock-match-map.service";
import { PlayerLocalStatsService } from "../../core/player-local-stats.service";
import { PlayerService } from "../../core/player.service";
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

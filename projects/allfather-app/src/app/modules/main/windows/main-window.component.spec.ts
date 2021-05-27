import { IconComponent } from "@allfather-app/app/shared/components/icon/icon.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { BackgroundService } from "../../background/background.service";
import { ConfigurationService } from "../../core/configuration.service";
import { FileService } from "../../core/file.service";
import { LocalDatabaseService } from "../../core/local-database/local-database.service";
import { MapRotationService } from "../../core/map-rotation/map-rotation.service";
import { MatchMapService } from "../../core/match/match-map.service";
import { MockUIContainerComponent } from "../../core/mocks/components/mock-ui-container.component";
import { MockBackgroundService } from "../../core/mocks/services/mock-background.service";
import { MockConfigurationService } from "../../core/mocks/services/mock-configuration.service";
import { MockFileService } from "../../core/mocks/services/mock-file.service";
import { MockLocalDatabaseService } from "../../core/mocks/services/mock-local-database.service";
import { MockMainWindowService } from "../../core/mocks/services/mock-main-window.service";
import { MockMapRotationService } from "../../core/mocks/services/mock-map-rotation.service";
import { MockMatchMapService } from "../../core/mocks/services/mock-match-map.service";
import { MockPlayerStatsService } from "../../core/mocks/services/mock-player-stats.service";
import { MockPlayerService } from "../../core/mocks/services/mock-player.service";
import { MockSettingsService } from "../../core/mocks/services/mock-settings.service";
import { PlayerLocalStatsService } from "../../core/player-local-stats.service";
import { PlayerService } from "../../core/player.service";
import { SettingsService } from "../../core/settings.service";
import { DailyAverageGraphComponent } from "../components/charting/daily-average-graph.component";
import { LegendIconsBoardComponent } from "../components/dashboard/legend-icons-board.component";
import { MapRotationDisplayComponent } from "../components/dashboard/map-rotation-display.component";
import { NavbarComponent } from "../components/navbar.component";
import { ChartingPageComponent } from "../pages/charting-page.component";
import { DashboardPageComponent } from "../pages/dashboard-page.component";
import { MatchExplorerPageComponent } from "../pages/match-explorer-page.component";
import { SettingsPageComponent } from "../pages/settings-page.component";
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
                DailyAverageGraphComponent,
                DashboardPageComponent,
                IconComponent,
                LegendIconsBoardComponent,
                MainWindowComponent,
                MatchExplorerPageComponent,
                MockUIContainerComponent,
                NavbarComponent,
                SettingsPageComponent,
                MapRotationDisplayComponent,
            ],
            providers: [
                { provide: BackgroundService, useClass: MockBackgroundService },
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: MainWindowService, useClass: MockMainWindowService },
                { provide: LocalDatabaseService, useClass: MockLocalDatabaseService },
                { provide: PlayerService, useClass: MockPlayerService },
                { provide: FileService, useClass: MockFileService },
                { provide: SettingsService, useClass: MockSettingsService },
                { provide: MatchMapService, useClass: MockMatchMapService },
                { provide: PlayerLocalStatsService, useClass: MockPlayerStatsService },
                { provide: MapRotationService, useClass: MockMapRotationService },
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

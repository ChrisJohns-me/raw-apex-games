import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { MatchMapService } from "@allfather-app/app/modules/core/match/match-map.service";
import { MatchPlayerLegendService } from "@allfather-app/app/modules/core/match/match-player-legend.service";
import { MatchPlayerLocationService } from "@allfather-app/app/modules/core/match/match-player-location.service";
import { MatchPlayerStatsService } from "@allfather-app/app/modules/core/match/match-player-stats.service";
import { MatchRosterService } from "@allfather-app/app/modules/core/match/match-roster.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MockConfigurationService } from "@allfather-app/app/modules/core/mocks/mock-configuration.service";
import { MockMatchMapService } from "@allfather-app/app/modules/core/mocks/mock-match-map.service";
import { MockMatchPlayerLegendService } from "@allfather-app/app/modules/core/mocks/mock-match-player-legend.service";
import { MockMatchPlayerLocationService } from "@allfather-app/app/modules/core/mocks/mock-match-player-location.service";
import { MockMatchPlayerStatsService } from "@allfather-app/app/modules/core/mocks/mock-match-player-stats.service";
import { MockMatchRosterService } from "@allfather-app/app/modules/core/mocks/mock-match-roster.service";
import { MockMatchService } from "@allfather-app/app/modules/core/mocks/mock-match.service";
import { MockReportingService } from "@allfather-app/app/modules/core/mocks/mock-reporting.service";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { ReportingService } from "@allfather-app/app/modules/core/reporting/reporting.service";
import { MatchListingComponent } from "@allfather-app/app/shared/components/match-listing/match-listing.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { FullHeightDirective } from "@shared-app/directives/full-height.directive";
import { MockGoogleAnalyticsService } from "@shared-app/mocks/services/mock-google-analytics.service";
import { MockPlayerService } from "@shared-app/mocks/services/mock-player.service";
import { GoogleAnalyticsService } from "@shared-app/services/google-analytics.service";
import { BrowserWindowRef, WINDOW } from "@shared-app/services/window.service";
import { SelectedGameModesComponent } from "./components/selected-game-modes.component";
import { SelectedLegendsComponent } from "./components/selected-legends.component";
import { SelectedMapsComponent } from "./components/selected-maps.component";
import { MatchExplorerPageComponent } from "./match-explorer-page.component";

describe("MatchExplorerPageComponent", () => {
    let component: MatchExplorerPageComponent;
    let fixture: ComponentFixture<MatchExplorerPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [
                MatchExplorerPageComponent,
                MatchListingComponent,
                FullHeightDirective,
                SelectedLegendsComponent,
                SelectedMapsComponent,
                SelectedGameModesComponent,
            ],
            providers: [
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: GoogleAnalyticsService, useClass: MockGoogleAnalyticsService },
                { provide: MatchMapService, useClass: MockMatchMapService },
                { provide: MatchPlayerLegendService, useClass: MockMatchPlayerLegendService },
                { provide: MatchPlayerLocationService, useClass: MockMatchPlayerLocationService },
                { provide: MatchPlayerStatsService, useClass: MockMatchPlayerStatsService },
                { provide: MatchRosterService, useClass: MockMatchRosterService },
                { provide: MatchService, useClass: MockMatchService },
                { provide: PlayerService, useClass: MockPlayerService },
                { provide: ReportingService, useClass: MockReportingService },
                { provide: WINDOW, useClass: BrowserWindowRef },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MatchExplorerPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

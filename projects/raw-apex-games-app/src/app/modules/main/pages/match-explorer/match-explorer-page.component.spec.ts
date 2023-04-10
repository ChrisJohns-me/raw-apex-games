import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ConfigurationService } from "@raw-apex-games-app/app/modules/core/configuration.service";
import { BrowserWindowRef, WINDOW } from "@raw-apex-games-app/app/modules/core/global-window.provider";
import { GoogleAnalyticsService } from "@raw-apex-games-app/app/modules/core/google-analytics.service";
import { MatchMapService } from "@raw-apex-games-app/app/modules/core/match/match-map.service";
import { MatchPlayerLegendService } from "@raw-apex-games-app/app/modules/core/match/match-player-legend.service";
import { MatchPlayerLocationService } from "@raw-apex-games-app/app/modules/core/match/match-player-location.service";
import { MatchPlayerStatsService } from "@raw-apex-games-app/app/modules/core/match/match-player-stats.service";
import { MatchRosterService } from "@raw-apex-games-app/app/modules/core/match/match-roster.service";
import { MatchService } from "@raw-apex-games-app/app/modules/core/match/match.service";
import { MockFullHeightDirective } from "@raw-apex-games-app/app/modules/core/mocks/directives/mock-full-height.directive";
import { MockConfigurationService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-configuration.service";
import { MockGoogleAnalyticsService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-google-analytics.service";
import { MockMatchMapService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match-map.service";
import { MockMatchPlayerLegendService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match-player-legend.service";
import { MockMatchPlayerLocationService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match-player-location.service";
import { MockMatchPlayerStatsService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match-player-stats.service";
import { MockMatchRosterService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match-roster.service";
import { MockMatchService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match.service";
import { MockPlayerService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-player.service";
import { PlayerService } from "@raw-apex-games-app/app/modules/core/player.service";
import { GameModesDropdownFilterComponent } from "@raw-apex-games-app/app/shared/components/game-modes-dropdown-filter/game-modes-dropdown-filter.component";
import { LegendsDropdownFilterComponent } from "@raw-apex-games-app/app/shared/components/legends-dropdown-filter/legends-dropdown-filter.component";
import { MapsDropdownFilterComponent } from "@raw-apex-games-app/app/shared/components/maps-dropdown-filter/maps-dropdown-filter.component";
import { MatchListingComponent } from "@raw-apex-games-app/app/shared/components/match-listing/match-listing.component";
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
                MockFullHeightDirective,
                LegendsDropdownFilterComponent,
                MapsDropdownFilterComponent,
                GameModesDropdownFilterComponent,
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

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { GameModesDropdownFilterComponent } from "../../../../shared/components/game-modes-dropdown-filter/game-modes-dropdown-filter.component";
import { LegendsDropdownFilterComponent } from "../../../../shared/components/legends-dropdown-filter/legends-dropdown-filter.component";
import { MapsDropdownFilterComponent } from "../../../../shared/components/maps-dropdown-filter/maps-dropdown-filter.component";
import { MatchListingComponent } from "../../../../shared/components/match-listing/match-listing.component";
import { ConfigurationService } from "../../../core/configuration.service";
import { BrowserWindowRef, WINDOW } from "../../../core/global-window.provider";
import { GoogleAnalyticsService } from "../../../core/google-analytics.service";
import { MatchMapService } from "../../../core/match/match-map.service";
import { MatchPlayerLegendService } from "../../../core/match/match-player-legend.service";
import { MatchPlayerLocationService } from "../../../core/match/match-player-location.service";
import { MatchPlayerStatsService } from "../../../core/match/match-player-stats.service";
import { MatchRosterService } from "../../../core/match/match-roster.service";
import { MatchService } from "../../../core/match/match.service";
import { MockFullHeightDirective } from "../../../core/mocks/directives/mock-full-height.directive";
import { MockConfigurationService } from "../../../core/mocks/services/mock-configuration.service";
import { MockGoogleAnalyticsService } from "../../../core/mocks/services/mock-google-analytics.service";
import { MockMatchMapService } from "../../../core/mocks/services/mock-match-map.service";
import { MockMatchPlayerLegendService } from "../../../core/mocks/services/mock-match-player-legend.service";
import { MockMatchPlayerLocationService } from "../../../core/mocks/services/mock-match-player-location.service";
import { MockMatchPlayerStatsService } from "../../../core/mocks/services/mock-match-player-stats.service";
import { MockMatchRosterService } from "../../../core/mocks/services/mock-match-roster.service";
import { MockMatchService } from "../../../core/mocks/services/mock-match.service";
import { MockPlayerService } from "../../../core/mocks/services/mock-player.service";
import { PlayerService } from "../../../core/player.service";
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

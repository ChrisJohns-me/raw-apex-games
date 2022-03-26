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
import { FullHeightDirective } from "@shared-app/directives/full-height.directive";
import { MockPlayerService } from "@shared-app/mocks/services/mock-player.service";
import { BrowserWindowRef, WINDOW } from "@shared-app/services/window.service";
import { MapExplorerPageComponent } from "./map-explorer-page.component";

describe("MapExplorerPageComponent", () => {
    let component: MapExplorerPageComponent;
    let fixture: ComponentFixture<MapExplorerPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MapExplorerPageComponent, MatchListingComponent, FullHeightDirective],
            providers: [
                { provide: WINDOW, useClass: BrowserWindowRef },
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: MatchMapService, useClass: MockMatchMapService },
                { provide: MatchPlayerLegendService, useClass: MockMatchPlayerLegendService },
                { provide: MatchPlayerLocationService, useClass: MockMatchPlayerLocationService },
                { provide: MatchPlayerStatsService, useClass: MockMatchPlayerStatsService },
                { provide: MatchRosterService, useClass: MockMatchRosterService },
                { provide: MatchService, useClass: MockMatchService },
                { provide: PlayerService, useClass: MockPlayerService },
                { provide: ReportingService, useClass: MockReportingService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MapExplorerPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
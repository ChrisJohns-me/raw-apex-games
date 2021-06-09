import { MatchListingComponent } from "@allfather-app/app/shared/components/match-listing/match-listing.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfigurationService } from "../../core/configuration.service";
import { MatchMapService } from "../../core/match/match-map.service";
import { MatchPlayerLegendService } from "../../core/match/match-player-legend.service";
import { MatchPlayerLocationService } from "../../core/match/match-player-location.service";
import { MatchPlayerStatsService } from "../../core/match/match-player-stats.service";
import { MatchRosterService } from "../../core/match/match-roster.service";
import { MatchService } from "../../core/match/match.service";
import { MockConfigurationService } from "../../core/mocks/services/mock-configuration.service";
import { MockMatchMapService } from "../../core/mocks/services/mock-match-map.service";
import { MockMatchPlayerLegendService } from "../../core/mocks/services/mock-match-player-legend.service";
import { MockMatchPlayerLocationService } from "../../core/mocks/services/mock-match-player-location.service";
import { MockMatchPlayerStatsService } from "../../core/mocks/services/mock-match-player-stats.service";
import { MockMatchRosterService } from "../../core/mocks/services/mock-match-roster.service";
import { MockMatchService } from "../../core/mocks/services/mock-match.service";
import { MockPlayerService } from "../../core/mocks/services/mock-player.service";
import { MockReportingService } from "../../core/mocks/services/mock-reporting.service";
import { PlayerService } from "../../core/player.service";
import { ReportingService } from "../../core/reporting/reporting.service";
import { DatasheetPageComponent } from "./datasheet-page.component";

describe("DatasheetPageComponent", () => {
    let component: DatasheetPageComponent;
    let fixture: ComponentFixture<DatasheetPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasheetPageComponent, MatchListingComponent],
            providers: [
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
        fixture = TestBed.createComponent(DatasheetPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

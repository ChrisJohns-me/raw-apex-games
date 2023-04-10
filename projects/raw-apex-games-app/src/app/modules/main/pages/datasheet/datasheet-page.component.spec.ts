import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfigurationService } from "@raw-apex-games-app/app/modules/core/configuration.service";
import { MatchMapService } from "@raw-apex-games-app/app/modules/core/match/match-map.service";
import { MatchPlayerLegendService } from "@raw-apex-games-app/app/modules/core/match/match-player-legend.service";
import { MatchPlayerLocationService } from "@raw-apex-games-app/app/modules/core/match/match-player-location.service";
import { MatchPlayerStatsService } from "@raw-apex-games-app/app/modules/core/match/match-player-stats.service";
import { MatchRosterService } from "@raw-apex-games-app/app/modules/core/match/match-roster.service";
import { MatchService } from "@raw-apex-games-app/app/modules/core/match/match.service";
import { MockConfigurationService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-configuration.service";
import { MockMatchMapService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match-map.service";
import { MockMatchPlayerLegendService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match-player-legend.service";
import { MockMatchPlayerLocationService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match-player-location.service";
import { MockMatchPlayerStatsService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match-player-stats.service";
import { MockMatchRosterService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match-roster.service";
import { MockMatchService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match.service";
import { MockPlayerService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-player.service";
import { MockReportingService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-reporting.service";
import { PlayerService } from "@raw-apex-games-app/app/modules/core/player.service";
import { ReportingService } from "@raw-apex-games-app/app/modules/core/reporting/reporting.service";
import { MatchListingComponent } from "@raw-apex-games-app/app/shared/components/match-listing/match-listing.component";
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

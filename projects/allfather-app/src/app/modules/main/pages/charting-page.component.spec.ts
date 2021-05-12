import { FormatDistanceToNowStrictPipe } from "@allfather-app/app/shared/pipes/temp/format-distance-to-now-strict.pipe";
import { FormatDistanceToNowStrictPurePipe } from "@allfather-app/app/shared/pipes/temp/format-distance-to-now-strict.pure.pipe";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatchMapService } from "../../core/match/match-map.service";
import { MatchPlayerLocationService } from "../../core/match/match-player-location.service";
import { MatchService } from "../../core/match/match.service";
import { MockMatchMapService } from "../../core/mocks/services/mock-match-map.service";
import { MockMatchPlayerLocationService } from "../../core/mocks/services/mock-match-player-location.service";
import { MockMatchService } from "../../core/mocks/services/mock-match.service";
import { MockReportingService } from "../../core/mocks/services/mock-reporting.service";
import { ReportingService } from "../../core/reporting/reporting.service";
import { MapExplorerPageComponent } from "./map-explorer-page.component";

describe("MapExplorerPageComponent", () => {
    let component: MapExplorerPageComponent;
    let fixture: ComponentFixture<MapExplorerPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MapExplorerPageComponent, FormatDistanceToNowStrictPipe, FormatDistanceToNowStrictPurePipe],
            providers: [
                { provide: MatchService, useClass: MockMatchService },
                { provide: MatchMapService, useClass: MockMatchMapService },
                { provide: MatchPlayerLocationService, useClass: MockMatchPlayerLocationService },
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

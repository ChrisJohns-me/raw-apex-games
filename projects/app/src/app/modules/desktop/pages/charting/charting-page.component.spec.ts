import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { GameModesDropdownFilterComponent } from "../../../../shared/components/game-modes-dropdown-filter/game-modes-dropdown-filter.component";
import { LegendsDropdownFilterComponent } from "../../../../shared/components/legends-dropdown-filter/legends-dropdown-filter.component";
import { MapsDropdownFilterComponent } from "../../../../shared/components/maps-dropdown-filter/maps-dropdown-filter.component";
import { MatchService } from "../../../core/match/match.service";
import { MockFullHeightDirective } from "../../../core/mocks/directives/mock-full-height.directive";
import { MockMatchService } from "../../../core/mocks/services/mock-match.service";
import { MockReportingService } from "../../../core/mocks/services/mock-reporting.service";
import { ReportingService } from "../../../core/reporting/reporting.service";
import { ChartingPageComponent } from "./charting-page.component";
import { GameModeLineupChartComponent } from "./components/game-mode-lineup-chart.component";
import { GameModePlayrateChartComponent } from "./components/game-mode-playrate-chart.component";
import { LegendLineupChartComponent } from "./components/legend-lineup-chart.component";
import { LegendPickrateChartComponent } from "./components/legend-pickrate-chart.component";
import { RankedChartComponent } from "./components/ranked-chart.component";
import { StatsChartComponent } from "./components/stats-chart.component";

describe("ChartingPageComponent", () => {
    let component: ChartingPageComponent;
    let fixture: ComponentFixture<ChartingPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [
                ChartingPageComponent,
                LegendsDropdownFilterComponent,
                MapsDropdownFilterComponent,
                GameModesDropdownFilterComponent,
                StatsChartComponent,
                LegendLineupChartComponent,
                LegendPickrateChartComponent,
                GameModePlayrateChartComponent,
                GameModeLineupChartComponent,
                MockFullHeightDirective,
                RankedChartComponent,
            ],
            providers: [
                { provide: MatchService, useClass: MockMatchService },
                { provide: ReportingService, useClass: MockReportingService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChartingPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MockFullHeightDirective } from "@allfather-app/app/modules/core/mocks/directives/mock-full-height.directive";
import { MockMatchService } from "@allfather-app/app/modules/core/mocks/services/mock-match.service";
import { GameModesDropdownFilterComponent } from "@allfather-app/app/shared/components/game-modes-dropdown-filter/game-modes-dropdown-filter.component";
import { LegendsDropdownFilterComponent } from "@allfather-app/app/shared/components/legends-dropdown-filter/legends-dropdown-filter.component";
import { MapsDropdownFilterComponent } from "@allfather-app/app/shared/components/maps-dropdown-filter/maps-dropdown-filter.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ChartingPageComponent } from "./charting-page.component";
import { GameModeLineupChartComponent } from "./components/game-mode-lineup-chart.component";
import { GameModePlayrateChartComponent } from "./components/game-mode-playrate-chart.component";
import { LegendLineupChartComponent } from "./components/legend-lineup-chart.component";
import { LegendPickrateChartComponent } from "./components/legend-pickrate-chart.component";
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
            ],
            providers: [{ provide: MatchService, useClass: MockMatchService }],
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

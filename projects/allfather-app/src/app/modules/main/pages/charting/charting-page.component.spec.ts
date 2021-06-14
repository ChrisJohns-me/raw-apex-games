import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatchService } from "../../../core/match/match.service";
import { MockMatchService } from "../../../core/mocks/services/mock-match.service";
import { ChartingPageComponent } from "./charting-page.component";
import { DailyAverageGraphComponent } from "./components/daily-average-graph.component";

describe("ChartingPageComponent", () => {
    let component: ChartingPageComponent;
    let fixture: ComponentFixture<ChartingPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChartingPageComponent, DailyAverageGraphComponent],
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

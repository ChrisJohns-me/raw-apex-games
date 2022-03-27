import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MockMatchService } from "@allfather-app/app/modules/core/mocks/services/mock-match.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ChartingPageComponent } from "./charting-page.component";
import { LineGraphComponent } from "./components/line-graph.component";

describe("ChartingPageComponent", () => {
    let component: ChartingPageComponent;
    let fixture: ComponentFixture<ChartingPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChartingPageComponent, LineGraphComponent],
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

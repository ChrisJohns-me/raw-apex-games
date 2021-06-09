import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DailyAverageGraphComponent } from "./daily-average-graph.component";

describe("DailyAverageGraphComponent", () => {
    let component: DailyAverageGraphComponent;
    let fixture: ComponentFixture<DailyAverageGraphComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DailyAverageGraphComponent],
            providers: [],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DailyAverageGraphComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

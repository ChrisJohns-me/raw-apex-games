import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LegendStatsComponent } from "./legend-stats.component";

describe("LegendStatsComponent", () => {
    let sut: LegendStatsComponent;
    let fixture: ComponentFixture<LegendStatsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LegendStatsComponent],
            providers: [],
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(LegendStatsComponent);
        sut = fixture.componentInstance;
        fixture.detectChanges(); // ngOnInit
    });

    afterEach(() => {
        fixture.destroy();
    });

    it("should be created", () => {
        expect(sut).toBeDefined();
    });
});

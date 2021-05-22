import { LegendIconsBoardComponent } from "@allfather-app/app/modules/main/components/dashboard/legend-icons-board.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("LegendIconsBoardComponent", () => {
    let sut: LegendIconsBoardComponent;
    let fixture: ComponentFixture<LegendIconsBoardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LegendIconsBoardComponent],
            providers: [],
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(LegendIconsBoardComponent);
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

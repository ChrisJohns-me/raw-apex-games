import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LegendSelectIconsBoardComponent } from "./legend-select-icons-board.component";

describe("LegendIconsBoardComponent", () => {
    let sut: LegendSelectIconsBoardComponent;
    let fixture: ComponentFixture<LegendSelectIconsBoardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LegendSelectIconsBoardComponent],
            providers: [],
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(LegendSelectIconsBoardComponent);
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

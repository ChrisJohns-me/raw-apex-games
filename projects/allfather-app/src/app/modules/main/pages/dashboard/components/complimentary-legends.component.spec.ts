import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LegendIconsBoardComponent } from "./legend-icons-board.component";

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

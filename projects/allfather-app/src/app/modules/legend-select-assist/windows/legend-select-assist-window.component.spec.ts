import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LegendSelectAssistWindowComponent } from "./legend-select-assist-window.component";

describe("LegendSelectAssistWindowComponent", () => {
    let sut: LegendSelectAssistWindowComponent;
    let fixture: ComponentFixture<LegendSelectAssistWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LegendSelectAssistWindowComponent],
            providers: [],
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(LegendSelectAssistWindowComponent);
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

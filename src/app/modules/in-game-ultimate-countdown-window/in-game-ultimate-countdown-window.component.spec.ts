import { ComponentFixture, TestBed } from "@angular/core/testing";
import { InGameUltimateCountdownWindowComponent } from "./in-game-ultimate-countdown-window.component";

describe("InGameUltimateCountdownWindowComponent", () => {
    let component: InGameUltimateCountdownWindowComponent;
    let fixture: ComponentFixture<InGameUltimateCountdownWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InGameUltimateCountdownWindowComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InGameUltimateCountdownWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

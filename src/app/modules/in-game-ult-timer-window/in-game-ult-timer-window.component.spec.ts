import { ComponentFixture, TestBed } from "@angular/core/testing";
import { InGameUltTimerWindowComponent } from "./in-game-ult-timer-window.component.ts.bak";

describe("InGameUltTimerWindowComponent", () => {
    let component: InGameUltTimerWindowComponent;
    let fixture: ComponentFixture<InGameUltTimerWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InGameUltTimerWindowComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InGameUltTimerWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

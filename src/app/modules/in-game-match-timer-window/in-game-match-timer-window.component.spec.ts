import { ComponentFixture, TestBed } from "@angular/core/testing";
import { InGameMatchTimerWindowComponent } from "./in-game-match-timer-window.component";

describe("InGameMatchTimerWindowComponent", () => {
    let component: InGameMatchTimerWindowComponent;
    let fixture: ComponentFixture<InGameMatchTimerWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InGameMatchTimerWindowComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InGameMatchTimerWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

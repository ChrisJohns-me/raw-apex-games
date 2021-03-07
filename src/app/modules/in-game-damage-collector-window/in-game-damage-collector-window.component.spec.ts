import { ComponentFixture, TestBed } from "@angular/core/testing";
import { InGameDamageCollectorWindowComponent } from "./in-game-damage-collector-window.component";

describe("InGameDamageCollectorWindowComponent", () => {
    let component: InGameDamageCollectorWindowComponent;
    let fixture: ComponentFixture<InGameDamageCollectorWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InGameDamageCollectorWindowComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InGameDamageCollectorWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

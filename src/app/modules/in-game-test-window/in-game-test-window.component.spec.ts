import { ComponentFixture, TestBed } from "@angular/core/testing";
import { InGameTestWindowComponent } from "./in-game-test-window.component";

describe("InGameTestWindowComponent", () => {
    let component: InGameTestWindowComponent;
    let fixture: ComponentFixture<InGameTestWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InGameTestWindowComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InGameTestWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

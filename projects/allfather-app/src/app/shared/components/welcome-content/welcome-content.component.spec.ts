import { WelcomeContentComponent } from "@allfather-app/app/shared/components/welcome-content/welcome-content.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("WelcomeContentComponent", () => {
    let component: WelcomeContentComponent;
    let fixture: ComponentFixture<WelcomeContentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WelcomeContentComponent],
            providers: [],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WelcomeContentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

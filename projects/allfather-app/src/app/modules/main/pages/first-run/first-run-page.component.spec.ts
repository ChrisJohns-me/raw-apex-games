import { MockFullHeightDirective } from "@allfather-app/app/modules/core/mocks/directives/mock-full-height.directive";
import { WelcomeContentComponent } from "@allfather-app/app/shared/components/welcome-content/welcome-content.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FirstRunPageComponent } from "./first-run-page.component";

describe("FirstRunPageComponent", () => {
    let component: FirstRunPageComponent;
    let fixture: ComponentFixture<FirstRunPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FirstRunPageComponent, MockFullHeightDirective, WelcomeContentComponent],
            providers: [],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FirstRunPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

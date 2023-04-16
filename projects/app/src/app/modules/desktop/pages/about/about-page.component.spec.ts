import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockFullHeightDirective } from "@app/app/modules/core/mocks/directives/mock-full-height.directive";
import { WelcomeContentComponent } from "@app/app/shared/components/welcome-content/welcome-content.component";
import { AboutPageComponent } from "./about-page.component";

describe("AboutPageComponent", () => {
    let component: AboutPageComponent;
    let fixture: ComponentFixture<AboutPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AboutPageComponent, MockFullHeightDirective, WelcomeContentComponent],
            providers: [],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AboutPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

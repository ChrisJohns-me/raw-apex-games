import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WelcomeContentComponent } from "../../../../shared/components/welcome-content/welcome-content.component";
import { MockFullHeightDirective } from "../../../core/mocks/directives/mock-full-height.directive";
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

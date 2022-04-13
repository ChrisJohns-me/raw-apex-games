import { GoogleAnalyticsService } from "@allfather-app/app/modules/core/google-analytics.service";
import { MockFullHeightDirective } from "@allfather-app/app/modules/core/mocks/directives/mock-full-height.directive";
import { MockGoogleAnalyticsService } from "@allfather-app/app/modules/core/mocks/services/mock-google-analytics.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SafePipe } from "@shared/pipes/safe.pipe";
import { AcademyPageComponent } from "./academy-page.component";

describe("AcademyPageComponent", () => {
    let component: AcademyPageComponent;
    let fixture: ComponentFixture<AcademyPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AcademyPageComponent, MockFullHeightDirective, SafePipe],
            providers: [{ provide: GoogleAnalyticsService, useClass: MockGoogleAnalyticsService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AcademyPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

import { HrefDirective } from "@allfather-app/app/shared/directives/href.directive";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IconComponent } from "@shared/components/icon/icon.component";
import { NavbarComponent } from "./navbar.component";

describe("NavbarComponent", () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NavbarComponent, IconComponent, HrefDirective],
            providers: [],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should NOT change window.location.href on click", () => {
        // Arrange
        const navLink = fixture.nativeElement.querySelector(`.nav-link`);
        const expectedWindowHref = window.location.href;

        // Act
        navLink.click();
        const actualWindowHref = window.location.href;

        // Assert
        expect(actualWindowHref).toBe(expectedWindowHref);
    });
});

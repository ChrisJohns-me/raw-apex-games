import { ComponentFixture, TestBed } from "@angular/core/testing";
import { supressConsoleLog } from "@shared-app/testing-helpers";
import { BootstrapCSSInjectorComponent } from "./bootstrap-css-injector.component";

describe("BootstrapCSSInjectorComponent", () => {
    const domTestBedElementId = "bootstrap-css-injector-spec";
    const testBedNamedItems = ["container-fluid", "row", "col"] as const;
    let component: BootstrapCSSInjectorComponent;
    let fixture: ComponentFixture<BootstrapCSSInjectorComponent>;

    const generateTestBedHTML = (): string => `
        <div id="${domTestBedElementId}" style="display: none;">
            ${testBedNamedItems.map((n) => `<div class="${n}" id="${n}">${n}</div>`).join("\n")}
        </div>
    `;
    const getTestBedChild = (name: typeof testBedNamedItems[number]): any | undefined => {
        const children = document.getElementById(domTestBedElementId)?.children;
        return (children?.namedItem(name) as Element) ?? undefined;
    };

    beforeAll(() => {
        supressConsoleLog();
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BootstrapCSSInjectorComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BootstrapCSSInjectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        (fixture.nativeElement as HTMLElement).innerHTML = generateTestBedHTML();
    });

    afterEach(() => {
        // See https://stackoverflow.com/questions/51752862/angular-unit-tests-are-leaking-styles
        // See https://github.com/angular/angular/issues/31834
        window.document.querySelectorAll("style").forEach((style: HTMLStyleElement) => style.remove());
    });

    it("should be created", () => {
        expect(component).toBeTruthy();
    });

    it("'container-fluid' should have Bootstrap specific width", () => {
        // Arrange
        const element = getTestBedChild("container-fluid");
        const actual = element.computedStyleMap().get("width").value;

        // Assert
        expect(actual).toBe(100);
    });

    it("'row' should have Bootstrap specific 'display' ", () => {
        // Arrange
        const element = getTestBedChild("row");
        const actual = element.computedStyleMap().get("display").value;

        // Assert
        expect(actual).toBe("flex");
    });

    it("'col' should have Bootstrap specific 'flex-grow'", () => {
        // Arrange
        const element = getTestBedChild("col");
        const actual = element.computedStyleMap().get("flex-grow").value;

        // Assert
        expect(actual).toBe(1);
    });
});

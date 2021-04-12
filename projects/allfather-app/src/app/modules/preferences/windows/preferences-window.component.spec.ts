import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockUIContainerComponent } from "../../core/mocks/components/mock-ui-container.component";
import { PreferencesWindowComponent } from "./preferences-window.component";

describe("PreferencesWindowComponent", () => {
    let component: PreferencesWindowComponent;
    let fixture: ComponentFixture<PreferencesWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PreferencesWindowComponent, MockUIContainerComponent],
            providers: [],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PreferencesWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

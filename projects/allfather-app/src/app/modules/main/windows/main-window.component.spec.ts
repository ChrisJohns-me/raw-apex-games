import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockUIContainerComponent } from "../../core/mocks/components/mock-ui-container.component";
import { MainWindowComponent } from "./main-window.component";

describe("MainComponent", () => {
    let component: MainWindowComponent;
    let fixture: ComponentFixture<MainWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MainWindowComponent, MockUIContainerComponent],
            providers: [],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MainWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

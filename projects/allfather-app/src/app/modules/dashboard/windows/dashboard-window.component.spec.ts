import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockUIContainerComponent } from "../../core/mocks/components/mock-ui-container.component";
import { DashboardWindowComponent } from "./dashboard-window.component";

describe("DashboardComponent", () => {
    let component: DashboardWindowComponent;
    let fixture: ComponentFixture<DashboardWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardWindowComponent, MockUIContainerComponent],
            providers: [],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

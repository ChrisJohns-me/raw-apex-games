import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardWindowComponent } from "./dashboard-window.component";

describe("DashboardWindowComponent", () => {
    let component: DashboardWindowComponent;
    let fixture: ComponentFixture<DashboardWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardWindowComponent],
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

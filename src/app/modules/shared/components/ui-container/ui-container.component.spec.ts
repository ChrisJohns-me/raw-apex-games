import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UIContainerComponent } from "./ui-container.component";

describe("WindowWrapperComponent", () => {
    let component: UIContainerComponent;
    let fixture: ComponentFixture<UIContainerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UIContainerComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UIContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

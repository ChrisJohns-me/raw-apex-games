import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("FirstRunPageComponent", () => {
    let component: FirstRunPageComponent;
    let fixture: ComponentFixture<FirstRunPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FirstRunPageComponent],
            providers: [],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FirstRunPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

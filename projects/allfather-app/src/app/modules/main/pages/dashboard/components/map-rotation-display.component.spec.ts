import { MapRotationService } from "@allfather-app/app/modules/core/map-rotation/map-rotation.service";
import { MockMapRotationService } from "@allfather-app/app/modules/core/mocks/services/mock-map-rotation.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MapRotationDisplayComponent } from "./map-rotation-display.component";

describe("MapRotationDisplayComponent", () => {
    let sut: MapRotationDisplayComponent;
    let fixture: ComponentFixture<MapRotationDisplayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MapRotationDisplayComponent],
            providers: [{ provide: MapRotationService, useClass: MockMapRotationService }],
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(MapRotationDisplayComponent);
        sut = fixture.componentInstance;
        fixture.detectChanges(); // ngOnInit
    });

    afterEach(() => {
        fixture.destroy();
    });

    it("should be created", () => {
        expect(sut).toBeDefined();
    });
});

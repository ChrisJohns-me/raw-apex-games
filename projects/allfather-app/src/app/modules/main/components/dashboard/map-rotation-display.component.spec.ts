import { MatchMapService } from "@allfather-app/app/modules/core/match/match-map.service";
import { MockMatchMapService } from "@allfather-app/app/modules/core/mocks/services/mock-match-map.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MapRotationDisplayComponent } from "./map-rotation-display.component";

describe("MapRotationDisplayComponent", () => {
    let sut: MapRotationDisplayComponent;
    let fixture: ComponentFixture<MapRotationDisplayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MapRotationDisplayComponent],
            providers: [{ provide: MatchMapService, useClass: MockMatchMapService }],
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

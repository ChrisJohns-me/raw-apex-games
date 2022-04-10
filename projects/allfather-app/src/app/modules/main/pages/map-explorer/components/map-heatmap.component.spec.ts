import { supressConsoleLog } from "@allfather-app/app/common/testing-helpers";
import { FullHeightDirective } from "@allfather-app/app/shared/directives/full-height.directive";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MapHeatmapComponent } from "./map-heatmap.component";

describe("MapHeatmapComponent", () => {
    let component: MapHeatmapComponent;
    let fixture: ComponentFixture<MapHeatmapComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [MapHeatmapComponent, FullHeightDirective],
            providers: [],
        }).compileComponents();
    });

    beforeEach(() => {
        supressConsoleLog();
        fixture = TestBed.createComponent(MapHeatmapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { supressConsoleLog } from "@raw-apex-games-app/app/common/testing-helpers";
import { MapHeatmapComponent } from "./map-heatmap.component";

describe("MapHeatmapComponent", () => {
    let component: MapHeatmapComponent;
    let fixture: ComponentFixture<MapHeatmapComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [MapHeatmapComponent],
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
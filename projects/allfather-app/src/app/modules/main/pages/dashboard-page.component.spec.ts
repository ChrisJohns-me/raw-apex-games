import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfigurationService } from "../../core/configuration.service";
import { LocalDatabaseService } from "../../core/local-database/local-database.service";
import { MapRotationService } from "../../core/map-rotation/map-rotation.service";
import { MatchMapService } from "../../core/match/match-map.service";
import { MockConfigurationService } from "../../core/mocks/services/mock-configuration.service";
import { MockLocalDatabaseService } from "../../core/mocks/services/mock-local-database.service";
import { MockMapRotationService } from "../../core/mocks/services/mock-map-rotation.service";
import { MockMatchMapService } from "../../core/mocks/services/mock-match-map.service";
import { MockPlayerStatsService } from "../../core/mocks/services/mock-player-stats.service";
import { MockPlayerService } from "../../core/mocks/services/mock-player.service";
import { PlayerLocalStatsService } from "../../core/player-local-stats.service";
import { PlayerService } from "../../core/player.service";
import { LegendIconsBoardComponent } from "../components/dashboard/legend-icons-board.component";
import { MapRotationDisplayComponent } from "../components/dashboard/map-rotation-display.component";
import { DashboardPageComponent } from "./dashboard-page.component";

describe("DashboardPageComponent", () => {
    let component: DashboardPageComponent;
    let fixture: ComponentFixture<DashboardPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardPageComponent, LegendIconsBoardComponent, MapRotationDisplayComponent],
            providers: [
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: LocalDatabaseService, useClass: MockLocalDatabaseService },
                { provide: PlayerService, useClass: MockPlayerService },
                { provide: PlayerLocalStatsService, useClass: MockPlayerStatsService },
                { provide: MatchMapService, useClass: MockMatchMapService },
                { provide: MapRotationService, useClass: MockMapRotationService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

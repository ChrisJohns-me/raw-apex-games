import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfigurationService } from "../../core/configuration.service";
import { LocalDatabaseService } from "../../core/local-database/local-database.service";
import { MockConfigurationService } from "../../core/mocks/services/mock-configuration.service";
import { MockLocalDatabaseService } from "../../core/mocks/services/mock-local-database.service";
import { MockPlayerStatsService } from "../../core/mocks/services/mock-player-stats.service";
import { MockPlayerService } from "../../core/mocks/services/mock-player.service";
import { PlayerStatsService } from "../../core/player-stats.service";
import { PlayerService } from "../../core/player.service";
import { DashboardPageComponent } from "./dashboard-page.component";

describe("DashboardPageComponent", () => {
    let component: DashboardPageComponent;
    let fixture: ComponentFixture<DashboardPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardPageComponent],
            providers: [
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: LocalDatabaseService, useClass: MockLocalDatabaseService },
                { provide: PlayerService, useClass: MockPlayerService },
                { provide: PlayerStatsService, useClass: MockPlayerStatsService },
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

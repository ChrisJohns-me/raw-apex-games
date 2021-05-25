import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfigurationService } from "../../core/configuration.service";
import { MockUIContainerComponent } from "../../core/mocks/components/mock-ui-container.component";
import { MockConfigurationService } from "../../core/mocks/services/mock-configuration.service";
import { MockPlayerStatsService } from "../../core/mocks/services/mock-player-stats.service";
import { MockSettingsService } from "../../core/mocks/services/mock-settings.service";
import { PlayerStatsService } from "../../core/player-stats.service";
import { SettingsService } from "../../core/settings.service";
import { LegendSelectAssistWindowComponent } from "./legend-select-assist-window.component";

describe("LegendSelectAssistWindowComponent", () => {
    let sut: LegendSelectAssistWindowComponent;
    let fixture: ComponentFixture<LegendSelectAssistWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LegendSelectAssistWindowComponent, MockUIContainerComponent],
            providers: [
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: PlayerStatsService, useClass: MockPlayerStatsService },
                { provide: SettingsService, useClass: MockSettingsService },
            ],
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(LegendSelectAssistWindowComponent);
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

import { MockConfigurationService } from "@allfather-app/app/modules/core/mocks/mock-configuration.service";
import { MockSettingsService } from "@allfather-app/app/modules/core/mocks/mock-settings.service";
import { SettingsService } from "@allfather-app/app/modules/core/settings.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockUIContainerComponent } from "@shared-app/mocks/components/mock-ui-container.component";
import { MockPlayerStatsService } from "@shared-app/mocks/services/mock-player-stats.service";
import { ConfigurationService } from "../../core/configuration.service";
import { PlayerLocalStatsService } from "../../core/player-local-stats.service";
import { LegendSelectAssistWindowComponent } from "./legend-select-assist-window.component";

describe("LegendSelectAssistWindowComponent", () => {
    let sut: LegendSelectAssistWindowComponent;
    let fixture: ComponentFixture<LegendSelectAssistWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LegendSelectAssistWindowComponent, MockUIContainerComponent],
            providers: [
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: PlayerLocalStatsService, useClass: MockPlayerStatsService },
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

import { supressConsoleLog } from "@allfather-app/app/common/testing-helpers";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { MockUIContainerComponent } from "@allfather-app/app/modules/core/mocks/components/mock-ui-container.component";
import { MockConfigurationService } from "@allfather-app/app/modules/core/mocks/services/mock-configuration.service";
import { MockOverwolfInputTrackingService } from "@allfather-app/app/modules/core/mocks/services/mock-overwolf-input-tracking.service";
import { MockSettingsService } from "@allfather-app/app/modules/core/mocks/services/mock-settings.service";
import { OverwolfInputTrackingService } from "@allfather-app/app/modules/core/overwolf/overwolf-input-tracking.service";
import { SettingsService } from "@allfather-app/app/modules/core/settings.service";
import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TestScheduler } from "rxjs/testing";
import { ReticleHelperWindowComponent } from "./reticle-helper-window.component";

describe("ReticleHelperWindowComponent", () => {
    let sut: ReticleHelperWindowComponent;
    let fixture: ComponentFixture<ReticleHelperWindowComponent>;
    let scheduler: TestScheduler;
    let configurationService: ConfigurationService;
    let overwolfInputTrackingService: OverwolfInputTrackingService;
    let settingsService: SettingsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ReticleHelperWindowComponent, MockUIContainerComponent],
            providers: [
                { provide: ChangeDetectorRef, useValue: {} },
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: OverwolfInputTrackingService, useClass: MockOverwolfInputTrackingService },
                { provide: SettingsService, useClass: MockSettingsService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
        supressConsoleLog();
        scheduler.maxFrames = 5000;
        fixture = TestBed.createComponent(ReticleHelperWindowComponent);
        sut = fixture.componentInstance;
        configurationService = TestBed.inject(ConfigurationService);
        overwolfInputTrackingService = TestBed.inject(OverwolfInputTrackingService);
        settingsService = TestBed.inject(SettingsService);
        fixture.detectChanges(); // ngOnInit
    });

    afterEach(() => {
        fixture.destroy();
    });

    it("should be created", () => {
        expect(sut).toBeDefined();
    });
});

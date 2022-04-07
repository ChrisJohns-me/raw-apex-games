import { supressConsoleLog } from "@allfather-app/app/common/testing-helpers";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { MatchPlayerInventoryService } from "@allfather-app/app/modules/core/match/match-player-inventory.service";
import { MatchPlayerLocationService } from "@allfather-app/app/modules/core/match/match-player-location.service";
import { MatchPlayerService } from "@allfather-app/app/modules/core/match/match-player.service";
import { MatchRingService } from "@allfather-app/app/modules/core/match/match-ring.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MockUIContainerComponent } from "@allfather-app/app/modules/core/mocks/components/mock-ui-container.component";
import { MockConfigurationService } from "@allfather-app/app/modules/core/mocks/services/mock-configuration.service";
import { MockMatchPlayerInventoryService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player-inventory.service";
import { MockMatchPlayerLocationService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player-location.service";
import { MockMatchPlayerService } from "@allfather-app/app/modules/core/mocks/services/mock-match-player.service";
import { MockMatchRingService } from "@allfather-app/app/modules/core/mocks/services/mock-match-ring.service";
import { MockMatchService } from "@allfather-app/app/modules/core/mocks/services/mock-match.service";
import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TestScheduler } from "rxjs/testing";
import { HealingHelperWindowComponent } from "./healing-helper-window.component";

describe("HealingHelperWindowComponent", () => {
    let sut: HealingHelperWindowComponent;
    let fixture: ComponentFixture<HealingHelperWindowComponent>;
    let scheduler: TestScheduler;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HealingHelperWindowComponent, MockUIContainerComponent],
            providers: [
                { provide: ChangeDetectorRef, useValue: {} },
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: MatchService, useClass: MockMatchService },
                { provide: MatchPlayerService, useClass: MockMatchPlayerService },
                { provide: MatchPlayerInventoryService, useClass: MockMatchPlayerInventoryService },
                { provide: MatchPlayerLocationService, useClass: MockMatchPlayerLocationService },
                { provide: MatchRingService, useClass: MockMatchRingService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
        supressConsoleLog();
        scheduler.maxFrames = 5000;
        fixture = TestBed.createComponent(HealingHelperWindowComponent);
        sut = fixture.componentInstance;
        fixture.detectChanges(); // ngOnInit
    });

    afterEach(() => {
        fixture.destroy();
    });

    it("should be created", () => {
        expect(sut).toBeDefined();
    });

    it("should not show by default", () => {
        const actual = sut.isVisible;
        expect(actual).toBeFalse();
    });
});

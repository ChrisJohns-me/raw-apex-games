import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HotkeyService } from "../../background/hotkey.service";
import { ConfigurationService } from "../../core/configuration.service";
import { MatchService } from "../../core/match/match.service";
import { MockUIContainerComponent } from "../../core/mocks/components/mock-ui-container.component";
import { MockConfigurationService } from "../../core/mocks/services/mock-configuration.service";
import { MockHotkeyService } from "../../core/mocks/services/mock-hotkey.service";
import { MockMatchService } from "../../core/mocks/services/mock-match.service";
import { InGameWindowComponent } from "./ingame-window.component";

describe("InGameWindowComponent", () => {
    let sut: InGameWindowComponent;
    let fixture: ComponentFixture<InGameWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InGameWindowComponent, MockUIContainerComponent],
            providers: [
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: HotkeyService, useClass: MockHotkeyService },
                { provide: MatchService, useClass: MockMatchService },
            ],
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(InGameWindowComponent);
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

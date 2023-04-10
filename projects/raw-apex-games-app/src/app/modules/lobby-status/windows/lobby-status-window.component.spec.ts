import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HotkeyService } from "../../background/hotkey.service";
import { ConfigurationService } from "../../core/configuration.service";
import { MapRotationService } from "../../core/map-rotation/map-rotation.service";
import { MatchService } from "../../core/match/match.service";
import { MockUIContainerComponent } from "../../core/mocks/components/mock-ui-container.component";
import { MockConfigurationService } from "../../core/mocks/services/mock-configuration.service";
import { MockHotkeyService } from "../../core/mocks/services/mock-hotkey.service";
import { MockMapRotationService } from "../../core/mocks/services/mock-map-rotation.service";
import { MockMatchService } from "../../core/mocks/services/mock-match.service";
import { LobbyStatusWindowComponent } from "./lobby-status-window.component";

describe("LobbyStatusWindowComponent", () => {
    let sut: LobbyStatusWindowComponent;
    let fixture: ComponentFixture<LobbyStatusWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LobbyStatusWindowComponent, MockUIContainerComponent],
            providers: [
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: HotkeyService, useClass: MockHotkeyService },
                { provide: MapRotationService, useClass: MockMapRotationService },
                { provide: MatchService, useClass: MockMatchService },
            ],
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(LobbyStatusWindowComponent);
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

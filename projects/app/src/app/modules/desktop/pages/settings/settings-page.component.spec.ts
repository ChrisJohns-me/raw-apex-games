import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { IconComponent } from "../../../../../../../shared/components/icon/icon.component";
import { HotkeyService } from "../../../background/hotkey.service";
import { ConfigurationService } from "../../../core/configuration.service";
import { FileService } from "../../../core/file.service";
import { WINDOW } from "../../../core/global-window.provider";
import { LocalDatabaseService } from "../../../core/local-database/local-database.service";
import { MockConfigurationService } from "../../../core/mocks/services/mock-configuration.service";
import { MockDesktopWindowService } from "../../../core/mocks/services/mock-desktop-window.service";
import { MockFileService } from "../../../core/mocks/services/mock-file.service";
import { MockHotkeyService } from "../../../core/mocks/services/mock-hotkey.service";
import { MockInGameWindowService } from "../../../core/mocks/services/mock-in-game-window.service";
import { MockLocalDatabaseService } from "../../../core/mocks/services/mock-local-database.service";
import { MockOverwolfProfileService } from "../../../core/mocks/services/mock-overwolf-profile.service";
import { MockSessionStorageService } from "../../../core/mocks/services/mock-session-storage.service";
import { MockSettingsService } from "../../../core/mocks/services/mock-settings.service";
import { OverwolfProfileService } from "../../../core/overwolf/overwolf-profile.service";
import { SessionStorageService } from "../../../core/session-storage/session-storage.service";
import { SettingsService } from "../../../core/settings.service";
import { InGameWindowService } from "../../../in-game/windows/in-game-window.service";
import { DesktopWindowService } from "../../windows/desktop-window.service";
import { SettingsPageComponent } from "./settings-page.component";

describe("SettingsPageComponent", () => {
    let component: SettingsPageComponent;
    let fixture: ComponentFixture<SettingsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [SettingsPageComponent, IconComponent],
            providers: [
                { provide: DesktopWindowService, useClass: MockDesktopWindowService },
                { provide: InGameWindowService, useClass: MockInGameWindowService },
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: FileService, useClass: MockFileService },
                { provide: HotkeyService, useClass: MockHotkeyService },
                { provide: LocalDatabaseService, useClass: MockLocalDatabaseService },
                { provide: OverwolfProfileService, useClass: MockOverwolfProfileService },
                { provide: SessionStorageService, useClass: MockSessionStorageService },
                { provide: SettingsService, useClass: MockSettingsService },
                { provide: WINDOW, useValue: {} },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

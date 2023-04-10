import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { HotkeyService } from "@raw-apex-games-app/app/modules/background/hotkey.service";
import { ConfigurationService } from "@raw-apex-games-app/app/modules/core/configuration.service";
import { FileService } from "@raw-apex-games-app/app/modules/core/file.service";
import { WINDOW } from "@raw-apex-games-app/app/modules/core/global-window.provider";
import { LocalDatabaseService } from "@raw-apex-games-app/app/modules/core/local-database/local-database.service";
import { MockConfigurationService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-configuration.service";
import { MockFileService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-file.service";
import { MockHotkeyService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-hotkey.service";
import { MockLocalDatabaseService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-local-database.service";
import { MockMainWindowService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-main-window.service";
import { MockOverwolfProfileService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-overwolf-profile.service";
import { MockSessionStorageService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-session-storage.service";
import { MockSettingsService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-settings.service";
import { OverwolfProfileService } from "@raw-apex-games-app/app/modules/core/overwolf/overwolf-profile.service";
import { SessionStorageService } from "@raw-apex-games-app/app/modules/core/session-storage/session-storage.service";
import { SettingsService } from "@raw-apex-games-app/app/modules/core/settings.service";
import { IconComponent } from "@shared/components/icon/icon.component";
import { MainDesktopWindowService } from "../../windows/main-desktop-window.service";
import { MainInGameWindowService } from "../../windows/main-ingame-window.service";
import { SettingsPageComponent } from "./settings-page.component";

describe("SettingsPageComponent", () => {
    let component: SettingsPageComponent;
    let fixture: ComponentFixture<SettingsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [SettingsPageComponent, IconComponent],
            providers: [
                { provide: MainDesktopWindowService, useClass: MockMainWindowService },
                { provide: MainInGameWindowService, useClass: MockMainWindowService },
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

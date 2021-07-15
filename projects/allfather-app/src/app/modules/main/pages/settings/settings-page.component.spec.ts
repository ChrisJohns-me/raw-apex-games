import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { LocalDatabaseService } from "@allfather-app/app/modules/core/local-database/local-database.service";
import { MockConfigurationService } from "@allfather-app/app/modules/core/mocks/mock-configuration.service";
import { MockLocalDatabaseService } from "@allfather-app/app/modules/core/mocks/mock-local-database.service";
import { MockSettingsService } from "@allfather-app/app/modules/core/mocks/mock-settings.service";
import { SettingsService } from "@allfather-app/app/modules/core/settings.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MockFileService } from "@shared-app/mocks/services/mock-file.service";
import { MockOverwolfProfileService } from "@shared-app/mocks/services/mock-overwolf-profile.service";
import { FileService } from "@shared-app/services/file.service";
import { OverwolfProfileService } from "@shared-app/services/overwolf/overwolf-profile.service";
import { IconComponent } from "@shared/components/icon/icon.component";
import { SettingsPageComponent } from "./settings-page.component";

describe("SettingsPageComponent", () => {
    let component: SettingsPageComponent;
    let fixture: ComponentFixture<SettingsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [SettingsPageComponent, IconComponent],
            providers: [
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: FileService, useClass: MockFileService },
                { provide: FormBuilder, useClass: FormBuilder },
                { provide: OverwolfProfileService, useClass: MockOverwolfProfileService },
                { provide: LocalDatabaseService, useClass: MockLocalDatabaseService },
                { provide: SettingsService, useClass: MockSettingsService },
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

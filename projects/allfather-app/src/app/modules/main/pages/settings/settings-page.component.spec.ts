import { FileService } from "@allfather-app/app/modules/core/file.service";
import { LocalDatabaseService } from "@allfather-app/app/modules/core/local-database/local-database.service";
import { MockFileService } from "@allfather-app/app/modules/core/mocks/services/mock-file.service";
import { MockLocalDatabaseService } from "@allfather-app/app/modules/core/mocks/services/mock-local-database.service";
import { MockSettingsService } from "@allfather-app/app/modules/core/mocks/services/mock-settings.service";
import { SettingsService } from "@allfather-app/app/modules/core/settings.service";
import { IconComponent } from "@allfather-app/app/shared/components/icon/icon.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { SettingsPageComponent } from "./settings-page.component";

describe("SettingsPageComponent", () => {
    let component: SettingsPageComponent;
    let fixture: ComponentFixture<SettingsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [SettingsPageComponent, IconComponent],
            providers: [
                { provide: FileService, useClass: MockFileService },
                { provide: FormBuilder, useClass: FormBuilder },
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

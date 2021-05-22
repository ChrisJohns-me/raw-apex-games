import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { FileService } from "../../core/file.service";
import { LocalDatabaseService } from "../../core/local-database/local-database.service";
import { MockFileService } from "../../core/mocks/services/mock-file.service";
import { MockLocalDatabaseService } from "../../core/mocks/services/mock-local-database.service";
import { MockSettingsService } from "../../core/mocks/services/mock-settings.service";
import { SettingsService } from "../../core/settings.service";
import { SettingsPageComponent } from "./settings-page.component";

describe("SettingsPageComponent", () => {
    let component: SettingsPageComponent;
    let fixture: ComponentFixture<SettingsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SettingsPageComponent],
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

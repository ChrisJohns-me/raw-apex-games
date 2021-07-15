import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { mdiAttachment } from "@mdi/js";
import { FileService } from "@shared-app/services/file.service";
import { OverwolfProfileService } from "@shared-app/services/overwolf/overwolf-profile.service";
import { AllSettings, SettingKey } from "@siren-app/app/common/settings";
import { ConfigurationService } from "@siren-app/app/modules/core/configuration.service";
import { LocalDatabaseService } from "@siren-app/app/modules/core/local-database/local-database.service";
import { SettingsService } from "@siren-app/app/modules/core/settings.service";
import { Configuration } from "@siren-app/configs/sirenconfig.interface";
import "dexie-export-import";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

const SAVE_SETTINGS_DEBOUNCETIME = 1000;

@Component({
    selector: "app-settings-page",
    templateUrl: "./settings-page.component.html",
    styleUrls: ["./settings-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent implements OnInit, OnDestroy {
    public config?: Configuration;
    //#region Forms
    public settingsForm = this.formBuilder.group({
        // [SettingKey.EnableAllInGameHUD]: false,
        // inGameHUDFormGroup: this.formBuilder.group({
        //     [SettingKey.EnableInGameMatchTimerHUD]: [false],
        //     [SettingKey.EnableInGameUltimateTimerHUD]: [false],
        //     [SettingKey.EnableInGameInflictionInsightHUD]: [false],
        //     [SettingKey.EnableInGameAimingReticle]: [false],
        //     [SettingKey.InGameAimingReticleId]: [AimingReticleList[0].reticleId],
        //     [SettingKey.InGameAimingReticleColor]: [AimingReticleList[0].hexColor],
        //     [SettingKey.InGameAimingReticleAlpha]: [AimingReticleList[0].alpha],
        //     [SettingKey.InGameAimingReticleDynamicHide]: [false],
        // }),
        // [SettingKey.EnableAllLegendSelectHUD]: false,
        // legendSelectHUDFormGroup: this.formBuilder.group({
        //     [SettingKey.EnableLegendSelectLegendStats]: [false],
        //     [SettingKey.EnableLegendSelectLegendSuggestions]: [false],
        // }),
    });
    // public get [SettingKey.EnableAllInGameHUD](): FormControl {
    //     return this.settingsForm.get([SettingKey.EnableAllInGameHUD]) as FormControl;
    // }
    // public get inGameHUDFormGroup(): FormGroup {
    //     return this.settingsForm.get("inGameHUDFormGroup") as FormGroup;
    // }
    // public get [SettingKey.EnableAllLegendSelectHUD](): FormControl {
    //     return this.settingsForm.get([SettingKey.EnableAllLegendSelectHUD]) as FormControl;
    // }
    // public get legendSelectHUDFormGroup(): FormGroup {
    //     return this.settingsForm.get("legendSelectHUDFormGroup") as FormGroup;
    // }
    //#endregion

    //#region State Variables
    public isEditing = false;
    public get isSaving(): boolean {
        return this._isSaving;
    }
    public set isSaving(value: boolean) {
        this._isSaving = value;
        this.refreshAllFormStates();
    }
    public isExportingLocalDatabase = false;
    public isImportingLocalDatabase = false;
    //#endregion

    //#region Pass-through variables
    public SettingKey = SettingKey;
    public mdiAttachment = mdiAttachment;
    //#endregion

    private _isSaving = false;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly configuration: ConfigurationService,
        private readonly fileService: FileService,
        private readonly formBuilder: FormBuilder,
        private readonly localDatabase: LocalDatabaseService,
        private readonly overwolfProfile: OverwolfProfileService,
        private readonly settingsService: SettingsService
    ) {
        this.configuration.config$.pipe(takeUntil(this.destroy$)).subscribe((config) => (this.config = config));
    }

    public ngOnInit(): void {
        this.setupSettingsListener();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupSettingsListener(): void {
        const applyAllSettingsFn = (settings: AllSettings): void => {
            // this.settingsForm
            //     .get([SettingKey.EnableAllInGameHUD])
            //     ?.patchValue(settings[SettingKey.EnableAllInGameHUD], { emitEvent: false });
            // this.settingsForm
            //     .get([SettingKey.EnableAllLegendSelectHUD])
            //     ?.patchValue(settings[SettingKey.EnableAllLegendSelectHUD], { emitEvent: false });
            // this.inGameHUDFormGroup.patchValue(settings, { emitEvent: false });
            // this.legendSelectHUDFormGroup.patchValue(settings, { emitEvent: false });
        };

        this.settingsService
            .streamAllSettings$()
            .pipe(takeUntil(this.destroy$))
            .subscribe((allSettings) => {
                applyAllSettingsFn(allSettings);
                this.refreshAllFormStates();
            });
    }

    private refreshAllFormStates(): void {}

    // private saveSettingsChanges(changes: unknown): void {
    //     if (this.isEditing) return;
    //     if (!changes || typeof changes !== "object") return;
    //     this.isSaving = true;
    //     const bulkSettings = Object.entries(changes!)
    //         .map(([_key, _newValue]) => {
    //             const key = _key as SettingKey;
    //             const newValue = _newValue as SettingValue;
    //             if (!Object.values(SettingKey).includes(key)) {
    //                 return void console.warn(`Setting not saved. Unknown Settings Key "${key}".`);
    //             }
    //             if (typeof newValue !== typeof DefaultSetting[key]) {
    //                 return void console.error(
    //                     `Setting not saved. Setting key "${key}" type mismatch. ` +
    //                         `${typeof newValue} != ${typeof DefaultSetting[key as SettingKey]}`
    //                 );
    //             }

    //             return new SettingsDataStore(key, newValue);
    //         })
    //         .filter((setting) => !!setting)
    //         .map((setting) => setting as SettingsDataStore<string | number | bigint | boolean>);

    //     this.settingsService
    //         .bulkStoreSettings$(bulkSettings)
    //         .pipe(finalize(() => (this.isSaving = false)))
    //         .subscribe();
    // }
}

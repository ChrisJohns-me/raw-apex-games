import { AllSettings, DefaultSetting, SettingKey, SettingValue } from "@allfather-app/app/common/settings";
import { environment } from "@allfather-app/environments/environment";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { mdiAttachment } from "@mdi/js";
import format from "date-fns/format";
import "dexie-export-import";
import { importInto, ImportOptions } from "dexie-export-import";
import { from, merge, of, Subject } from "rxjs";
import { finalize, map, switchMap, takeUntil } from "rxjs/operators";
import { FileService } from "../../core/file.service";
import { LocalDatabaseService } from "../../core/local-database/local-database.service";
import { SettingsDataStore } from "../../core/local-database/settings-data-store";
import { SettingsService } from "../../core/settings.service";

@Component({
    selector: "app-settings-page",
    templateUrl: "./settings-page.component.html",
    styleUrls: ["./settings-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent implements OnInit, OnDestroy {
    public SettingKey = SettingKey;
    public mdiAttachment = mdiAttachment;
    public settingsForm = this.formBuilder.group({
        [SettingKey.EnableAllInGameHUD]: false,
        inGameHUDFormGroup: this.formBuilder.group({
            [SettingKey.EnableInGameMatchTimerHUD]: [false],
            [SettingKey.EnableInGameUltimateTimerHUD]: [false],
            [SettingKey.EnableInGameInflictionInsightHUD]: [false],
        }),
        [SettingKey.EnableAllLegendSelectHUD]: false,
        legendSelectHUDFormGroup: this.formBuilder.group({
            [SettingKey.EnableLegendSelectLegendStats]: [false],
            [SettingKey.EnableLegendSelectLegendSuggestions]: [false],
        }),
    });
    public get [SettingKey.EnableAllInGameHUD](): FormControl {
        return this.settingsForm.get([SettingKey.EnableAllInGameHUD]) as FormControl;
    }
    public get inGameHUDFormGroup(): FormGroup {
        return this.settingsForm.get("inGameHUDFormGroup") as FormGroup;
    }
    public get [SettingKey.EnableAllLegendSelectHUD](): FormControl {
        return this.settingsForm.get([SettingKey.EnableAllLegendSelectHUD]) as FormControl;
    }
    public get legendSelectHUDFormGroup(): FormGroup {
        return this.settingsForm.get("legendSelectHUDFormGroup") as FormGroup;
    }

    public get isSaving(): boolean {
        return this._isSaving;
    }
    public set isSaving(value: boolean) {
        this._isSaving = value;
        this.refreshAllFormStates();
    }
    public isExportingLocalDatabase = false;
    public isImportingLocalDatabase = false;

    private dbExportFilename = `${environment.DEV ? "DEV_" : ""}allfather_db_${format(new Date(), "yyyy_dd_mm")}.json`;
    private dbExportDirectory = "db_export";
    private _isSaving = false;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly fileService: FileService,
        private readonly formBuilder: FormBuilder,
        private readonly localDatabase: LocalDatabaseService,
        private readonly settingsService: SettingsService
    ) {}

    public ngOnInit(): void {
        this.setupInGameHUDForm();
        this.setupLegendSelectHUDForm();
        this.setupSettingsListener();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public exportLocalDatabase(): void {
        this.isExportingLocalDatabase = true;
        this.fileService
            .ensureDirectory$(this.dbExportDirectory)
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.localDatabase.exportDatabaseBlob$()),
                switchMap((blobContent) => from(blobContent.text())),
                switchMap((jsonContent) => this.fileService.saveFile$(`${this.dbExportDirectory}/${this.dbExportFilename}`, jsonContent)),
                finalize(() => (this.isExportingLocalDatabase = false))
            )
            .subscribe(() => {
                console.debug(`>>> Finished Export.`);
            });
    }

    public importLocalDatabase(event: Event): void {
        const options: ImportOptions = {
            acceptNameDiff: true,
            acceptChangedPrimaryKey: true,
            overwriteValues: true,
            // this may be an entry for future bugs on corrupted data.
            // But for now is necessary to avoid "Database is closing" error.
            noTransaction: true,
            chunkSizeBytes: 5 * 1000 * 1000,
        };
        this.isImportingLocalDatabase = true;
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;

        importInto(this.localDatabase, file, options)
            .then(console.log)
            .catch(console.error)
            .finally(() => {
                console.debug(`>>> Finished Import.`);
                this.isImportingLocalDatabase = false;
            });
    }

    private setupSettingsListener(): void {
        const applyAllSettingsFn = (settings: AllSettings): void => {
            this.settingsForm
                .get([SettingKey.EnableAllInGameHUD])
                ?.patchValue(settings[SettingKey.EnableAllInGameHUD], { emitEvent: false });
            this.settingsForm
                .get([SettingKey.EnableAllLegendSelectHUD])
                ?.patchValue(settings[SettingKey.EnableAllLegendSelectHUD], { emitEvent: false });

            this.inGameHUDFormGroup.patchValue(settings, { emitEvent: false });
            this.legendSelectHUDFormGroup.patchValue(settings, { emitEvent: false });
        };

        this.settingsService
            .streamAllSettings$()
            .pipe(takeUntil(this.destroy$))
            .subscribe((allSettings) => {
                applyAllSettingsFn(allSettings);
                this.refreshAllFormStates();
            });
    }

    private refreshAllFormStates(): void {
        if (this.isSaving) {
            this.settingsForm.get([SettingKey.EnableAllInGameHUD])?.disable({ emitEvent: false });
            this.settingsForm.get([SettingKey.EnableAllLegendSelectHUD])?.disable({ emitEvent: false });
        } else {
            this.settingsForm.get([SettingKey.EnableAllInGameHUD])?.enable({ emitEvent: false });
            this.settingsForm.get([SettingKey.EnableAllLegendSelectHUD])?.enable({ emitEvent: false });
        }

        this.refreshInGameFormHUDState();
        this.refreshLegendSelectHUDFormState();
    }

    //#region In Game HUD
    private setupInGameHUDForm(): void {
        this.settingsForm
            .get([SettingKey.EnableAllInGameHUD])
            ?.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.refreshInGameFormHUDState();
            });

        merge(
            this.settingsForm
                .get([SettingKey.EnableAllInGameHUD])
                ?.valueChanges.pipe(map((value) => ({ [SettingKey.EnableAllInGameHUD]: value }))) ?? of(),
            this.inGameHUDFormGroup.valueChanges ?? of()
        )
            .pipe(takeUntil(this.destroy$))
            .subscribe(this.saveSettingsChanges.bind(this));
    }

    private refreshInGameFormHUDState(): void {
        if (this.settingsForm.get([SettingKey.EnableAllInGameHUD])?.value && !this.isSaving)
            this.inGameHUDFormGroup.enable({ emitEvent: false });
        else this.inGameHUDFormGroup.disable({ emitEvent: false });
    }
    //#endregion

    //#region Legend Select HUD
    private setupLegendSelectHUDForm(): void {
        this.settingsForm
            .get([SettingKey.EnableAllLegendSelectHUD])
            ?.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.refreshLegendSelectHUDFormState();
            });

        merge(
            this.settingsForm
                .get([SettingKey.EnableAllLegendSelectHUD])
                ?.valueChanges.pipe(map((value) => ({ [SettingKey.EnableAllLegendSelectHUD]: value }))) ?? of(),
            this.legendSelectHUDFormGroup.valueChanges ?? of()
        )
            .pipe(takeUntil(this.destroy$))
            .subscribe(this.saveSettingsChanges.bind(this));
    }

    private refreshLegendSelectHUDFormState(): void {
        if (this.settingsForm.get([SettingKey.EnableAllLegendSelectHUD])?.value && !this.isSaving)
            this.legendSelectHUDFormGroup.enable({ emitEvent: false });
        else {
            this.legendSelectHUDFormGroup.disable({ emitEvent: false });
        }
    }
    //#endregion

    private saveSettingsChanges(changes: unknown): void {
        if (!changes || typeof changes !== "object") return;
        this.isSaving = true;
        const bulkSettings = Object.entries(changes!)
            .map(([_key, _newValue]) => {
                const key = _key as SettingKey;
                const newValue = _newValue as SettingValue;
                if (!Object.values(SettingKey).includes(key)) {
                    return void console.warn(`Setting not saved. Unknown Settings Key "${key}".`);
                }
                if (typeof newValue !== typeof DefaultSetting[key]) {
                    return void console.error(
                        `Setting not saved. Setting key "${key}" type mismatch. ` +
                            `${typeof newValue} != ${typeof DefaultSetting[key as SettingKey]}`
                    );
                }

                return new SettingsDataStore(key, newValue);
            })
            .filter((setting) => !!setting)
            .map((setting) => setting as SettingsDataStore<string | number | bigint | boolean>);

        this.settingsService
            .bulkStoreSettings$(bulkSettings)
            .pipe(finalize(() => (this.isSaving = false)))
            .subscribe();
    }
}

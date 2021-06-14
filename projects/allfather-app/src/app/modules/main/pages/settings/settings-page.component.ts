import { AllSettings, DefaultSetting, SettingKey, SettingValue } from "@allfather-app/app/common/settings";
import { FileService } from "@allfather-app/app/modules/core/file.service";
import { LocalDatabaseService } from "@allfather-app/app/modules/core/local-database/local-database.service";
import { SettingsDataStore } from "@allfather-app/app/modules/core/local-database/settings-data-store";
import { SettingsService } from "@allfather-app/app/modules/core/settings.service";
import { AimingReticle, AimingReticleList } from "@allfather-app/app/modules/HUD/reticle-helper/components/aiming-reticle/aiming-reticles";
import { environment } from "@allfather-app/environments/environment";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { mdiAttachment } from "@mdi/js";
import format from "date-fns/format";
import "dexie-export-import";
import { importInto, ImportOptions } from "dexie-export-import";
import { from, merge, of, Subject } from "rxjs";
import { debounceTime, finalize, map, switchMap, takeUntil } from "rxjs/operators";

const SAVE_SETTINGS_DEBOUNCETIME = 1000;

enum SettingPreview {
    AimingReticle = "aimingreticle",
    MatchTimer = "matchtimer",
    UltTimer = "ulttimer",
    LegendSelectionStats = "legendselectionstats",
    LegendSelectionSuggestions = "legendselectionsuggestions",
}

enum AimingReticlePreview {
    NoWeapon = "noweapon",
    HipfireAssaultRifle = "hipfireassaultrifle",
    HipfirePistol = "hipfirepistol",
    HipfireShotgun = "hipfireshotgun",
    ADSAssaultRifle = "adsassaultrifle",
    ADSPistol = "adspistol",
    ADSShotgun = "adsshotgun",
}

@Component({
    selector: "app-settings-page",
    templateUrl: "./settings-page.component.html",
    styleUrls: ["./settings-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent implements OnInit, OnDestroy {
    //#region Forms
    public settingsForm = this.formBuilder.group({
        [SettingKey.EnableAllInGameHUD]: false,
        inGameHUDFormGroup: this.formBuilder.group({
            [SettingKey.EnableInGameMatchTimerHUD]: [false],
            [SettingKey.EnableInGameUltimateTimerHUD]: [false],
            [SettingKey.EnableInGameInflictionInsightHUD]: [false],
            [SettingKey.EnableInGameAimingReticle]: [false],
            [SettingKey.InGameAimingReticleId]: [AimingReticleList[0].reticleId],
            [SettingKey.InGameAimingReticleColor]: [AimingReticleList[0].hexColor],
            [SettingKey.InGameAimingReticleAlpha]: [AimingReticleList[0].alpha],
            [SettingKey.InGameAimingReticleDynamicHide]: [false],
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
    //#endregion
    /** Which item to preview */
    public selectedPreviewSetting?: SettingPreview;
    /** Which background to show for aiming reticle preview */
    public selectedAimingReticleBackground: AimingReticlePreview = AimingReticlePreview.NoWeapon;
    /** Actual aiming reticle */
    public aimingReticlePreview?: AimingReticle;

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
    public SettingPreview = SettingPreview;
    public AimingReticlePreview = AimingReticlePreview;
    public AimingReticleList = AimingReticleList;
    public mdiAttachment = mdiAttachment;
    //#endregion

    private dbExportFilename = `${environment.DEV ? "DEV_" : ""}allfather_db_${format(new Date(), "yyyy_dd_mm")}.json`;
    private dbExportDirectory = "db_export";
    private _isSaving = false;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
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
                this.updateAimingReticlePreview(
                    allSettings.inGameAimingReticleId as string,
                    allSettings.inGameAimingReticleColor as string,
                    allSettings.inGameAimingReticleAlpha as number
                );
                this.refreshAllFormStates();
            });
    }

    private refreshAllFormStates(): void {
        this.refreshInGameFormHUDState();
        this.refreshLegendSelectHUDFormState();
        this.refreshAimingReticleFormState();
    }

    private updateAimingReticlePreview(
        reticleId: AimingReticle["reticleId"],
        reticleColor: AimingReticle["hexColor"],
        reticleAlpha: AimingReticle["alpha"]
    ): void {
        const aimingReticle = AimingReticleList.find((reticle) => reticle.reticleId === reticleId);
        if (!aimingReticle) return;
        aimingReticle.hexColor = reticleColor;
        aimingReticle.alpha = reticleAlpha;

        this.aimingReticlePreview = undefined;
        this.cdr.detectChanges();

        setTimeout(() => {
            this.aimingReticlePreview = aimingReticle;
            this.cdr.detectChanges();
        }, 10);
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
            .pipe(takeUntil(this.destroy$), debounceTime(SAVE_SETTINGS_DEBOUNCETIME))
            .subscribe(this.saveSettingsChanges.bind(this));
    }

    private refreshInGameFormHUDState(): void {
        if (this.settingsForm.get([SettingKey.EnableAllInGameHUD])?.value) {
            this.inGameHUDFormGroup.enable({ emitEvent: false });
        } else {
            this.inGameHUDFormGroup.disable({ emitEvent: false });
        }
    }

    private refreshAimingReticleFormState(): void {
        const isEnabled = this.inGameHUDFormGroup.get([SettingKey.EnableInGameAimingReticle])?.value;
        const reticleIdForm = this.inGameHUDFormGroup.get(SettingKey.InGameAimingReticleId);
        const reticleColorForm = this.inGameHUDFormGroup.get(SettingKey.InGameAimingReticleColor);
        const reticleAlphaForm = this.inGameHUDFormGroup.get(SettingKey.InGameAimingReticleAlpha);
        const reticleDynamicHideForm = this.inGameHUDFormGroup.get(SettingKey.InGameAimingReticleDynamicHide);

        if (isEnabled) {
            reticleIdForm?.enable({ emitEvent: false });
            reticleColorForm?.enable({ emitEvent: false });
            reticleAlphaForm?.enable({ emitEvent: false });
            reticleDynamicHideForm?.enable({ emitEvent: false });
        } else {
            reticleIdForm?.disable({ emitEvent: false });
            reticleColorForm?.disable({ emitEvent: false });
            reticleAlphaForm?.disable({ emitEvent: false });
            reticleDynamicHideForm?.disable({ emitEvent: false });
        }
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
            .pipe(takeUntil(this.destroy$), debounceTime(SAVE_SETTINGS_DEBOUNCETIME))
            .subscribe(this.saveSettingsChanges.bind(this));
    }

    private refreshLegendSelectHUDFormState(): void {
        if (this.settingsForm.get([SettingKey.EnableAllLegendSelectHUD])?.value) {
            this.legendSelectHUDFormGroup.enable({ emitEvent: false });
        } else {
            this.legendSelectHUDFormGroup.disable({ emitEvent: false });
        }
    }
    //#endregion

    private saveSettingsChanges(changes: unknown): void {
        if (this.isEditing) return;
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

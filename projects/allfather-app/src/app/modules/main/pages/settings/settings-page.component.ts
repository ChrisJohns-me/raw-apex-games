import { APP_NAME } from "@allfather-app/app/common/app";
import { Hotkey } from "@allfather-app/app/common/hotkey";
import { AllSettings, DefaultSetting, SettingKey, SettingValue } from "@allfather-app/app/common/settings";
import { aXNWSVA } from "@allfather-app/app/common/vip";
import { HotkeyService } from "@allfather-app/app/modules/background/hotkey.service";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { FileService } from "@allfather-app/app/modules/core/file.service";
import { WINDOW } from "@allfather-app/app/modules/core/global-window.provider";
import { LocalDatabaseService } from "@allfather-app/app/modules/core/local-database/local-database.service";
import { SettingsDataStore } from "@allfather-app/app/modules/core/local-database/settings-data-store";
import { OverwolfProfileService } from "@allfather-app/app/modules/core/overwolf/overwolf-profile.service";
import { SessionStorageKeys } from "@allfather-app/app/modules/core/session-storage/session-storage-keys";
import { SessionStorageService } from "@allfather-app/app/modules/core/session-storage/session-storage.service";
import { SettingsService } from "@allfather-app/app/modules/core/settings.service";
import { InflictionInsightType } from "@allfather-app/app/modules/HUD/infliction-insight/windows/infliction-insight-window.component";
import { AimingReticle, AimingReticleList } from "@allfather-app/app/modules/HUD/reticle-helper/components/aiming-reticle/aiming-reticles";
import { UltimateTimerType } from "@allfather-app/app/modules/HUD/ult-timer/windows/ult-timer-window.component";
import { Configuration } from "@allfather-app/configs/config.interface";
import { environment } from "@allfather-app/environments/environment";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { mdiAttachment, mdiInformationOutline } from "@mdi/js";
import { isEmpty } from "common/utilities";
import format from "date-fns/format";
import "dexie-export-import";
import { importInto, ImportOptions } from "dexie-export-import";
import { from, merge, of, Subject } from "rxjs";
import { debounceTime, filter, finalize, map, switchMap, take, takeUntil } from "rxjs/operators";
import { MainDesktopWindowService } from "../../windows/main-desktop-window.service";
import { MainInGameWindowService } from "../../windows/main-ingame-window.service";
import { MainPage } from "../main-page";

const SAVE_SETTINGS_DEBOUNCETIME = 1000;

enum SettingPreview {
    AimingReticle = "aimingreticle",
    MinimizeToTray = "minimizetotray",
    MatchTimer = "matchtimer",
    MiniInventory = "miniinventory",
    HealingHelper = "healinghelper",
    UltTimer = "ulttimer",
    InflictionInsight = "inflictioninsight",
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
    /** isVIP: has access to all configuration/settings */
    public aXNWSVA = false;
    public config?: Configuration;
    public hotkeysList?: Hotkey[] = [];
    public editingHotkey: Hotkey | undefined;
    //#region Forms
    public hotKeyFormGroup = this.formBuilder.group({});
    public settingsForm = this.formBuilder.group({
        [SettingKey.EnableLocalDBReporting]: false,
        [SettingKey.MinimizeToTray]: false,
        [SettingKey.EnableAllInGameHUD]: false,
        inGameHUDFormGroup: this.formBuilder.group({
            [SettingKey.EnableInGameMatchTimerHUD]: [false],
            [SettingKey.EnableInGameMiniInventoryHUD]: [false],
            [SettingKey.InflictionInsightType]: [InflictionInsightType.Digits],
            [SettingKey.EnableInGameHealingHelperHUD]: [false],
            [SettingKey.EnableInGameAimingReticle]: [false],
            [SettingKey.UltimateTimerType]: [UltimateTimerType.TimeTotal],
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
    public get [SettingKey.MinimizeToTray](): FormControl {
        return this.settingsForm.get([SettingKey.MinimizeToTray]) as FormControl;
    }
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
    public get [SettingKey.EnableLocalDBReporting](): FormControl {
        return this.settingsForm.get([SettingKey.EnableLocalDBReporting]) as FormControl;
    }
    //#endregion
    /** Which item to preview */
    public get selectedPreviewSetting(): Optional<SettingPreview> {
        return this._selectedPreviewSetting;
    }
    public set selectedPreviewSetting(value: Optional<SettingPreview>) {
        this._selectedPreviewSetting = value;
        this.cdr.detectChanges();
    }
    private _selectedPreviewSetting?: SettingPreview;
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
    public APP_NAME = APP_NAME;
    public SettingKey = SettingKey;
    public SettingPreview = SettingPreview;
    public UltimateTimerTypeList: { key: UltimateTimerType; value: string }[] = [
        {
            key: UltimateTimerType.Disabled,
            value: "Off",
        },
        {
            key: UltimateTimerType.TimeTotal,
            value: "Cooldown Total",
        },
        {
            key: UltimateTimerType.TimeRemaining,
            value: "Cooldown Remaining",
        },
    ];
    public InflictionInsightTypeList: { key: InflictionInsightType; value: string }[] = [
        {
            key: InflictionInsightType.Disabled,
            value: "Off",
        },
        {
            key: InflictionInsightType.Digits,
            value: "Damage Numbers",
        },
        {
            key: InflictionInsightType.Emulated,
            value: "Health Bar",
        },
    ];
    public AimingReticlePreview = AimingReticlePreview;
    public AimingReticleList = AimingReticleList;
    public mdiAttachment = mdiAttachment;
    public mdiInformationOutline = mdiInformationOutline;
    //#endregion

    private dbExportFilename = `${environment.DEV ? "DEV_" : ""}allfatherDB_${format(new Date(), "yyyy-MM-dd")}.json`;
    private dbExportDirectory = "db_export";
    private get gameLogFilename() {
        return `gamelog_${format(new Date(), "yyyy-MM-dd_hh-mmaa")}.log`;
    }
    private _isSaving = false;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly configuration: ConfigurationService,
        private readonly fileService: FileService,
        private readonly formBuilder: FormBuilder,
        private readonly hotkey: HotkeyService,
        private readonly localDatabase: LocalDatabaseService,
        private readonly mainDesktopWindow: MainDesktopWindowService,
        private readonly mainInGameWindow: MainInGameWindowService,
        private readonly overwolfProfile: OverwolfProfileService,
        private readonly sessionStorage: SessionStorageService,
        private readonly settings: SettingsService,
        @Inject(WINDOW) private window: Window
    ) {
        this.configuration.config$.pipe(takeUntil(this.destroy$)).subscribe((config) => (this.config = config));
        // Setup VIP
        this.overwolfProfile
            .getCurrentUser()
            .pipe(
                takeUntil(this.destroy$),
                filter((userData) => !isEmpty(userData?.username)),
                map((userData) => userData.username),
                take(1)
            )
            .subscribe((un) => (this.aXNWSVA = aXNWSVA(un!)));
    }

    public ngOnInit(): void {
        this.setupHotkeyForm();
        this.setupMinimizeToTrayForm();
        this.setupInGameHUDForm();
        this.setupLegendSelectHUDForm();
        this.setupLocalDBReportingForm();
        this.setupSettingsListener();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onAboutClick(): void {
        this.mainDesktopWindow.goToPage(MainPage.About);
        this.mainInGameWindow.goToPage(MainPage.About);
    }

    public exportGameLog(): void {
        const filePath = this.gameLogFilename;
        const lastGameLog = this.sessionStorage.get(SessionStorageKeys.LastGameLog);
        if (isEmpty(lastGameLog)) return this.window.alert(`No game log found.\nGame logs are cleared when Allfather closes.`);

        this.fileService
            .saveFile$(filePath, lastGameLog!)
            .pipe(takeUntil(this.destroy$))
            .subscribe((fullFilePath) => this.window.alert(`Last game log was saved to:\n "${fullFilePath}"`));
    }

    public exportLocalDatabase(): void {
        this.isExportingLocalDatabase = true;
        const filePath = `${this.dbExportDirectory}/${this.dbExportFilename}`;
        this.fileService
            .ensureDirectory$(this.dbExportDirectory)
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.localDatabase.exportDatabaseBlob$()),
                switchMap((blobContent) => from(blobContent.text())),
                switchMap((jsonContent) => this.fileService.saveFile$(filePath, jsonContent)),
                finalize(() => (this.isExportingLocalDatabase = false))
            )
            .subscribe((fullFilePath) => {
                this.window.alert(`Local database was exported to:\n "${fullFilePath}"`);
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
                this.window.alert(`Local database was imported.`);
                this.isImportingLocalDatabase = false;
            });
    }

    public onHotkeyChange(hotkey: Hotkey): void {
        this.hotkey.assignHotKey(hotkey).subscribe(() => this.refreshHotkeys());
    }

    private setupSettingsListener(): void {
        const applyAllSettingsFn = (settings: AllSettings): void => {
            this.settingsForm.get([SettingKey.MinimizeToTray])?.patchValue(settings[SettingKey.MinimizeToTray], { emitEvent: false });
            this.settingsForm
                .get([SettingKey.EnableLocalDBReporting])
                ?.patchValue(settings[SettingKey.EnableLocalDBReporting], { emitEvent: false });
            this.settingsForm
                .get([SettingKey.EnableAllInGameHUD])
                ?.patchValue(settings[SettingKey.EnableAllInGameHUD], { emitEvent: false });
            this.settingsForm
                .get([SettingKey.EnableAllLegendSelectHUD])
                ?.patchValue(settings[SettingKey.EnableAllLegendSelectHUD], { emitEvent: false });

            this.inGameHUDFormGroup.patchValue(settings, { emitEvent: false });
            this.legendSelectHUDFormGroup.patchValue(settings, { emitEvent: false });
        };

        this.settings
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
        this.refreshInGameHUDFormState();
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

    //#region HotKeys
    private setupHotkeyForm(): void {
        this.refreshHotkeys();
    }

    private refreshHotkeys(): void {
        this.hotkey.getGameHotkeys().subscribe((hotkeys) => {
            this.hotkeysList = hotkeys;
            this.cdr.detectChanges();
        });
    }
    //#endregion

    //#region General
    private setupMinimizeToTrayForm(): void {
        this.minimizeToTray.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                map((value) => ({ [SettingKey.MinimizeToTray]: value })),
                debounceTime(SAVE_SETTINGS_DEBOUNCETIME)
            )
            .subscribe(this.saveSettingsChanges.bind(this));
    }
    //#endregion

    //#region In Game HUD
    private setupInGameHUDForm(): void {
        this.settingsForm
            .get([SettingKey.EnableAllInGameHUD])
            ?.valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.refreshInGameHUDFormState();
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

    private refreshInGameHUDFormState(): void {
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

    //#region Local Reporting
    private setupLocalDBReportingForm(): void {
        this.enableLocalDBReporting.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                map((value) => ({ [SettingKey.EnableLocalDBReporting]: value })),
                debounceTime(SAVE_SETTINGS_DEBOUNCETIME)
            )
            .subscribe(this.saveSettingsChanges.bind(this));
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

        this.settings
            .bulkStoreSettings$(bulkSettings)
            .pipe(finalize(() => (this.isSaving = false)))
            .subscribe();
    }
}

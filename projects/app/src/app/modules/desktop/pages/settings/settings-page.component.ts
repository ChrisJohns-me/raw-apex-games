import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { mdiAttachment, mdiInformationOutline } from "@mdi/js";
import { APP_NAME } from "@app/app/common/app";
import { Hotkey } from "@app/app/common/hotkey";
import { AllSettings, DefaultSetting, SettingKey, SettingValue } from "@app/app/common/settings";
import { aXNWSVA } from "@app/app/common/vip";
import { HotkeyService } from "@app/app/modules/background/hotkey.service";
import { ConfigurationService } from "@app/app/modules/core/configuration.service";
import { FileService } from "@app/app/modules/core/file.service";
import { WINDOW } from "@app/app/modules/core/global-window.provider";
import { LocalDatabaseService } from "@app/app/modules/core/local-database/local-database.service";
import { SettingsDataStore } from "@app/app/modules/core/local-database/settings-data-store";
import { OverwolfProfileService } from "@app/app/modules/core/overwolf/overwolf-profile.service";
import { SessionStorageKeys } from "@app/app/modules/core/session-storage/session-storage-keys";
import { SessionStorageService } from "@app/app/modules/core/session-storage/session-storage.service";
import { SettingsService } from "@app/app/modules/core/settings.service";
import { InGameWindowService } from "@app/app/modules/in-game/windows/in-game-window.service";
import { Configuration } from "@app/configs/config.interface";
import { environment } from "@app/environments/environment";
import { isEmpty } from "common/utilities";
import format from "date-fns/format";
import "dexie-export-import";
import { ImportOptions, importInto } from "dexie-export-import";
import { Subject, from, merge, of } from "rxjs";
import { debounceTime, filter, finalize, map, switchMap, take, takeUntil } from "rxjs/operators";
import { DesktopWindowService } from "../../windows/desktop-window.service";
import { MainPage } from "../main-page";

const SAVE_SETTINGS_DEBOUNCETIME = 1000;

enum SettingPreview {
    MinimizeToTray = "minimizetotray",
    MiniInventory = "miniinventory",
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
            [SettingKey.EnableInGameMiniInventoryHUD]: [false],
        }),
    });
    public get [SettingKey.MinimizeToTray](): UntypedFormControl {
        return this.settingsForm.get([SettingKey.MinimizeToTray]) as UntypedFormControl;
    }
    public get [SettingKey.EnableAllInGameHUD](): UntypedFormControl {
        return this.settingsForm.get([SettingKey.EnableAllInGameHUD]) as UntypedFormControl;
    }
    public get inGameHUDFormGroup(): UntypedFormGroup {
        return this.settingsForm.get("inGameHUDFormGroup") as UntypedFormGroup;
    }
    public get [SettingKey.EnableLocalDBReporting](): UntypedFormControl {
        return this.settingsForm.get([SettingKey.EnableLocalDBReporting]) as UntypedFormControl;
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
    public mdiAttachment = mdiAttachment;
    public mdiInformationOutline = mdiInformationOutline;
    //#endregion

    private dbExportFilename = `${environment.DEV ? "DEV_" : ""}rawApexGamesDB_${format(new Date(), "yyyy-MM-dd")}.json`;
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
        private readonly formBuilder: UntypedFormBuilder,
        private readonly hotkey: HotkeyService,
        private readonly localDatabase: LocalDatabaseService,
        private readonly desktopWindow: DesktopWindowService,
        private readonly inGameWindow: InGameWindowService,
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
        this.setupLocalDBReportingForm();
        this.setupSettingsListener();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onAboutClick(): void {
        this.desktopWindow.goToPage(MainPage.About);
    }

    public exportGameLog(): void {
        const filePath = this.gameLogFilename;
        const lastGameLog = this.sessionStorage.get(SessionStorageKeys.LastGameLog);
        if (isEmpty(lastGameLog)) return this.window.alert(`No game log found.\nGame logs are cleared when Raw closes.`);

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

            this.inGameHUDFormGroup.patchValue(settings, { emitEvent: false });
        };

        this.settings
            .streamAllSettings$()
            .pipe(takeUntil(this.destroy$))
            .subscribe((allSettings) => {
                applyAllSettingsFn(allSettings);
                this.refreshAllFormStates();
            });
    }

    private refreshAllFormStates(): void {
        this.refreshInGameHUDFormState();
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

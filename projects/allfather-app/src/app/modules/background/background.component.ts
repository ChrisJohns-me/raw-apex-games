import { APP_NAME } from "@allfather-app/app/common/app";
import { SettingKey } from "@allfather-app/app/common/settings";
import { environment } from "@allfather-app/environments/environment";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { HotkeyEnum } from "../../common/hotkey";
import { GameProcessService } from "../core/game-process.service";
import { OverwolfExtensionsService } from "../core/overwolf/overwolf-extensions.service";
import { SettingsService } from "../core/settings.service";
import { DevelopmentToolsWindowService } from "../development-tools/windows/development-tools-window.service";
import { MainDesktopWindowService } from "../main/windows/main-desktop-window.service";
import { MainInGameWindowService } from "../main/windows/main-ingame-window.service";
import { BackgroundService } from "./background.service";
import { CaptureControllerService } from "./capture-controller.service";
import { HotkeyService } from "./hotkey.service";
import { HUDWindowControllerService } from "./hud-window-controller.service";
import { SystemTrayService } from "./system-tray.service";

const AUTOOPEN_DEV_TOOLS = false;

@Component({
    selector: "app-background",
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundComponent implements OnInit, OnDestroy {
    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly captureController: CaptureControllerService,
        private readonly developmentToolsWindow: DevelopmentToolsWindowService,
        private readonly gameProcess: GameProcessService,
        private readonly hotkey: HotkeyService,
        private readonly hudWindowController: HUDWindowControllerService,
        private readonly mainDesktopWindow: MainDesktopWindowService,
        private readonly mainInGameWindow: MainInGameWindowService,
        private readonly overwolfExtensions: OverwolfExtensionsService,
        private readonly settings: SettingsService,
        private readonly systemTray: SystemTrayService,
        private readonly titleService: Title,
        public readonly backgroundService: BackgroundService
    ) {
        this.titleService.setTitle(`${APP_NAME} - Background`);
        this.setupSystemTray();
        this.setupAppLaunchEvents();
        this.setupHotkeys();
    }

    public ngOnInit(): void {
        this.setupOverwolfWindows();
        this.hudWindowController.startWatchEvents();
        // this.captureController.startWatchEvents();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupOverwolfWindows(): void {
        if (AUTOOPEN_DEV_TOOLS && environment.allowDevTools) {
            this.developmentToolsWindow.open().pipe(takeUntil(this.destroy$)).subscribe();
        }

        this.mainDesktopWindow.setIsStarting(true);
        this.mainInGameWindow.setIsStarting(true);
        this.mainDesktopWindow.open().pipe(takeUntil(this.destroy$)).subscribe();
        this.mainInGameWindow.open().pipe(takeUntil(this.destroy$)).subscribe();
    }

    private setupSystemTray(): void {
        this.systemTray.initTray();
    }

    private setupAppLaunchEvents(): void {
        this.overwolfExtensions.appLaunchTriggeredEvent$.pipe(takeUntil(this.destroy$)).subscribe((appLaunchTriggeredEvent) => {
            console.log(`[BackgroundComponent] App Launch Triggered:`, appLaunchTriggeredEvent);
            switch (appLaunchTriggeredEvent.origin) {
                case "dock":
                    if (this.gameProcess.isInFocus$.value) {
                        this.toggleMainInGameWindow();
                    } else {
                        this.toggleMainDesktopWindow();
                    }
                    break;
            }
        });
    }

    private setupHotkeys(): void {
        this.hotkey.onHotkeyPressed$.pipe(takeUntil(this.destroy$)).subscribe((hotkey) => {
            console.log(`[BackgroundComponent] Hotkey Triggered:`, hotkey);
            switch (hotkey.hotkeyName) {
                case HotkeyEnum.ToggleMainInGame:
                    this.toggleMainInGameWindow();
                    break;
            }
        });
    }

    //#region App Actions
    /**
     * Toggles the main desktop window:
     *  - If the setting is set to minimizeToTray, the main window toggles between closed and restored.
     *  - If the setting is not set to minimizeToTray, the main window toggles between minimized and restored.
     */
    private toggleMainDesktopWindow(): void {
        this.settings
            .getSetting$<boolean>(SettingKey.MinimizeToTray)
            .pipe(
                takeUntil(this.destroy$),
                map((minimizeToTraySetting) => minimizeToTraySetting?.value ?? false),
                switchMap((minimizeToTray) => this.mainDesktopWindow.toggle(minimizeToTray))
            )
            .subscribe();
    }

    private toggleMainInGameWindow(): void {
        this.mainInGameWindow.toggle(true).pipe(takeUntil(this.destroy$)).subscribe();
    }
    //#endregion
}

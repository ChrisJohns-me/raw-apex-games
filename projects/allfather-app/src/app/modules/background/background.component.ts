import { APP_NAME } from "@allfather-app/app/common/app";
import { GameProcessService } from "@allfather-app/app/common/services/game-process.service";
import { OverwolfExtensionsService } from "@allfather-app/app/common/services/overwolf/overwolf-extensions.service";
import { environment } from "@allfather-app/environments/environment";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";
import { HotkeyEnum } from "../core/hotkey";
import { DevelopmentToolsWindowService } from "../development-tools/windows/development-tools-window.service";
import { MainWindowService } from "../main/windows/main-window.service";
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
        private readonly mainWindow: MainWindowService,
        private readonly overwolfExtensions: OverwolfExtensionsService,
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
        this.setupUIWindows();
        this.hudWindowController.startWatchEvents();
        // this.captureController.startWatchEvents();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupUIWindows(): void {
        if (AUTOOPEN_DEV_TOOLS && environment.allowDevTools) {
            this.developmentToolsWindow.open().pipe(takeUntil(this.destroy$)).subscribe();
        }

        this.mainWindow.setIsStarting(true);
        this.mainWindow.open().pipe(takeUntil(this.destroy$)).subscribe();
    }

    private setupSystemTray(): void {
        this.systemTray.initTray();
    }

    private setupAppLaunchEvents(): void {
        this.overwolfExtensions.appLaunchTriggeredEvent$.pipe(takeUntil(this.destroy$)).subscribe((appLaunchTriggeredEvent) => {
            console.log(`[BackgroundComponent] App Launch Triggered:`, appLaunchTriggeredEvent);
            switch (appLaunchTriggeredEvent.origin) {
                case "dock":
                    this.toggleMainWindow();
                    break;
            }
        });
    }

    private setupHotkeys(): void {
        this.hotkey.onHotkeyPressed$.pipe(takeUntil(this.destroy$)).subscribe((hotkey) => {
            console.log(`[BackgroundComponent] Hotkey Triggered:`, hotkey);
            switch (hotkey.hotkeyName) {
                case HotkeyEnum.ToggleMain:
                    this.toggleMainWindow();
                    break;
            }
        });
    }

    //#region App Actions
    /**
     * Toggles the main window:
     *  - If the game is focused, the main window toggles between closed and restored.
     *  - If the game is not focused, the main window toggles between minimized and restored.
     * @todo Unit test this method.
     */
    private toggleMainWindow(): void {
        this.gameProcess.isInFocus$
            .pipe(
                takeUntil(this.destroy$),
                switchMap((isInFocus) => this.mainWindow.toggle(isInFocus))
            )
            .subscribe();
    }
    //#endregion
}

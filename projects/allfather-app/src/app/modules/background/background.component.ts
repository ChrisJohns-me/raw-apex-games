import { APP_NAME } from "@allfather-app/app/common/app";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MainWindowService } from "../main/windows/main-window.service";
import { BackgroundService } from "./background.service";
import { HUDWindowControllerService } from "./hud-window-controller.service";
import { SystemTrayService } from "./system-tray.service";

@Component({
    selector: "app-background",
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundComponent implements OnInit, OnDestroy {
    private readonly isDestroyed$ = new Subject<void>();

    constructor(
        private readonly hudWindowController: HUDWindowControllerService,
        private readonly mainWindow: MainWindowService,
        private readonly systemTray: SystemTrayService,
        private readonly titleService: Title,
        public readonly backgroundService: BackgroundService
    ) {
        this.titleService.setTitle(`${APP_NAME} - Background`);
        this.setupSystemTray();
    }

    public ngOnInit(): void {
        this.setupUIWindows();
        this.hudWindowController.startWatchEvents();
    }

    public ngOnDestroy(): void {
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
    }

    private setupUIWindows(): void {
        // if (environment.allowDevTools) this.developmentToolsWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();

        this.mainWindow.setIsStarting(true);
        this.mainWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();
    }

    private setupSystemTray(): void {
        this.systemTray.initTray();
    }
}

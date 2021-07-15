import { Injectable } from "@angular/core";
import { BaseService } from "@shared-app/services/base-service.abstract";
import { OWSystemTrayMenuItem } from "@shared-app/services/overwolf";
import { OverwolfExtensionsService } from "@shared-app/services/overwolf/overwolf-extensions.service";
import { OverwolfSystemTrayService } from "@shared-app/services/overwolf/overwolf-system-tray.service";
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { APP_NAME } from "@siren-app/app/common/app";
import { environment } from "@siren-app/environments/environment";
import { exhaustiveEnumSwitch } from "common/utilities/switch";
import { of } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { WindowName } from "../core/window-name";
import { DevelopmentToolsWindowService } from "../development-tools/windows/development-tools-window.service";
import { MainPage } from "../main/pages/main-page";
import { MainWindowService } from "../main/windows/main-window.service";

export enum SystemTrayItemKey {
    Main = "main",
    DevelopmentTools = "development-tools",
    Settings = "settings",
    UpdateApp = "update-app",
    RestartApp = "restart-app",
    ExitApp = "exit-app",
}

const MENUITEMS: OWSystemTrayMenuItem[] = [
    {
        label: "Main",
        id: SystemTrayItemKey.Main,
    },
    {
        label: "Settings",
        id: SystemTrayItemKey.Settings,
    },
];
const DEVTOOLS_MENUITEMS: OWSystemTrayMenuItem[] = [
    {
        label: "Development Tools",
        id: WindowName.DevelopmentTools,
    },
];
const FOOTER_MENUITEMS: OWSystemTrayMenuItem[] = [
    {
        label: `Restart ${APP_NAME}`,
        id: SystemTrayItemKey.RestartApp,
    },
    // {
    //     label: `Check for updates`,
    //     id: SystemTrayItemKey.UpdateApp,
    //     enabled: false,
    // },
    {
        label: `Exit ${APP_NAME}`,
        id: SystemTrayItemKey.ExitApp,
    },
];

@Injectable({
    providedIn: "root",
    deps: [DevelopmentToolsWindowService, MainWindowService, OverwolfExtensionsService, OverwolfSystemTrayService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("SystemTrayService", SystemTrayService, deps),
})
export class SystemTrayService extends BaseService {
    private menuItems: OWSystemTrayMenuItem[] = [];

    constructor(
        private readonly developmentToolsWindow: DevelopmentToolsWindowService,
        private readonly mainWindow: MainWindowService,
        private readonly overwolfExtensions: OverwolfExtensionsService,
        private readonly overwolfSystemTray: OverwolfSystemTrayService
    ) {
        super();

        const SEPARATOR = { label: "-" };
        this.menuItems.push(...MENUITEMS);
        if (environment.allowDevTools) this.menuItems.push(SEPARATOR, ...DEVTOOLS_MENUITEMS);
        this.menuItems.push(SEPARATOR, ...FOOTER_MENUITEMS);

        this.overwolfSystemTray.systemTrayIconClicked$.pipe(takeUntil(this.destroy$)).subscribe(this.onSystemTrayIconClicked.bind(this));
        this.overwolfSystemTray.systemTrayIconDoubleClicked$
            .pipe(takeUntil(this.destroy$))
            .subscribe(this.onSystemTrayIconDoubleClicked.bind(this));
        this.overwolfSystemTray.menuItemClicked$
            .pipe(takeUntil(this.destroy$))
            .subscribe((e) => this.onMenuItemClicked(e as SystemTrayItemKey));
    }

    public initTray(): void {
        this.overwolfSystemTray
            .setTray({ menu_items: this.menuItems })
            .pipe(
                takeUntil(this.destroy$),
                catchError((err) => {
                    console.error(`[${this.constructor.name}] Unable to create system tray.`, err);
                    return of(false);
                })
            )
            .subscribe();
    }

    private onSystemTrayIconClicked(): void {}

    private onSystemTrayIconDoubleClicked(): void {
        this.mainWindow.restore().pipe(takeUntil(this.destroy$)).subscribe();
    }

    private onMenuItemClicked(menuItem: SystemTrayItemKey): void {
        switch (menuItem) {
            case SystemTrayItemKey.Main:
                this.mainWindow.open(MainPage.Dashboard).pipe(takeUntil(this.destroy$)).subscribe();
                break;
            case SystemTrayItemKey.DevelopmentTools:
                this.developmentToolsWindow.open().pipe(takeUntil(this.destroy$)).subscribe();
                break;
            case SystemTrayItemKey.Settings:
                this.mainWindow.open(MainPage.Settings).pipe(takeUntil(this.destroy$)).subscribe();
                break;
            case SystemTrayItemKey.RestartApp:
                this.overwolfExtensions.relaunchApp();
                break;
            case SystemTrayItemKey.UpdateApp:
                console.error("DOES NOT EXIST");
                break;
            case SystemTrayItemKey.ExitApp:
                console.trace(`[SystemTrayService] Requesting exit from MainWindowService`);
                this.mainWindow.requestExit();
                break;
            default:
                exhaustiveEnumSwitch(menuItem);
        }
    }
}

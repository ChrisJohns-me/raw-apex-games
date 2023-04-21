import { environment } from "#app/../environments/environment.js";
import { APP_NAME } from "#app/models/app.js";
import { OverwolfWindowName } from "#app/models/overwolf-window.js";
import { BaseService } from "#app/modules/core/base-service.abstract.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { exhaustiveEnumSwitch } from "#shared/utilities/switch.js";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { OWSystemTrayMenuItem } from "../core/overwolf/index.js";
import { OverwolfExtensionsService } from "../core/overwolf/overwolf-extensions.service.js";
import { OverwolfSystemTrayService } from "../core/overwolf/overwolf-system-tray.service.js";
import { MainPage } from "../desktop/pages/main-page.js";
import { DesktopWindowService } from "../desktop/windows/desktop-window.service.js";
import { DevelopmentToolsWindowService } from "../development-tools/windows/development-tools-window.service.js";

export enum SystemTrayItemKey {
    Main = "main",
    DevelopmentTools = "development-tools",
    MatchExplorer = "matchexplorer",
    Charting = "charting",
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
        label: "Match Explorer",
        id: SystemTrayItemKey.MatchExplorer,
    },
    {
        label: "Settings",
        id: SystemTrayItemKey.Settings,
    },
];
const DEVTOOLS_MENUITEMS: OWSystemTrayMenuItem[] = [
    {
        label: "Development Tools",
        id: OverwolfWindowName.DevelopmentTools,
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
    deps: [DevelopmentToolsWindowService, DesktopWindowService, OverwolfExtensionsService, OverwolfSystemTrayService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("SystemTrayService", SystemTrayService, deps),
})
export class SystemTrayService extends BaseService {
    private menuItems: OWSystemTrayMenuItem[] = [];

    constructor(
        private readonly developmentToolsWindow: DevelopmentToolsWindowService,
        private readonly desktopWindow: DesktopWindowService,
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
        this.desktopWindow.restore().pipe(takeUntil(this.destroy$)).subscribe();
    }

    private onMenuItemClicked(menuItem: SystemTrayItemKey): void {
        switch (menuItem) {
            case SystemTrayItemKey.Main:
                this.desktopWindow.open(MainPage.Dashboard).pipe(takeUntil(this.destroy$)).subscribe();
                break;
            case SystemTrayItemKey.DevelopmentTools:
                this.developmentToolsWindow.open().pipe(takeUntil(this.destroy$)).subscribe();
                break;
            case SystemTrayItemKey.MatchExplorer:
                this.desktopWindow.open(MainPage.MatchExplorer).pipe(takeUntil(this.destroy$)).subscribe();
                break;
            case SystemTrayItemKey.Charting:
                this.desktopWindow.open(MainPage.Charting).pipe(takeUntil(this.destroy$)).subscribe();
                break;
            case SystemTrayItemKey.Settings:
                this.desktopWindow.open(MainPage.Settings).pipe(takeUntil(this.destroy$)).subscribe();
                break;
            case SystemTrayItemKey.RestartApp:
                this.overwolfExtensions.relaunchApp();
                break;
            case SystemTrayItemKey.UpdateApp:
                console.error("DOES NOT EXIST");
                break;
            case SystemTrayItemKey.ExitApp:
                console.trace(`[SystemTrayService] Requesting exit from MainWindowService`);
                this.desktopWindow.requestExit();
                break;
            default:
                exhaustiveEnumSwitch(menuItem);
        }
    }
}

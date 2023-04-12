import { Injectable } from "@angular/core";
import { APP_NAME } from "@raw-apex-games-app/app/common/app";
import { OverwolfWindowName } from "@raw-apex-games-app/app/common/overwolf-window";
import { SingletonServiceProviderFactory } from "@raw-apex-games-app/app/singleton-service.provider.factory";
import { environment } from "@raw-apex-games-app/environments/environment";
import { exhaustiveEnumSwitch } from "common/utilities/switch";
import { of } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { MatchTimerWindowService } from "../HUD/match-timer/windows/match-timer-window.service";
import { BaseService } from "../core/base-service.abstract";
import { OWSystemTrayMenuItem } from "../core/overwolf";
import { OverwolfExtensionsService } from "../core/overwolf/overwolf-extensions.service";
import { OverwolfSystemTrayService } from "../core/overwolf/overwolf-system-tray.service";
import { DevelopmentToolsWindowService } from "../development-tools/windows/development-tools-window.service";
import { MainPage } from "../main/pages/main-page";
import { MainDesktopWindowService } from "../main/windows/main-desktop-window.service";

export enum SystemTrayItemKey {
    Main = "main",
    DevelopmentTools = "development-tools",
    HUDMatchTimer = "hud-match-timer",
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
    deps: [
        DevelopmentToolsWindowService,
        MainDesktopWindowService,
        MatchTimerWindowService,
        OverwolfExtensionsService,
        OverwolfSystemTrayService,
    ],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("SystemTrayService", SystemTrayService, deps),
})
export class SystemTrayService extends BaseService {
    private menuItems: OWSystemTrayMenuItem[] = [];

    constructor(
        private readonly developmentToolsWindow: DevelopmentToolsWindowService,
        private readonly mainDesktopWindow: MainDesktopWindowService,
        private readonly matchTimerWindow: MatchTimerWindowService,
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
        this.mainDesktopWindow.restore().pipe(takeUntil(this.destroy$)).subscribe();
    }

    private onMenuItemClicked(menuItem: SystemTrayItemKey): void {
        switch (menuItem) {
            case SystemTrayItemKey.Main:
                this.mainDesktopWindow.open(MainPage.Dashboard).pipe(takeUntil(this.destroy$)).subscribe();
                break;
            case SystemTrayItemKey.DevelopmentTools:
                this.developmentToolsWindow.open().pipe(takeUntil(this.destroy$)).subscribe();
                break;
            case SystemTrayItemKey.HUDMatchTimer:
                this.matchTimerWindow.open().pipe(takeUntil(this.destroy$)).subscribe();
                break;
            case SystemTrayItemKey.MatchExplorer:
                this.mainDesktopWindow.open(MainPage.MatchExplorer).pipe(takeUntil(this.destroy$)).subscribe();
                break;
            case SystemTrayItemKey.Charting:
                this.mainDesktopWindow.open(MainPage.Charting).pipe(takeUntil(this.destroy$)).subscribe();
                break;
            case SystemTrayItemKey.Settings:
                this.mainDesktopWindow.open(MainPage.Settings).pipe(takeUntil(this.destroy$)).subscribe();
                break;
            case SystemTrayItemKey.RestartApp:
                this.overwolfExtensions.relaunchApp();
                break;
            case SystemTrayItemKey.UpdateApp:
                console.error("DOES NOT EXIST");
                break;
            case SystemTrayItemKey.ExitApp:
                console.trace(`[SystemTrayService] Requesting exit from MainWindowService`);
                this.mainDesktopWindow.requestExit();
                break;
            default:
                exhaustiveEnumSwitch(menuItem);
        }
    }
}
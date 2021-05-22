import { APP_NAME } from "@allfather-app/app/common/app";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { environment } from "@allfather-app/environments/environment";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { exhaustiveEnumSwitch } from "shared/utilities/switch";
import { AllfatherService } from "../core/allfather-service.abstract";
import { OWSystemTrayMenuItem } from "../core/overwolf";
import { OverwolfExtensionsService } from "../core/overwolf/overwolf-extensions.service";
import { OverwolfSystemTrayService } from "../core/overwolf/overwolf-system-tray.service";
import { WindowName } from "../core/_refactor/ui-window";
import { DevelopmentToolsWindowService } from "../development-tools/windows/development-tools-window.service";
import { InflictionInsightWindowService } from "../HUD/infliction-insight/windows/infliction-insight-window.service";
import { MatchTimerWindowService } from "../HUD/match-timer/windows/match-timer-window.service";
import { UltTimerWindowService } from "../HUD/ult-timer/windows/ult-timer-window.service";
import { LegendSelectAssistWindowService } from "../legend-select-assist/windows/legend-select-assist-window.service";
import { MainPage } from "../main/pages/main-page";
import { MainWindowService } from "../main/windows/main-window.service";
import { BackgroundService } from "./background.service";

export enum SystemTrayItemKey {
    Main = "main",
    DevelopmentTools = "development-tools",
    HUDInflictionInsight = "hud-infliction-insight",
    HUDMatchTimer = "hud-match-timer",
    HUDUltTimer = "hud-ult-timer",
    LegendSelectAssist = "legend-select-assist",
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
        sub_items: [
            {
                label: "Development Tools",
                id: WindowName.DevelopmentTools,
            },
            {
                label: "Ultimate Timer",
                id: WindowName.DevelopmentTools,
            },
            {
                label: "Match Timer",
                id: WindowName.DevelopmentTools,
            },
            {
                label: "Infliction Insight",
                id: WindowName.DevelopmentTools,
            },
            {
                label: "Legend Select Assist",
                id: WindowName.DevelopmentTools,
            },
        ],
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
        BackgroundService,
        DevelopmentToolsWindowService,
        InflictionInsightWindowService,
        LegendSelectAssistWindowService,
        MainWindowService,
        MatchTimerWindowService,
        OverwolfExtensionsService,
        OverwolfSystemTrayService,
        UltTimerWindowService,
    ],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("SystemTrayService", SystemTrayService, deps),
})
export class SystemTrayService extends AllfatherService {
    private menuItems: OWSystemTrayMenuItem[] = [];

    constructor(
        private readonly backgroundService: BackgroundService,
        private readonly developmentToolsWindow: DevelopmentToolsWindowService,
        private readonly inflictionInsightWindow: InflictionInsightWindowService,
        private readonly legendSelectAssistWindow: LegendSelectAssistWindowService,
        private readonly mainWindow: MainWindowService,
        private readonly matchTimerWindow: MatchTimerWindowService,
        private readonly overwolfExtensions: OverwolfExtensionsService,
        private readonly overwolfSystemTray: OverwolfSystemTrayService,
        private readonly ultTimerWindow: UltTimerWindowService
    ) {
        super();

        const SEPARATOR = { label: "-" };
        this.menuItems.push(...MENUITEMS);
        if (environment.allowDevTools) this.menuItems.push(SEPARATOR, ...DEVTOOLS_MENUITEMS);
        this.menuItems.push(SEPARATOR, ...FOOTER_MENUITEMS);

        this.overwolfSystemTray.systemTrayIconClicked$
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe(this.onSystemTrayIconClicked.bind(this));
        this.overwolfSystemTray.systemTrayIconDoubleClicked$
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe(this.onSystemTrayIconDoubleClicked.bind(this));
        this.overwolfSystemTray.menuItemClicked$
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe((e) => this.onMenuItemClicked(e as SystemTrayItemKey));
    }

    public initTray(): void {
        this.overwolfSystemTray
            .setTray({ menu_items: this.menuItems })
            .pipe(
                takeUntil(this.isDestroyed$),
                catchError((err) => {
                    console.error(`[${this.constructor.name}] Unable to create system tray.`, err);
                    return of(false);
                })
            )
            .subscribe();
    }

    private onSystemTrayIconClicked(): void {}

    private onSystemTrayIconDoubleClicked(): void {
        this.mainWindow.restore().pipe(takeUntil(this.isDestroyed$)).subscribe();
    }

    private onMenuItemClicked(menuItem: SystemTrayItemKey): void {
        switch (menuItem) {
            case SystemTrayItemKey.Main:
                this.mainWindow.open(MainPage.Dashboard).pipe(takeUntil(this.isDestroyed$)).subscribe();
                break;
            case SystemTrayItemKey.DevelopmentTools:
                this.developmentToolsWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();
                break;
            case SystemTrayItemKey.HUDInflictionInsight:
                this.inflictionInsightWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();
                break;
            case SystemTrayItemKey.HUDMatchTimer:
                this.matchTimerWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();
                break;
            case SystemTrayItemKey.HUDUltTimer:
                this.ultTimerWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();
                break;
            case SystemTrayItemKey.LegendSelectAssist:
                this.legendSelectAssistWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();
                break;
            case SystemTrayItemKey.MatchExplorer:
                this.mainWindow.open(MainPage.MatchExplorer).pipe(takeUntil(this.isDestroyed$)).subscribe();
                break;
            case SystemTrayItemKey.Charting:
                this.mainWindow.open(MainPage.Charting).pipe(takeUntil(this.isDestroyed$)).subscribe();
                break;
            case SystemTrayItemKey.Settings:
                this.mainWindow.open(MainPage.Settings).pipe(takeUntil(this.isDestroyed$)).subscribe();
                break;
            case SystemTrayItemKey.RestartApp:
                this.overwolfExtensions.relaunchApp();
                break;
            case SystemTrayItemKey.UpdateApp:
                console.error("DOES NOT EXIST");
                break;
            case SystemTrayItemKey.ExitApp:
                this.backgroundService.requestExit();
                break;
            default:
                exhaustiveEnumSwitch(menuItem);
        }
    }
}

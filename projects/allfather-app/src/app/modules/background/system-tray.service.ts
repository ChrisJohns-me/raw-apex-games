import { APP_NAME } from "@allfather-app/app/shared/models/app";
import { environment } from "@allfather-app/environments/environment";
import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { of } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { exhaustiveEnumSwitch } from "shared/utilities/switch";
import { AllfatherService } from "../core/allfather-service.abstract";
import { GameService } from "../core/game.service";
import { LocalStorageService } from "../core/local-storage/local-storage.service";
import { OWSystemTrayMenuItem } from "../core/overwolf";
import { OverwolfExtensionService } from "../core/overwolf/overwolf-extension.service";
import { OverwolfSystemTrayService } from "../core/overwolf/overwolf-system-tray.service";
import { WindowName } from "../core/_refactor/ui-window";
import { DevelopmentToolsWindowService } from "../development-tools/windows/development-tools-window.service";
import { InflictionInsightWindowService } from "../in-game/infliction-insight/windows/infliction-insight-window.service";
import { MatchTimerWindowService } from "../in-game/match-timer/windows/match-timer-window.service";
import { UltTimerWindowService } from "../in-game/ult-timer/windows/ult-timer-window.service";
import { LegendSelectAssistWindowService } from "../legend-select-assist/windows/legend-select-assist-window.service";
import { MainWindowService } from "../main/main-window.service";
import { BackgroundService } from "./background.service";

export enum SystemTrayItemKey {
    Main = "main",
    DevelopmentTools = "development-tools",
    InGameInflictionInsight = "in-game-infliction-insight",
    InGameMatchTimer = "in-game-match-timer",
    InGameUltTimer = "in-game-ult-timer",
    LegendSelectAssist = "legend-select-assist",
    MapExplorer = "mapexplorer",
    Preferences = "preferences",
    Exit = "exit",
}

const MENUITEMS: OWSystemTrayMenuItem[] = [
    {
        label: "Main",
        id: SystemTrayItemKey.Main,
    },
    {
        label: "Map Explorer",
        id: SystemTrayItemKey.MapExplorer,
    },
    {
        label: "Preferences",
        id: SystemTrayItemKey.Preferences,
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
        label: `Exit ${APP_NAME}`,
        id: SystemTrayItemKey.Exit,
    },
];

@Injectable({
    providedIn: "root",
})
export class SystemTrayService extends AllfatherService {
    private menuItems: OWSystemTrayMenuItem[] = [];

    constructor(
        private readonly backgroundService: BackgroundService,
        private readonly developmentToolsWindow: DevelopmentToolsWindowService,
        private readonly game: GameService,
        private readonly inflictionInsightWindow: InflictionInsightWindowService,
        private readonly legendSelectAssistWindow: LegendSelectAssistWindowService,
        private readonly localStorage: LocalStorageService,
        private readonly mainWindow: MainWindowService,
        private readonly matchTimerWindow: MatchTimerWindowService,
        private readonly overwolfExtension: OverwolfExtensionService,
        private readonly overwolfSystemTray: OverwolfSystemTrayService,
        private readonly titleService: Title,
        private readonly ultTimerWindow: UltTimerWindowService
    ) {
        super();

        const SEPARATOR = { label: "-" };
        this.menuItems.push(...MENUITEMS);
        if (environment.allowDevTools) this.menuItems.push(SEPARATOR, ...DEVTOOLS_MENUITEMS);
        this.menuItems.push(SEPARATOR, ...FOOTER_MENUITEMS);

        this.overwolfSystemTray.systemTrayIconClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe(this.onSystemTrayIconClicked);
        this.overwolfSystemTray.systemTrayIconDoubleClicked$
            .pipe(takeUntil(this.isDestroyed$))
            .subscribe(this.onSystemTrayIconDoubleClicked);
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
        this.mainWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();
    }

    private onMenuItemClicked(menuItem: SystemTrayItemKey): void {
        switch (menuItem) {
            case SystemTrayItemKey.Main:
                this.mainWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();
                break;
            case SystemTrayItemKey.DevelopmentTools:
                this.developmentToolsWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();
                break;
            case SystemTrayItemKey.InGameInflictionInsight:
                this.inflictionInsightWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();
                break;
            case SystemTrayItemKey.InGameMatchTimer:
                this.matchTimerWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();
                break;
            case SystemTrayItemKey.InGameUltTimer:
                this.ultTimerWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();
                break;
            case SystemTrayItemKey.LegendSelectAssist:
                this.legendSelectAssistWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();
                break;
            case SystemTrayItemKey.MapExplorer:
                // this.mainWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();
                break;
            case SystemTrayItemKey.Preferences:
                // this.mainWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();
                break;
            case SystemTrayItemKey.Exit:
                this.backgroundService.requestExit();
                break;
            default:
                exhaustiveEnumSwitch(menuItem);
        }
    }
}

import { OWGameEvent, OWInfoUpdates2Event } from "@allfather-app/app/modules/core/overwolf";
import { ExposedOverwolfGameDataService } from "@allfather-app/app/modules/core/overwolf-exposed-data.service";
import { InflictionInsightWindowService } from "@allfather-app/app/modules/HUD/infliction-insight/windows/infliction-insight-window.service";
import { MatchTimerWindowService } from "@allfather-app/app/modules/HUD/match-timer/windows/match-timer-window.service";
import { UltTimerWindowService } from "@allfather-app/app/modules/HUD/ult-timer/windows/ult-timer-window.service";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { OverwolfExtensionService } from "../../core/overwolf/overwolf-extension.service";
import { LegendSelectAssistWindowService } from "../../legend-select-assist/windows/legend-select-assist-window.service";
import { MainWindowService } from "../../main/windows/main-window.service";

type MainTab = "simulate" | "logs";

@Component({
    selector: "app-development-tools-window",
    templateUrl: "./development-tools-window.component.html",
    styleUrls: ["./development-tools-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopmentToolsWindowComponent implements OnInit, OnDestroy {
    public selectedMainTab: MainTab = "simulate";
    public mainTabOptions: MainTab[] = ["simulate", "logs"];

    public get mainWindowEnabled(): boolean {
        return this._mainWindowEnabled;
    }
    public set mainWindowEnabled(value: boolean) {
        this._mainWindowEnabled = value;
        this.mainWindow[value ? "open" : "close"]().pipe(takeUntil(this.isDestroyed$)).subscribe();
    }
    public get hudUltTimerWindowEnabled(): boolean {
        return this._hudUltTimerWindowEnabled;
    }
    public set hudUltTimerWindowEnabled(value: boolean) {
        this._hudUltTimerWindowEnabled = value;
        this.hudUltTimerWindow[value ? "open" : "close"]().pipe(takeUntil(this.isDestroyed$)).subscribe();
    }
    public get hudMatchTimerWindowEnabled(): boolean {
        return this._hudMatchTimerWindowEnabled;
    }
    public set hudMatchTimerWindowEnabled(value: boolean) {
        this._hudMatchTimerWindowEnabled = value;
        this.hudMatchTimerWindow[value ? "open" : "close"]().pipe(takeUntil(this.isDestroyed$)).subscribe();
    }
    public get hudInflictionInsightWindowEnabled(): boolean {
        return this._hudInflictionInsightWindowEnabled;
    }
    public set hudInflictionInsightWindowEnabled(value: boolean) {
        this._hudInflictionInsightWindowEnabled = value;
        this.hudInflictionInsightWindow[value ? "open" : "close"]().pipe(takeUntil(this.isDestroyed$)).subscribe();
    }
    public get hudLegendSelectAssistWindowEnabled(): boolean {
        return this._hudLegendSelectAssistWindowEnabled;
    }
    public set hudLegendSelectAssistWindowEnabled(value: boolean) {
        this._hudLegendSelectAssistWindowEnabled = value;
        this.hudLegendSelectAssistWindow[value ? "open" : "close"]().pipe(takeUntil(this.isDestroyed$)).subscribe();
    }

    public infoUpdates$: Subject<OWInfoUpdates2Event>;
    public newGameEvent$: Subject<OWGameEvent>;

    private _mainWindowEnabled = false;
    private _hudInflictionInsightWindowEnabled = false;
    private _hudLegendSelectAssistWindowEnabled = false;
    private _hudMatchTimerWindowEnabled = false;
    private _hudUltTimerWindowEnabled = false;
    private isDestroyed$ = new Subject<void>();

    constructor(
        private readonly exposedOverwolfData: ExposedOverwolfGameDataService,
        private readonly hudInflictionInsightWindow: InflictionInsightWindowService,
        private readonly hudLegendSelectAssistWindow: LegendSelectAssistWindowService,
        private readonly hudMatchTimerWindow: MatchTimerWindowService,
        private readonly hudUltTimerWindow: UltTimerWindowService,
        private readonly mainWindow: MainWindowService,
        private readonly overwolfExtension: OverwolfExtensionService
    ) {
        this.infoUpdates$ = this.exposedOverwolfData.rawInfoUpdates$;
        this.newGameEvent$ = this.exposedOverwolfData.rawNewGameEvent$;
    }

    public ngOnInit(): void {
        // Default window values
        this.mainWindowEnabled = true;
        this.hudInflictionInsightWindowEnabled = false;
        this.hudLegendSelectAssistWindowEnabled = false;
        this.hudMatchTimerWindowEnabled = false;
        this.hudUltTimerWindowEnabled = false;
    }

    public ngOnDestroy(): void {
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
    }

    public relaunchApp(): void {
        this.overwolfExtension.relaunchApp();
    }
}

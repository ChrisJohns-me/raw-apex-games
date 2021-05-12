import { OWGameEvent, OWInfoUpdates2Event } from "@allfather-app/app/modules/core/overwolf";
import { ExposedOverwolfGameDataService } from "@allfather-app/app/modules/core/overwolf-exposed-data.service";
import { InflictionInsightWindowService } from "@allfather-app/app/modules/in-game/infliction-insight/windows/infliction-insight-window.service";
import { MatchTimerWindowService } from "@allfather-app/app/modules/in-game/match-timer/windows/match-timer-window.service";
import { UltTimerWindowService } from "@allfather-app/app/modules/in-game/ult-timer/windows/ult-timer-window.service";
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
    public get ultTimerWindowEnabled(): boolean {
        return this._ultTimerWindowEnabled;
    }
    public set ultTimerWindowEnabled(value: boolean) {
        this._ultTimerWindowEnabled = value;
        this.inGameUltTimerWindow[value ? "open" : "close"]().pipe(takeUntil(this.isDestroyed$)).subscribe();
    }
    public get matchTimerWindowEnabled(): boolean {
        return this._matchTimerWindowEnabled;
    }
    public set matchTimerWindowEnabled(value: boolean) {
        this._matchTimerWindowEnabled = value;
        this.matchTimerWindow[value ? "open" : "close"]().pipe(takeUntil(this.isDestroyed$)).subscribe();
    }
    public get inflictionInsightWindowEnabled(): boolean {
        return this._inflictionInsightWindowEnabled;
    }
    public set inflictionInsightWindowEnabled(value: boolean) {
        this._inflictionInsightWindowEnabled = value;
        this.inflictionInsightWindow[value ? "open" : "close"]().pipe(takeUntil(this.isDestroyed$)).subscribe();
    }
    public get legendSelectAssistWindowEnabled(): boolean {
        return this._legendSelectAssistWindowEnabled;
    }
    public set legendSelectAssistWindowEnabled(value: boolean) {
        this._legendSelectAssistWindowEnabled = value;
        this.legendSelectAssistWindow[value ? "open" : "close"]().pipe(takeUntil(this.isDestroyed$)).subscribe();
    }

    public infoUpdates$: Subject<OWInfoUpdates2Event>;
    public newGameEvent$: Subject<OWGameEvent>;

    private _mainWindowEnabled = false;
    private _ultTimerWindowEnabled = false;
    private _matchTimerWindowEnabled = false;
    private _inflictionInsightWindowEnabled = false;
    private _legendSelectAssistWindowEnabled = false;
    private isDestroyed$ = new Subject<void>();

    constructor(
        private readonly exposedOverwolfData: ExposedOverwolfGameDataService,
        private readonly inflictionInsightWindow: InflictionInsightWindowService,
        private readonly inGameUltTimerWindow: UltTimerWindowService,
        private readonly legendSelectAssistWindow: LegendSelectAssistWindowService,
        private readonly mainWindow: MainWindowService,
        private readonly matchTimerWindow: MatchTimerWindowService,
        private readonly overwolfExtension: OverwolfExtensionService
    ) {
        this.infoUpdates$ = this.exposedOverwolfData.rawInfoUpdates$;
        this.newGameEvent$ = this.exposedOverwolfData.rawNewGameEvent$;
    }

    public ngOnInit(): void {
        // Default window values
        this.mainWindowEnabled = true;
        this.ultTimerWindowEnabled = false;
        this.matchTimerWindowEnabled = false;
        this.inflictionInsightWindowEnabled = false;
        this.legendSelectAssistWindowEnabled = false;
    }

    public ngOnDestroy(): void {
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
    }

    public relaunchApp(): void {
        this.overwolfExtension.relaunchApp();
    }
}

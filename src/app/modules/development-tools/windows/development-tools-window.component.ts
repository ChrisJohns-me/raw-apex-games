import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { DamageCollectorWindowService } from "@app/modules/in-game/damage-collector/windows/damage-collector-window.service";
import { MatchTimerWindowService } from "@app/modules/in-game/match-timer/windows/match-timer-window.service";
import { UltTimerWindowService } from "@app/modules/in-game/ult-timer/windows/ult-timer-window.service";
import { OWGameEvent, OWInfoUpdates2Event } from "@core/overwolf-data-provider";
import { OverwolfExposedDataService } from "@core/overwolf-exposed-data.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

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

    public get ultTimerWindowEnabled(): boolean {
        return this._ultTimerWindowEnabled;
    }
    public set ultTimerWindowEnabled(value: boolean) {
        this._ultTimerWindowEnabled = value;
        this.inGameUltTimerWindow[value ? "open" : "close"]().pipe(takeUntil(this._unsubscribe$)).subscribe();
    }
    public get matchTimerWindowEnabled(): boolean {
        return this._matchTimerWindowEnabled;
    }
    public set matchTimerWindowEnabled(value: boolean) {
        this._matchTimerWindowEnabled = value;
        this.matchTimerWindow[value ? "open" : "close"]().pipe(takeUntil(this._unsubscribe$)).subscribe();
    }
    public get damageCollectorWindowEnabled(): boolean {
        return this._damageCollectorWindowEnabled;
    }
    public set damageCollectorWindowEnabled(value: boolean) {
        this._damageCollectorWindowEnabled = value;
        this.damageCollectorWindow[value ? "open" : "close"]().pipe(takeUntil(this._unsubscribe$)).subscribe();
    }

    public infoUpdates$: Subject<OWInfoUpdates2Event>;
    public newGameEvent$: Subject<OWGameEvent>;

    private _ultTimerWindowEnabled = false;
    private _matchTimerWindowEnabled = false;
    private _damageCollectorWindowEnabled = false;
    private _unsubscribe$ = new Subject<void>();

    constructor(
        private readonly damageCollectorWindow: DamageCollectorWindowService,
        private readonly inGameUltTimerWindow: UltTimerWindowService,
        private readonly matchTimerWindow: MatchTimerWindowService,
        private readonly overwolfExposedData: OverwolfExposedDataService
    ) {
        this.infoUpdates$ = this.overwolfExposedData.rawInfoUpdates$;
        this.newGameEvent$ = this.overwolfExposedData.rawNewGameEvent$;
    }

    public ngOnInit(): void {
        // Default window values
        this.ultTimerWindowEnabled = true;
        this.matchTimerWindowEnabled = true;
        this.damageCollectorWindowEnabled = true; // false;
    }

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }
}

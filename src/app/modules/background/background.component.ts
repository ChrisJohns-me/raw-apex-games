import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { merge, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DashboardWindowService } from "../dashboard-window/dashboard-window.service";
import { InGameMatchTimerWindowService } from "../in-game-match-timer-window/in-game-match-timer-window.service";
import { InGameUltTimerWindowService } from "../in-game-ult-timer-window/in-game-ult-timer-window.service";
import { BackgroundService } from "./background.service";

@Component({
    selector: "app-background",
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundComponent implements OnInit, OnDestroy {
    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly dashboardWindow: DashboardWindowService,
        private readonly backgroundService: BackgroundService,
        private readonly matchTimerWindow: InGameMatchTimerWindowService,
        private readonly ultTimerWindow: InGameUltTimerWindowService
    ) {}

    public ngOnInit(): void {
        this.backgroundService.startBackgroundServices();
        this.registerUIWindows();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private registerUIWindows(): void {
        merge(this.dashboardWindow.open(), this.matchTimerWindow.open(), this.ultTimerWindow.open())
            .pipe(takeUntil(this._unsubscribe))
            .subscribe();
    }
}

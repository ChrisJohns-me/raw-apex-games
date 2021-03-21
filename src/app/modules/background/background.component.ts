import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { APP_NAME } from "@common/app";
import { merge, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DashboardWindowService } from "../dashboard-window/dashboard-window.service";
import { InGameDamageCollectorWindowService } from "../in-game-damage-collector-window/in-game-damage-collector-window.service";
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
        private readonly backgroundService: BackgroundService,
        private readonly damageCollectorWindow: InGameDamageCollectorWindowService,
        private readonly dashboardWindow: DashboardWindowService,
        private readonly matchTimerWindow: InGameMatchTimerWindowService,
        private readonly titleService: Title,
        private readonly ultTimerWindow: InGameUltTimerWindowService
    ) {}

    public ngOnInit(): void {
        this.titleService.setTitle(`${APP_NAME} - Background`);
        this.backgroundService.startBackgroundServices();
        this.registerUIWindows();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private registerUIWindows(): void {
        merge(
            this.dashboardWindow.open(),
            this.damageCollectorWindow.open(),
            this.matchTimerWindow.open(),
            this.ultTimerWindow.open()
        )
            .pipe(takeUntil(this._unsubscribe))
            .subscribe();
    }
}

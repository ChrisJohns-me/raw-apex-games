import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { GameEventsService } from "@core/game";
import { UIWindowEventsService } from "@core/ui-window";
import { merge, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DashboardWindowService } from "../dashboard-window/dashboard-window.service";
import { InGameMatchTimerWindowService } from "../in-game-match-timer-window/in-game-match-timer-window.service";

@Component({
    selector: "app-background",
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundComponent implements OnInit, OnDestroy {
    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly dashboardWindow: DashboardWindowService,
        private readonly matchTimerWindow: InGameMatchTimerWindowService,
        private readonly gameEvents: GameEventsService,
        private readonly uiWindowEvents: UIWindowEventsService
    ) {}

    public ngOnInit(): void {
        console.debug(`${this.constructor.name} initialized`);
        this.registerGameEvents();
        this.registerUIWindowEvents();
        this.dashboardWindow.open().subscribe();
        this.matchTimerWindow.open().subscribe();
    }

    public ngOnDestroy(): void {
        console.log(`${this.constructor.name} destroyed`);
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private registerGameEvents(): void {
        merge(
            this.gameEvents.gameProcessUpdate$,
            this.gameEvents.gameInfo$,
            this.gameEvents.gameEvent$,
            this.gameEvents.gameMatchTime$
        )
            .pipe(takeUntil(this._unsubscribe))
            .subscribe();
    }

    private registerUIWindowEvents(): void {}
}

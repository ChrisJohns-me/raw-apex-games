import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { GameEventsService } from "@core/game";
import { UIWindowEventsService } from "@core/ui-window";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DashboardWindowService } from "../dashboard-window/dashboard-window.service";

@Component({
    selector: "app-background",
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundComponent implements OnInit, OnDestroy {
    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly dashboardWindow: DashboardWindowService,
        private readonly gameEvents: GameEventsService,
        private readonly uiWindowEvents: UIWindowEventsService
    ) {
        console.debug(`${this.constructor.name} instantiated`);
        this.registerGameEvents();
        this.registerUIWindowEvents();
    }

    public ngOnInit(): void {
        console.debug(`${this.constructor.name} initialized`);
        this.dashboardWindow.open().subscribe();
    }

    public ngOnDestroy(): void {
        console.log(`${this.constructor.name} destroyed`);
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private registerGameEvents(): void {
        this.gameEvents.gameProcessUpdate$.pipe(takeUntil(this._unsubscribe)).subscribe((event) => console.log(event));
        this.gameEvents.gameInfo$.pipe(takeUntil(this._unsubscribe)).subscribe((event) => console.log(event));
        this.gameEvents.gameEvent$.pipe(takeUntil(this._unsubscribe)).subscribe((event) => console.log(event));
    }

    private registerUIWindowEvents(): void {}
}

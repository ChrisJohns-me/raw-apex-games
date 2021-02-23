import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { GameEventsService } from "@core/game";
import { UIWindowEventsService } from "@core/ui-window";
import { DashboardWindowService } from "../dashboard-window/dashboard-window.service";

@Component({
    selector: "app-background",
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundComponent implements OnInit {
    constructor(
        private readonly dashboardWindow: DashboardWindowService,
        private readonly gameEvents: GameEventsService,
        private readonly uiWindowEvents: UIWindowEventsService
    ) {
        console.debug(`${this.constructor.name} instantiated`);
        this.uiWindowEvents.windowStateChangedEvent$.subscribe((test) => {
            console.log("result", test);
        });
    }

    public ngOnInit(): void {
        console.debug(`${this.constructor.name} initialized`);
        this.dashboardWindow.open().subscribe();
    }

    public ngOnDestroy(): void {
        console.log(`${this.constructor.name} destroyed`);
    }
}

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
} from "@angular/core";
import { GameEventsService } from "@core/game";
import { format } from "date-fns";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { InGameTestWindowService } from "../in-game-test-window/in-game-test-window.service";

@Component({
    selector: "app-dashboard-window",
    templateUrl: "./dashboard-window.component.html",
    styleUrls: ["./dashboard-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardWindowComponent implements OnDestroy {
    public primaryTitle = "Dashboard";
    public secondaryTitle = "";

    public gameProcessInfoEventList = "";
    public gameDataInfoEventList = "";
    public gameDataFeatureEventList = "";

    private _unsubscribe = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly gameEvents: GameEventsService,
        private readonly inGameTestWindow: InGameTestWindowService
    ) {
        this.registerGameEvents();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public openInGame(): void {
        console.debug("opening in game test window");
        this.inGameTestWindow.open().subscribe();
    }

    private registerGameEvents(): void {
        this.gameEvents.gameProcessInfoEvent$
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((event) => {
                this.gameProcessInfoEventList =
                    createLogItem(event) + this.gameProcessInfoEventList;
                this.cdr.detectChanges();
            });
        this.gameEvents.gameDataInfoEvent$
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((event) => {
                this.gameDataInfoEventList =
                    createLogItem(event) + this.gameDataInfoEventList;
                this.cdr.detectChanges();
            });
        this.gameEvents.gameDataFeatureEvent$
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((event) => {
                this.gameDataFeatureEventList =
                    createLogItem(event) + this.gameDataFeatureEventList;
                this.cdr.detectChanges();
            });
    }
}

function createLogItem(input: any): string {
    const dateStr = format(new Date(), "h:mm:ssaaa");
    const eventStr = JSON.stringify(input);
    return `[${dateStr}] ${eventStr}\n`;
}

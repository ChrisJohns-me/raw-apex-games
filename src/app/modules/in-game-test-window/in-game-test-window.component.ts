import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { GameEventsService } from "@core/game";
import { format } from "date-fns";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "app-in-game-test-window",
    templateUrl: "./in-game-test-window.component.html",
    styleUrls: ["./in-game-test-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InGameTestWindowComponent implements OnDestroy {
    public primaryTitle = "In Game Test";
    public secondaryTitle = "";

    public logList = "";

    private _unsubscribe = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly gameEvents: GameEventsService) {
        this.registerGameEvents();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private registerGameEvents(): void {
        // this.gameEvents.gameProcessInfoEvent$
        //     .pipe(takeUntil(this._unsubscribe))
        //     .subscribe((event) => {
        //         this.logList = createLogItem(event) + this.logList;
        //         this.cdr.detectChanges();
        //     });
        this.gameEvents.gameInfo$.pipe(takeUntil(this._unsubscribe)).subscribe((event) => {
            this.logList = createLogItem(event) + this.logList;
            this.cdr.detectChanges();
        });
        this.gameEvents.gameEvent$.pipe(takeUntil(this._unsubscribe)).subscribe((event) => {
            this.logList = createLogItem(event) + this.logList;
            this.cdr.detectChanges();
        });
    }
}

function createLogItem(input: any): string {
    const now = new Date();
    const dateStr = format(now, "h:mm:ssaaaTT");
    const eventStr = JSON.stringify(input);
    return `[${dateStr}] ${eventStr}\n`;
}

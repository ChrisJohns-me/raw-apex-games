import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { GameEventsService } from "@core/game";
import { format } from "date-fns";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "app-in-game-match-timer-window",
    templateUrl: "./in-game-match-timer-window.component.html",
    styleUrls: ["./in-game-match-timer-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InGameMatchTimerWindowComponent implements OnDestroy {
    public primaryTitle = "In Game Match Timer";
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
    const dateStr = format(new Date(), "h:mm:ssaaa");
    const eventStr = JSON.stringify(input);
    return `[${dateStr}] ${eventStr}\n`;
}

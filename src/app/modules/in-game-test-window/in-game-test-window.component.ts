import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { GameEventsService } from "@core/game";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "app-in-game-test-window",
    templateUrl: "./in-game-test-window.component.html",
    styleUrls: ["./in-game-test-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InGameTestWindowComponent implements OnDestroy {
    public gameProcessInfoEventList = "";
    public gameDataInfoEventList = "";
    public gameDataFeatureEventList = "";

    private _unsubscribe = new Subject<void>();

    constructor(private readonly gameEvents: GameEventsService) {
        this.gameEvents.gameProcessInfoEvent$
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((event) => {
                this.gameProcessInfoEventList = `${this.gameProcessInfoEventList}\n${event}`;
            });
        this.gameEvents.gameDataInfoEvent$
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((event) => {
                this.gameDataInfoEventList = `${this.gameDataInfoEventList}\n${event}`;
            });
        this.gameEvents.gameDataFeatureEvent$
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((event) => {
                this.gameDataFeatureEventList = `${this.gameDataFeatureEventList}\n${event}`;
            });
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }
}

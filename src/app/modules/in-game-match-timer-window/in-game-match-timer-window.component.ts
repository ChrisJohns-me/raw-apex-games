import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatchService } from "@core/match.service";
import { Subject } from "rxjs";
import { debounceTime, takeUntil, tap } from "rxjs/operators";

const SHOW_TIMER_TIMEOUT = 15000;

@Component({
    selector: "app-in-game-match-timer-window",
    templateUrl: "./in-game-match-timer-window.component.html",
    styleUrls: ["./in-game-match-timer-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InGameMatchTimerWindowComponent implements OnInit, OnDestroy {
    public primaryTitle = "In Game Match Timer";
    public secondaryTitle = "";

    public get matchDurationDate(): Optional<Date> {
        return this.matchDurationMs ? new Date(this.matchDurationMs) : undefined;
    }

    public get isMatchDurationDateValid(): boolean {
        const date = this.matchDurationDate;
        return !!date && Object.prototype.toString.call(date) === "[object Date]" && isFinite(date.getTime());
    }

    public showTimer = false;

    private matchDurationMs?: number;
    private _unsubscribe = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly match: MatchService) {
        console.debug(`[${this.constructor.name}] instantiated`);
    }

    public ngOnInit(): void {
        this.registerGameEvents();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private registerGameEvents(): void {
        this.match.time$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((matchTime) => {
                    if (!this.showTimer) console.debug(`[${this.constructor.name}] Showing timer`);
                    this.showTimer = true;
                    this.matchDurationMs = matchTime.durationMs;
                    this.cdr.detectChanges();
                }),
                debounceTime(SHOW_TIMER_TIMEOUT),
                tap(() => {
                    if (this.showTimer) console.debug(`[${this.constructor.name}] Hiding match timer`);
                    this.showTimer = false;
                    this.cdr.detectChanges();
                })
            )
            .subscribe();
    }
}

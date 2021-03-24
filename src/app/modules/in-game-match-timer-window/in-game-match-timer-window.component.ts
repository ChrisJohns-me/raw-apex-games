import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatchState } from "@common/match/match-state";
import { MatchService } from "@core/match.service";
import { isValid } from "date-fns";
import { Subject, timer } from "rxjs";
import { delay, filter, switchMap, takeUntil, tap } from "rxjs/operators";

const SHOW_TIMER_TIMEOUT = 15000;
const UI_TIMER_REFRESH_RATE = 1000;

@Component({
    selector: "app-in-game-match-timer-window",
    templateUrl: "./in-game-match-timer-window.component.html",
    styleUrls: ["./in-game-match-timer-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InGameMatchTimerWindowComponent implements OnInit, OnDestroy {
    public isDateValid = isValid;

    public primaryTitle = "In Game Match Timer";
    public secondaryTitle = "";

    public get isMatchActive(): boolean {
        return !this.matchEndDate;
    }

    public get matchDurationDate(): Date {
        const startMs = (this.matchStartDate ?? new Date()).getTime();
        const endMs = (this.matchEndDate ?? new Date()).getTime();
        return new Date(endMs - startMs);
    }

    public showTimer = false;

    private matchStartDate?: Date;
    private matchEndDate?: Date;
    private _unsubscribe = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly match: MatchService) {}

    public ngOnInit(): void {
        this.setupMatchDates();
        this.setupShowHideEvents();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private setupShowHideEvents(): void {
        this.match.state$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((stateChanged) => stateChanged.state === MatchState.Active),
                tap(() => (this.showTimer = true)),
                switchMap(() => timer(0, UI_TIMER_REFRESH_RATE))
            )
            .subscribe(() => this.cdr.detectChanges());

        this.match.endedEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                delay(SHOW_TIMER_TIMEOUT),
                tap(() => (this.showTimer = false))
            )
            .subscribe(() => this.cdr.detectChanges());
    }

    private setupMatchDates(): void {
        this.match.state$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((stateChanged) => {
                    this.matchStartDate = stateChanged.startDate;
                    this.matchEndDate = stateChanged.endDate;
                })
            )
            .subscribe(() => this.cdr.detectChanges());
    }
}

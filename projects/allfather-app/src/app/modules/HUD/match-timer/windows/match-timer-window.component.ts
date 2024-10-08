import { MatchState } from "@allfather-app/app/common/match/state";
import { OverwolfWindowName } from "@allfather-app/app/common/overwolf-window";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { isValid } from "date-fns";
import { Subject, timer } from "rxjs";
import { delay, filter, switchMap, takeUntil, tap } from "rxjs/operators";

const MATCH_END_TIMEOUT = 15000;
const UI_TIMER_REFRESH_RATE = 1000;

@Component({
    selector: "app-hud-match-timer-window",
    templateUrl: "./match-timer-window.component.html",
    styleUrls: ["./match-timer-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchTimerWindowComponent implements OnInit, OnDestroy {
    public isDateValid = isValid;

    public primaryTitle = "In Game Match Timer";
    public secondaryTitle = "";

    public get matchDurationDate(): Date {
        const startMs = (this.matchStartDate ?? new Date()).getTime();
        const endMs = (this.matchEndDate ?? new Date()).getTime();
        return new Date(endMs > startMs ? endMs - startMs : Date.now() - startMs);
    }

    public showTimer = false;
    public readonly OverwolfWindowName = OverwolfWindowName;

    private matchStartDate?: Date;
    private matchEndDate?: Date;
    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly match: MatchService) {}

    public ngOnInit(): void {
        this.setupMatchStartEvent();
        this.setupMatchStopEvent();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupMatchStartEvent(): void {
        this.match.state$
            .pipe(
                takeUntil(this.destroy$),
                filter((stateChanged) => stateChanged.state === MatchState.Active),
                tap((stateChanged) => {
                    this.matchStartDate = stateChanged.startDate;
                    this.showTimer = true;
                }),
                switchMap(() => timer(0, UI_TIMER_REFRESH_RATE))
            )
            .subscribe(() => {
                this.cdr.detectChanges();
            });
    }

    private setupMatchStopEvent(): void {
        this.match.endedEvent$
            .pipe(
                takeUntil(this.destroy$),
                tap((stateChanged) => (this.matchEndDate = stateChanged.endDate)),
                delay(MATCH_END_TIMEOUT),
                tap(() => (this.showTimer = false))
            )
            .subscribe(() => {
                this.cdr.detectChanges();
            });
    }
}

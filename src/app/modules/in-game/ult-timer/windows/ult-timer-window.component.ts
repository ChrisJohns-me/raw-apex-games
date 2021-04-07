import { formatPercent } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatchPlayerLegendService } from "@core/match/match-player-legend.service";
import { MatchPlayerLocationService } from "@core/match/match-player-location.service";
import { MatchPlayerService } from "@core/match/match-player.service";
import { MatchService } from "@core/match/match.service";
import { MatchLocationPhase } from "@shared/models/match/match-location";
import { MatchState, MatchStateChangedEvent } from "@shared/models/match/match-state";
import { PlayerState } from "@shared/models/player-state";
import { average, averageRate } from "@shared/utilities";
import { format, formatDistanceToNowStrict, isValid } from "date-fns";
import { combineLatest, Observable, Subject, timer } from "rxjs";
import { distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from "rxjs/operators";

const NUM_PROGRESS_HISTORY = 10;
const ABNORMAL_INCREASE_AMOUNT = 0.1; // Ultimate accelerant or charging station
const UI_REFRESH_RATE = 1000;

interface UltimateProgress {
    timestamp: Date;
    percent: number;
    increment: number;
}

@Component({
    selector: "app-in-game-ult-timer-window",
    templateUrl: "./ult-timer-window.component.html",
    styleUrls: ["./ult-timer-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UltTimerWindowComponent implements OnInit, OnDestroy {
    public isDateValid = isValid;
    public isVisible = false; // based on match state + player state
    public ultimatePercent = 0;
    public get isUltimateReady(): boolean {
        return this.ultimatePercent >= 0.99;
    }
    /**
     * @returns {Date} time remaining
     * @returns empty Date if ready date is invalid
     */
    public get ultimateReadyRemaining(): Date {
        if (!this.ultimateReadyDate || !isValid(this.ultimateReadyDate)) return new Date(0);
        const readyDate = this.ultimateReadyDate as Date;
        const now = new Date();
        const remaining = new Date(readyDate.getTime() - now.getTime());
        return remaining?.getTime() <= 0 ? new Date(0) : remaining;
    }

    private get avgIncrement(): number {
        const incrementArr = this.ultimateProgressHistory.map((h) => h.increment);
        const avg = average(incrementArr);
        return avg;
    }
    private get avgUpdateRateMs(): number {
        const timestampMsArr = this.ultimateProgressHistory.map((h) => h.timestamp.getTime());
        const avg = averageRate(timestampMsArr);
        return avg;
    }
    private ultimateProgressHistory: UltimateProgress[] = [];
    private ultimateReadyDate?: Date;
    private readonly visibleStates$: Observable<[MatchStateChangedEvent, PlayerState, Optional<MatchLocationPhase>]>;
    private _unsubscribe$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly match: MatchService,
        private readonly matchPlayer: MatchPlayerService,
        private readonly matchPlayerLegend: MatchPlayerLegendService,
        private readonly matchPlayerLocation: MatchPlayerLocationService
    ) {
        this.visibleStates$ = combineLatest([this.match.state$, this.matchPlayer.myState$, this.matchPlayerLocation.myLocationPhase$]).pipe(
            takeUntil(this._unsubscribe$),
            distinctUntilChanged()
        );
    }

    public ngOnInit(): void {
        this.setupOnMatchStart();
        this.setupVisibleStates();
        this.setupUltimateCalculation();
    }

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    private setupOnMatchStart(): void {
        this.match.startedEvent$.pipe(takeUntil(this._unsubscribe$)).subscribe(() => {
            console.debug(`[${this.constructor.name}] Ult-timer reset`);
            this.ultimateProgressHistory = [{ percent: 0, increment: 0.05, timestamp: new Date() }];
        });
    }

    private setupVisibleStates(): void {
        this.visibleStates$.subscribe(([stateChanged, myState, locationPhase]) => {
            this.isVisible =
                stateChanged.state === MatchState.Active && myState === PlayerState.Alive && locationPhase === MatchLocationPhase.HasLanded;

            console.debug(
                `[${this.constructor.name}] [${this.isVisible ? "Showable" : "NotShowable"}] ` +
                    `[${this.isVisible ? "Visible" : "Hidden"}]. ` +
                    `Match: "${this.match.state$.value.state}", ` +
                    `Player: "${this.matchPlayer.myState$.value}", ` +
                    `Location: "${this.matchPlayerLocation.myLocationPhase$.value}"`
            );
        });
    }

    private setupUltimateCalculation(): void {
        this.visibleStates$
            .pipe(
                filter(([stateChanged, myState]) => stateChanged.state === MatchState.Active && myState === PlayerState.Alive),
                switchMap(() => this.matchPlayerLegend.myUltimateCooldown$),
                tap((percent) => this.addPercentHistory((this.ultimatePercent = percent))),
                filter(() => this.ultimateProgressHistory.length >= 2),
                map((percent) => this.calcReadyDate(percent, new Date())),
                tap((readyDate) => (this.ultimateReadyDate = readyDate)),
                switchMap(() => timer(0, UI_REFRESH_RATE))
            )
            .subscribe(() => this.cdr.detectChanges());
    }

    private addPercentHistory(newPercent: number): void {
        const hist = this.ultimateProgressHistory;
        const lastUpdate = hist[hist.length - 1] as Optional<UltimateProgress>;
        const lastPercent = lastUpdate ? lastUpdate.percent : 0;
        const increment = newPercent - lastPercent;
        const lastIncrement = lastUpdate ? lastUpdate.increment : Math.abs(increment);

        if (increment == 0) {
            return;
        } else if (increment > ABNORMAL_INCREASE_AMOUNT) {
            console.log(
                `[${this.constructor.name}] Abnormal ultimate increment detected of "${formatPercent(
                    increment,
                    "en-US"
                )}"; omitting from averages.`
            );
        } else if (increment > 0) {
            console.debug(`[${this.constructor.name}] Ultimate percent increment of "${formatPercent(increment, "en-US")}"`);
            this.ultimateProgressHistory.push({ percent: newPercent, increment, timestamp: new Date() });
        } else if (increment <= -0.9) {
            console.debug(`[${this.constructor.name}] Ultimate likely used`);
            this.ultimateProgressHistory.push({ percent: newPercent, increment: lastIncrement, timestamp: new Date() });
        }
        this.ultimateProgressHistory = this.ultimateProgressHistory.slice(-NUM_PROGRESS_HISTORY);
    }

    private calcReadyDate(percent: number, date: Date): Optional<Date> {
        const percentRemaining = 1 - percent;
        const approxTotalReadyTimeMs = this.avgUpdateRateMs / this.avgIncrement; // Estimated total time for 100% ultimate
        const approxTimeRemainingMs = percentRemaining * approxTotalReadyTimeMs;
        const rawEstReadyDate = new Date(date.getTime() + approxTimeRemainingMs);

        console.debug(
            `[${this.constructor.name}] [Calculation] ` +
                `Total ~"${formatDistanceToNowStrict(new Date().getTime() + approxTotalReadyTimeMs, { unit: "second" })}", ` +
                `Remaining ~"${formatDistanceToNowStrict(new Date().getTime() + approxTimeRemainingMs, { unit: "second" })}", ` +
                `Ready ~"${format(rawEstReadyDate, "yyyy:mm:dd kk:mm:ss")}", ` +
                `History: ${this.ultimateProgressHistory.length}, ` +
                `Increment: ${formatPercent(this.avgIncrement, "en-US")}, ` +
                `Rate: ${this.avgUpdateRateMs / 1000}sec`
        );

        return rawEstReadyDate;
    }
}

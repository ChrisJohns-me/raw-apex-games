import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatchLocationPhase } from "@common/match/match-location";
import { MatchState, MatchStateChangedEvent } from "@common/match/match-state";
import { PlayerState } from "@common/player-state";
import { MatchPlayerLegendService } from "@core/match-player-legend.service";
import { MatchPlayerLocationService } from "@core/match-player-location.service";
import { MatchService } from "@core/match.service";
import { PlayerService } from "@core/player.service";
import { format, isValid } from "date-fns";
import { combineLatest, Observable, Subject, timer } from "rxjs";
import { distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { average, averageRate } from "src/utilities";
import { cleanInt } from "src/utilities/number";

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
    templateUrl: "./in-game-ult-timer-window.component.html",
    styleUrls: ["./in-game-ult-timer-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InGameUltTimerWindowComponent implements OnInit, OnDestroy {
    public isDateValid = isValid;
    public isVisible = false; // based on match state + player state
    public ultimatePercent = 0;
    public get isUltimateReady(): boolean {
        return this.ultimatePercent >= 0.99;
    }
    /**
     * @returns {Date} time remaining
     * @returns {undefined} if ready date is invalid
     */
    public get ultimateReadyRemaining(): Optional<Date> {
        if (!isValid(this.ultimateReadyDate)) return new Date(0);
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
    private readonly visibleStates$: Observable<[MatchStateChangedEvent, Optional<PlayerState>, Optional<MatchLocationPhase>]>;
    private _unsubscribe = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly match: MatchService,
        private readonly matchPlayerLegend: MatchPlayerLegendService,
        private readonly matchPlayerLocation: MatchPlayerLocationService,
        private readonly player: PlayerService
    ) {
        this.visibleStates$ = combineLatest([
            this.match.currentState$,
            this.player.myState$,
            this.matchPlayerLocation.myLocationPhase$,
        ]).pipe(takeUntil(this._unsubscribe), distinctUntilChanged());
    }

    public ngOnInit(): void {
        this.setupMatchReset();
        this.setupVisibleStates();
        this.setupUltimateCalculation();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private setupMatchReset(): void {
        this.match.startedEvent$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            console.debug(`Ult-timer reset`);
            this.ultimateProgressHistory = [{ percent: 0, increment: 0.05, timestamp: new Date() }];
        });
    }

    private setupVisibleStates(): void {
        this.visibleStates$.subscribe(([matchStateChanged, myState, locationPhase]) => {
            this.isVisible =
                matchStateChanged.state === MatchState.Active &&
                myState === PlayerState.Alive &&
                locationPhase === MatchLocationPhase.HasLanded;

            console.debug(
                `Ult-timer [${this.isVisible ? "Showable" : "NotShowable"}] ` +
                    `[${this.isVisible ? "Visible" : "Hidden"}]. ` +
                    `Match: "${this.match.currentState$.value.state}", ` +
                    `Player: "${this.player.myState$}", ` +
                    `Location: "${this.matchPlayerLocation.myLocationPhase$.value}", ` +
                    `Percent: "${cleanInt(this.ultimatePercent * 100)}%", ` +
                    `Est Remain: "${format(this.ultimateReadyRemaining ?? 0, "mm:ss")}"`
            );
        });
    }

    private setupUltimateCalculation(): void {
        this.visibleStates$
            .pipe(
                filter(([matchStateChanged, myState]) => matchStateChanged.state === MatchState.Active && myState === PlayerState.Alive),
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
            console.log(`Abnormal ultimate increment detected of "${parseFloat(String(increment))}"; omitting from averages.`);
        } else if (increment > 0) {
            console.debug(`Ultimate percent increment of "${parseFloat(String(increment))}"`);
            this.ultimateProgressHistory.push({ percent: newPercent, increment, timestamp: new Date() });
        } else if (increment <= -0.9) {
            console.debug(`Ultimate likely used`);
            this.ultimateProgressHistory.push({ percent: newPercent, increment: lastIncrement, timestamp: new Date() });
        }
        this.ultimateProgressHistory = this.ultimateProgressHistory.slice(-NUM_PROGRESS_HISTORY);
    }

    private calcReadyDate(percent: number, date: Date): Optional<Date> {
        const percentRemaining = 1 - percent;
        const approxTotalReadyTimeMs = this.avgUpdateRateMs / this.avgIncrement; // Estimated total time for 100% ultimate
        const approxTimeRemainingMs = percentRemaining * approxTotalReadyTimeMs;
        console.debug(
            `Ultimate time: ` + `~"${approxTotalReadyTimeMs / 1000}sec" total, ` + `~"${approxTimeRemainingMs / 1000}sec" remaining`
        );

        const rawEstReadyDate = new Date(date.getTime() + approxTimeRemainingMs);
        return rawEstReadyDate;
    }
}

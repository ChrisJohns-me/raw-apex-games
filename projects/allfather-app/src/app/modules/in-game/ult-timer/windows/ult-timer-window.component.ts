import { ConfigurationService } from "@allfather-app/app/modules/core/configuration/configuration.service";
import { MatchPlayerLegendService } from "@allfather-app/app/modules/core/match/match-player-legend.service";
import { MatchPlayerLocationService } from "@allfather-app/app/modules/core/match/match-player-location.service";
import { MatchPlayerService } from "@allfather-app/app/modules/core/match/match-player.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MatchLocationPhase } from "@allfather-app/app/shared/models/match/location";
import { MatchState, MatchStateChangedEvent } from "@allfather-app/app/shared/models/match/state";
import { PlayerState } from "@allfather-app/app/shared/models/player-state";
import { formatPercent } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { addMilliseconds, differenceInSeconds, format, formatDistanceToNowStrict, isFuture, isValid } from "date-fns";
import { combineLatest, Observable, Subject, timer } from "rxjs";
import { distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { mathAverage, mathAverageRate, mathAverageVariance, mathClamp } from "shared/utilities";

/**
 * Ultimate accelerant or charging station.
 * Anything above this amount will not be logged to the history
 */
const ABNORMAL_INCREASE_AMOUNT = 0.1;

enum ConfidenceLevel {
    NONE = "none",
    LOW = "low",
    HIGH = "high",
}

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
    public isVisible = false; // based on match state + player state
    public ultimatePercent = 0;
    public get isUltimateReady(): boolean {
        return this.ultimatePercent >= 0.99;
    }
    /**
     * @returns {Date} Estimated date when ultimate will be ready
     * @returns undefined if the date has passed
     */
    public get maybeReadyDate(): Date | undefined {
        if (!this._maybeReadyDate || !isValid(this._maybeReadyDate) || !isFuture(this._maybeReadyDate)) return;
        if (differenceInSeconds(this._maybeReadyDate, new Date()) < 0.5) return; // give no date if it's under x seconds
        return new Date(this._maybeReadyDate); // Force template to update
    }
    /** Confidence level of accuracy; HIGH, LOW, NONE */
    public get confidenceLevel(): ConfidenceLevel {
        if (this.confidenceAmount >= this.config.featureConfigs.ultTimer.highConfidenceAmount) return ConfidenceLevel.HIGH;
        else if (this.confidenceAmount >= this.config.featureConfigs.ultTimer.lowConfidenceAmount) return ConfidenceLevel.LOW;
        else return ConfidenceLevel.NONE;
    }
    /** Confidence level of accuracy in percent */
    public confidenceAmount = 0;

    private maxHistoryCount = this.config.featureConfigs.ultTimer.maxHistoryCount;
    private _maybeReadyDate?: Date;

    private get avgIncrement(): number {
        const incrementArr = this.ultimateProgressHistory.map((h) => h.increment);
        const avg = mathAverage(incrementArr);
        return avg;
    }
    private get avgUpdateRateMs(): number {
        const timestampMsArr = this.ultimateProgressHistory.map((h) => h.timestamp.getTime());
        const avg = mathAverageRate(timestampMsArr);
        return avg;
    }
    private ultimateProgressHistory: UltimateProgress[] = [];
    private readonly visibleStates$: Observable<[MatchStateChangedEvent, PlayerState, Optional<MatchLocationPhase>]>;
    private isDestroyed$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly config: ConfigurationService,
        private readonly match: MatchService,
        private readonly matchPlayer: MatchPlayerService,
        private readonly matchPlayerLegend: MatchPlayerLegendService,
        private readonly matchPlayerLocation: MatchPlayerLocationService
    ) {
        this.visibleStates$ = combineLatest([this.match.state$, this.matchPlayer.myState$, this.matchPlayerLocation.myLocationPhase$]).pipe(
            takeUntil(this.isDestroyed$),
            distinctUntilChanged()
        );
    }

    public ngOnInit(): void {
        this.setupOnMatchStart();
        this.setupVisibleStates();
        this.setupUltimateCalculation();
    }

    public ngOnDestroy(): void {
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
    }

    private setupOnMatchStart(): void {
        this.match.startedEvent$.pipe(takeUntil(this.isDestroyed$)).subscribe(() => {
            console.debug(`[${this.constructor.name}] Ult-timer reset`);
            this.ultimateProgressHistory = [{ percent: 0, increment: 0.05, timestamp: new Date() }];
        });
    }

    private setupVisibleStates(): void {
        this.visibleStates$.subscribe(([stateChanged, myState, locationPhase]) => {
            this.isVisible =
                stateChanged.state === MatchState.Active && myState === PlayerState.Alive && locationPhase === MatchLocationPhase.HasLanded;
        });
    }

    private setupUltimateCalculation(): void {
        this.visibleStates$
            .pipe(
                filter(([stateChanged, myState]) => stateChanged.state === MatchState.Active && myState === PlayerState.Alive),
                switchMap(() => this.matchPlayerLegend.myUltimateCooldown$),
                tap((percent) => this.addPercentHistory((this.ultimatePercent = percent))),
                filter(() => this.ultimateProgressHistory.length > 1),
                map((percent) => this.calcReadyDate(percent)),
                tap((readyDate) => (this._maybeReadyDate = readyDate)),
                tap(() => (this.confidenceAmount = this.calcConfidenceAmount())),
                switchMap(() => timer(0, this.config.featureConfigs.ultTimer.refreshTime))
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
        } else if (increment > ABNORMAL_INCREASE_AMOUNT && hist.length > this.maxHistoryCount / 2) {
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
        this.ultimateProgressHistory = this.ultimateProgressHistory.slice(-this.maxHistoryCount);
    }

    private calcReadyDate(percent: number): Optional<Date> {
        const now = Date.now();
        const percentRemaining = 1 - percent;
        const approxTotalReadyTimeMs = this.avgUpdateRateMs / this.avgIncrement; // Estimated total time for 100% ultimate
        const approxTimeRemainingMs = percentRemaining * approxTotalReadyTimeMs;
        const rawEstReadyMs = now + approxTimeRemainingMs;
        const estReadyDate = new Date(rawEstReadyMs);

        console.debug(
            `[${this.constructor.name}] [Calculation] ` +
                `Est Total Time ~"${formatDistanceToNowStrict(new Date().getTime() + approxTotalReadyTimeMs, { unit: "second" })}", ` +
                `Remaining ~"${formatDistanceToNowStrict(new Date().getTime() + approxTimeRemainingMs, { unit: "second" })}", ` +
                `Ready ~"${format(estReadyDate, "yyyy:mm:dd kk:mm:ss")}", ` +
                `History: ${this.ultimateProgressHistory.length}, ` +
                `Increment: ${formatPercent(this.avgIncrement, "en-US")}, ` +
                `Rate: ${this.avgUpdateRateMs / 1000}sec, ` +
                `Confidence: ${this.confidenceLevel} (${formatPercent(this.confidenceAmount, "en-US")})`
        );

        return estReadyDate;
    }

    private calcConfidenceAmount(): number {
        let confidence = 0;
        const maxReadyDate = addMilliseconds(new Date(), this.config.facts.maxUltimateCooldownTime);
        const historyCount = this.ultimateProgressHistory.length;
        const percentVariance = mathAverageVariance(this.ultimateProgressHistory.map((u) => u.increment));
        const timeSecVariance = mathAverageVariance(this.ultimateProgressHistory.map((u) => u.timestamp.getTime() / 1000));

        // No estimation available
        if (this.isUltimateReady) return 1;
        // Cooldown is estimated to be higher than max amount possible
        if (this.maybeReadyDate && this.maybeReadyDate > maxReadyDate) confidence = confidence - 0.5;
        // The longer the history, the higher the confidence
        confidence += Number((historyCount / this.maxHistoryCount).toFixed(4));
        // The more variance in the percents, lower the confidence
        confidence -= Number((percentVariance * 0.1).toFixed(4));
        // The more variance in the timestamps, lower the confidence
        confidence -= Number((timeSecVariance * 0.01).toFixed(4));

        return mathClamp(confidence, 0, 1);
    }
}

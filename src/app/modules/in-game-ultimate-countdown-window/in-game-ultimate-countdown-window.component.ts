import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { GameStage } from "@common/game";
import { GameEventsService } from "@core/game";
import { isValid } from "date-fns";
import { Subject, timer } from "rxjs";
import { filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

const DEBUG = !environment.production;

const ULTIMATE_MAX_MS = 600 * 1000;
const NUM_PROGRESS_HISTORY = 4;
const ULTIMATE_ACCEL_DETECTION = 0.2;
const UI_COUNTDOWN_REFRESH_RATE = 1000;

interface UltimateProgress {
    timestamp: Date;
    percent: number;
}

@Component({
    selector: "app-in-game-ultimate-countdown-window",
    templateUrl: "./in-game-ultimate-countdown-window.component.html",
    styleUrls: ["./in-game-ultimate-countdown-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InGameUltimateCountdownWindowComponent implements OnInit, OnDestroy {
    public isDateValid = isValid;
    public isDebug = DEBUG && false;
    public primaryTitle = "In Game Ultimate Countdown";
    public secondaryTitle = "";

    public showCountdown = false;
    public ultimatePercent = 0;
    /**
     * @returns {Date} time remaining
     * @returns {undefined} if ready date is invalid
     */
    public get ultimateReadyRemaining(): Date | undefined {
        if (!isValid(this.ultimateReadyDate)) return new Date(0);
        const readyDate = this.ultimateReadyDate as Date;
        const now = new Date();
        const remaining = new Date(readyDate.getTime() - now.getTime());
        return remaining?.getTime() <= 0 ? new Date(0) : remaining;
    }

    private avgTimestampRate = 0;
    private avgPercentRate = 0;
    private ultimateProgressHistory: UltimateProgress[] = [];
    private ultimateReadyDate?: Date;

    private _unsubscribe = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly gameEvents: GameEventsService) {
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
        type MeUltimateCooldown = overwolf.gep.ApexLegends.ApexLegendsMatchInfoMeUltimateCooldown;
        this.gameEvents.gameStage$
            .pipe(
                takeUntil(this._unsubscribe),
                // Showing or hiding window
                tap((gameStage) => {
                    if (gameStage === GameStage.InGame) {
                        this.showCountdown = true;
                    } else {
                        this.showCountdown = false;
                        this.resetPercentHistory();
                    }
                    console.debug(
                        `Game Stage is "${gameStage}". ${this.showCountdown ? "Showing" : "Hiding"} Ultimate Countdown`
                    );
                }),
                // Start Ultimate calculation
                filter((gameStage) => gameStage === GameStage.InGame || gameStage === GameStage.InGameKnocked),
                switchMap(() => this.gameEvents.gameInfo$),
                filter((infoData) => infoData?.feature === "me" && !!infoData.info.me?.ultimate_cooldown),
                map((infoData) => {
                    const ultCooldownJSON = infoData?.info.me?.ultimate_cooldown;
                    const ultCooldownObj = JSON.tryParse<MeUltimateCooldown>(ultCooldownJSON as string);
                    const ultCooldown = parseInt(ultCooldownObj?.ultimate_cooldown as string);
                    return ultCooldown / 100;
                }),
                tap((percent) => this.addPercentHistory((this.ultimatePercent = percent))),
                map((percent) => {
                    const adjustedNow = new Date().getTime();
                    return this.calcReadyDate(percent, this.ultimateProgressHistory, new Date(adjustedNow));
                }),
                tap((readyDate) => (this.ultimateReadyDate = readyDate)),
                switchMap(() => timer(0, UI_COUNTDOWN_REFRESH_RATE)),
                tap(() => this.cdr.detectChanges())
            )
            .subscribe();
    }

    private resetPercentHistory(): void {
        console.debug("Ultimate Countdown history reset");
        this.ultimateProgressHistory = [];
    }

    private addPercentHistory(newPercent: number): void {
        const now = new Date();
        const hist = this.ultimateProgressHistory;
        const delta = newPercent - (hist[hist.length - 1]?.percent ?? 0);

        if (hist.length >= NUM_PROGRESS_HISTORY && this.avgPercentRate > 0) {
            if (this.ultimatePercent < 0.01) {
                // Ultimate percent has been reset
                console.log("Ultimate expendature detected");
                this.resetPercentHistory();
            } else if (delta > ULTIMATE_ACCEL_DETECTION) {
                // Player likely used an Ultimate accelerant
                console.log("Ultimate Accelerant detected");
                this.resetPercentHistory();
            }
        }

        this.ultimateProgressHistory.push({
            timestamp: now,
            percent: newPercent,
        });
        this.ultimateProgressHistory = this.ultimateProgressHistory.slice(-NUM_PROGRESS_HISTORY);
    }

    private calcReadyDate(percent: number, history: UltimateProgress[], date: Date): Date | undefined {
        const timestamps = history.map((h) => h.timestamp.getTime());
        const percents = history.map((h) => h.percent);
        this.avgTimestampRate = (this.avgTimestampRate + timestamps.averageRate()) / 2;
        this.avgPercentRate = (this.avgPercentRate + percents.averageRate()) / 2;
        const percentRemaining = 1 - percent;

        const avgRemaining = (percentRemaining / (this.avgPercentRate * this.avgTimestampRate)) * this.avgTimestampRate;
        const avgRemainingMs = avgRemaining * this.avgTimestampRate;

        return new Date(date.getTime() + avgRemainingMs);
    }
}

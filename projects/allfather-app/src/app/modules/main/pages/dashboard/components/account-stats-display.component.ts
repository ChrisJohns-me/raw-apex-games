import { PlayerAccountStats } from "@allfather-app/app/common/player-account-stats";
import { GameProcessService } from "@allfather-app/app/common/services/game-process.service";
import { MozambiqueherePlatform } from "@allfather-app/app/common/services/player-account-stats/player-account-stats-mozambiquehere-dto";
import { PlayerAccountStatsService } from "@allfather-app/app/common/services/player-account-stats/player-account-stats.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { isEmpty } from "common/utilities/";
import { Observable, Subject, timer } from "rxjs";
import { filter, switchMap, take, takeUntil, tap } from "rxjs/operators";

const STATS_SLOW_POLL_DELAY = 10 * 60 * 1000;
const STATS_FAST_POLL_DELAY = 15 * 1000;

@Component({
    selector: "app-account-stats-display",
    templateUrl: "./account-stats-display.component.html",
    styleUrls: ["./account-stats-display.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountStatsDisplayComponent implements OnInit, OnDestroy {
    public Infinity = Infinity;
    public myAccountStats?: PlayerAccountStats;

    private latestAccountStatsVersion?: number;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly gameProcess: GameProcessService,
        private readonly match: MatchService,
        private readonly player: PlayerService,
        private readonly playerAccountStats: PlayerAccountStatsService
    ) {}

    public ngOnInit(): void {
        this.setupSlowStatsPolling();
        this.setupFastStatsPolling();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /** Strips out spaces, special characters, lower-cases input */
    public cleanCSSClassName(input?: string): string {
        return `${input?.toLowerCase().replace(/[_\W]+/, "") ?? ""}`;
    }

    /**
     * Poll the account stats API every:
     *  10 minutes if Game Process is running.
     *  60 minutes if Game Process is not running.
     */
    private setupSlowStatsPolling(): void {
        timer(0, STATS_SLOW_POLL_DELAY)
            .pipe(
                takeUntil(this.destroy$),
                // Game running OR 6 x SLOW POLL DELAY
                filter((increment) => !!this.gameProcess.isRunning$.value || increment % 6 === 0),
                tap(() => {
                    const reason = this.gameProcess.isRunning$.value ? "Game Running" : (STATS_SLOW_POLL_DELAY * 6) / 1000 + "sec";
                    console.trace(`[${this.constructor.name}] (${reason}) Slow polling for account stats (cache allowed)`);
                }),
                switchMap(() => this.getAccountStats$())
            )
            .subscribe((myStats: PlayerAccountStats) => {
                this.handleAccountStatsData(myStats);
            });
    }

    /**
     * Poll the account stats API every X seconds:
     *  After a match ends
     *  Until stats version changes
     *  Max 10 times (per match)
     *  Forces breaks cache
     */
    private setupFastStatsPolling(): void {
        const maxPostMatchFetches = 10;
        let isPolling = false;

        this.match.endedEvent$
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (isPolling = true)),
                switchMap(() => timer(0, STATS_FAST_POLL_DELAY).pipe(take(maxPostMatchFetches))),
                filter(() => isPolling),
                tap(() => console.trace(`[${this.constructor.name}] (Match ended) Fast polling for account stats (cache breaking)`)),
                switchMap(() => this.getAccountStats$(true))
            )
            .subscribe((myStats: PlayerAccountStats) => {
                if (this.latestAccountStatsVersion !== myStats.statsVersion) {
                    isPolling = false;
                    this.handleAccountStatsData(myStats);
                }
            });
    }

    private getAccountStats$(breakCache = false): Observable<PlayerAccountStats> {
        return this.player.myName$.pipe(
            filter((myName) => !isEmpty(myName)),
            switchMap((myName) => this.playerAccountStats.getPlayerAccountStats$(myName!, MozambiqueherePlatform.PC, breakCache)),
            tap((accountStats) => console.trace(`[${this.constructor.name}] Received account stats for "${accountStats.playerName}"`))
        );
    }

    private handleAccountStatsData(accountStats: PlayerAccountStats): void {
        this.myAccountStats = accountStats;
        this.latestAccountStatsVersion = accountStats.statsVersion;

        this.cdr.detectChanges();
    }
}

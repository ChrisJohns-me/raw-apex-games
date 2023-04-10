import { Injectable, OnDestroy } from "@angular/core";
import { PlayerAccountStats } from "@raw-apex-games-app/app/common/player-account-stats";
import { SingletonServiceProviderFactory } from "@raw-apex-games-app/app/singleton-service.provider.factory";
import { isEmpty } from "common/utilities";
import { BehaviorSubject, Observable, Subject, filter, switchMap, take, takeUntil, tap, timer } from "rxjs";
import { GameProcessService } from "../game-process.service";
import { MatchService } from "../match/match.service";
import { PlayerService } from "../player.service";
import { MozambiqueherePlatform } from "./player-account-stats-mozambiquehere-dto";
import { PlayerAccountStatsService } from "./player-account-stats.service";

const STATS_SLOW_POLL_DELAY = 10 * 60 * 1000;
const STATS_FAST_POLL_DELAY = 15 * 1000;

/**
 * @class MyPlayerAccountStatsService
 * @classdesc Polls an external API for my player's account stats;
 *  uses matchEnd event to help determine if poll rate should be fast or slow.
 */
@Injectable({
    providedIn: "root",
    deps: [GameProcessService, MatchService, PlayerService, PlayerAccountStatsService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MyPlayerAccountStatsService", MyPlayerAccountStatsService, deps),
})
export class MyPlayerAccountStatsService implements OnDestroy {
    public myAccountStats$ = new BehaviorSubject<Optional<PlayerAccountStats>>(undefined);

    private latestAccountStatsVersion?: number;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly gameProcess: GameProcessService,
        private readonly match: MatchService,
        private readonly player: PlayerService,
        private readonly playerAccountStats: PlayerAccountStatsService
    ) {
        this.setupSlowStatsPolling();
        this.setupFastStatsPolling();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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

        this.match.onMatchDataStoreChanged$
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
        this.myAccountStats$.next(accountStats);
        this.latestAccountStatsVersion = accountStats.statsVersion;
    }
}

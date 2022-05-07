import { PlayerAccountStats } from "@allfather-app/app/common/player-account-stats";
import { MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MyPlayerAccountStatsService } from "@allfather-app/app/modules/core/player-account-stats/my-player-account-stats.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { isEmpty, mathAverageRate } from "common/utilities";
import { isDate } from "date-fns";
import { Subject } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";

const AVG_RP_MATCH_LIMIT = 10;

@Component({
    selector: "app-account-stats-display",
    templateUrl: "./account-stats-display.component.html",
    styleUrls: ["./account-stats-display.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountStatsDisplayComponent implements OnInit, OnDestroy {
    /** Per ranked game */
    public averageRPRate?: number;
    public Infinity = Infinity;
    public myAccountStats?: PlayerAccountStats;

    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly match: MatchService,
        private readonly myPlayerAccountStats: MyPlayerAccountStatsService
    ) {}

    public ngOnInit(): void {
        this.setupStatsEventListener();
        this.setupLiveMatchListeners();

        this.match
            .getAllMatchData$()
            .pipe(takeUntil(this.destroy$))
            .subscribe((matchList) => {
                this.averageRPRate = this.calcAverageRPRate(matchList);
                this.refreshUI();
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /** Strips out spaces, special characters, lower-cases input */
    public cleanCSSClassName(input?: string): string {
        return input?.toLowerCase().replace(/[_\W]+/, "") ?? "";
    }

    /** Calculates the Average Rank Score gained/lost per hour. */
    private calcAverageRPRate(matchList: MatchDataStore[]): Optional<number> {
        const rankedMatches = matchList
            .filter((match) => !isEmpty(match.rankScore) && !!match.endDate && isDate(match.endDate))
            .slice(0, AVG_RP_MATCH_LIMIT)
            .sort((a, b) => a.endDate!.getTime() - b.endDate!.getTime());
        const rankedScores: number[] = rankedMatches.map((match) => match.rankScore!);
        if (rankedScores.length < 2) return;

        const avgRPRate = mathAverageRate(rankedScores);
        return avgRPRate;
    }

    private setupStatsEventListener(): void {
        this.myPlayerAccountStats.myAccountStats$.pipe(takeUntil(this.destroy$)).subscribe((myAccountStats) => {
            this.myAccountStats = myAccountStats;
            this.refreshUI();
        });
    }

    private setupLiveMatchListeners(): void {
        this.match.onMatchDataStoreChanged$ // Match was updated or added to local database
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.match.getAllMatchData$())
            )
            .subscribe((matchList) => {
                this.averageRPRate = this.calcAverageRPRate(matchList);
                this.refreshUI();
            });
    }

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
}

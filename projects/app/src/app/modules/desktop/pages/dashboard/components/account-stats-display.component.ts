import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatchService } from "@app/modules/core/match/match.service.js";
import { Subject } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";

@Component({
    selector: "app-account-stats-display",
    templateUrl: "./account-stats-display.component.html",
    styleUrls: ["./account-stats-display.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountStatsDisplayComponent implements OnInit, OnDestroy {
    public Infinity = Infinity;
    public myAccountStats?: unknown;

    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly match: MatchService) {}

    public ngOnInit(): void {
        this.setupLiveMatchListeners();

        this.match
            .getAllMatchData$()
            .pipe(takeUntil(this.destroy$))
            .subscribe((matchList) => {
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

    private setupLiveMatchListeners(): void {
        this.match.onMatchDataStoreChanged$ // Match was updated or added to local database
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.match.getAllMatchData$())
            )
            .subscribe((matchList) => {
                this.refreshUI();
            });
    }

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
}

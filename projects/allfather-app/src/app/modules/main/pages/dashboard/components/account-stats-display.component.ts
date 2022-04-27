import { PlayerAccountStats } from "@allfather-app/app/common/player-account-stats";
import { MyPlayerAccountStatsService } from "@allfather-app/app/modules/core/player-account-stats/my-player-account-stats.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "app-account-stats-display",
    templateUrl: "./account-stats-display.component.html",
    styleUrls: ["./account-stats-display.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountStatsDisplayComponent implements OnInit, OnDestroy {
    public Infinity = Infinity;
    public myAccountStats?: PlayerAccountStats;

    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly myPlayerAccountStats: MyPlayerAccountStatsService) {}

    public ngOnInit(): void {
        this.setupStatsEventListener();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /** Strips out spaces, special characters, lower-cases input */
    public cleanCSSClassName(input?: string): string {
        return `${input?.toLowerCase().replace(/[_\W]+/, "") ?? ""}`;
    }

    private setupStatsEventListener(): void {
        this.myPlayerAccountStats.myAccountStats$.pipe(takeUntil(this.destroy$)).subscribe((myAccountStats) => {
            this.myAccountStats = myAccountStats;
            this.cdr.detectChanges();
        });
    }
}

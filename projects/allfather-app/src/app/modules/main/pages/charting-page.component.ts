import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";
import { MatchDataStore } from "../../core/local-database/match-data-store";
import { MatchService } from "../../core/match/match.service";

@Component({
    selector: "app-charting-page",
    templateUrl: "./charting-page.component.html",
    styleUrls: ["./charting-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartingPageComponent implements OnInit, AfterViewInit, OnDestroy {
    public isLoadingMatchList = false;
    public matchList: MatchDataStore[] = [];

    private numDaysToShow = 30;
    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly match: MatchService) {}

    //#region Lifecycle Methods
    public ngOnInit(): void {}

    public ngAfterViewInit(): void {
        this.refreshUI();

        this.getMatchList()
            .pipe(takeUntil(this.destroy$))
            .subscribe((matchList) => {
                this.matchList = matchList;
                this.refreshUI();
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
    //#endregion

    private getMatchList(): Observable<MatchDataStore[]> {
        this.isLoadingMatchList = true;
        return this.match.getAllMatchData$().pipe(
            takeUntil(this.destroy$),
            finalize(() => (this.isLoadingMatchList = false))
        );
    }

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
}

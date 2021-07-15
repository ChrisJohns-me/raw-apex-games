import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { ReportedPlayer } from "@shared/player-report/reported-player";
import { ReportedPlayersService } from "@siren-app/app/modules/core/report-list/report-list.service";
import { of, Subject } from "rxjs";
import { catchError, takeUntil, tap } from "rxjs/operators";

export enum ReportedPlayerPageView {
    Latest = "latest",
}

@Component({
    selector: "app-reported-players-page",
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./reported-players-page.component.html",
    styleUrls: ["./reported-players-page.component.scss"],
})
export class ReportedPlayersPageComponent implements OnInit {
    @Input() public view: ReportedPlayerPageView = ReportedPlayerPageView.Latest;

    public reportedPlayerList: ReportedPlayer[] = [];
    public isLoadingReportedPlayerList = false;
    public hasLoadingReportedPlayerListError = false;

    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly reportedPlayers: ReportedPlayersService) {}

    public reportedPlayerTrackBy = (index: number, name: ReportedPlayer): string => name.id;

    public ngOnInit(): void {
        this.updateReportedPlayers();
    }

    private updateReportedPlayers(): void {
        if (this.isLoadingReportedPlayerList) return;
        this.isLoadingReportedPlayerList = true;
        const numDays = 14;
        this.reportedPlayers
            .getLatestReportedPlayers$(numDays)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (this.isLoadingReportedPlayerList = false)),
                catchError(() => {
                    this.hasLoadingReportedPlayerListError = true;
                    return of([]);
                })
            )
            .subscribe((reportedPlayers) => {
                this.hasLoadingReportedPlayerListError = false;
                this.reportedPlayerList = reportedPlayers;
                this.cdr.detectChanges();
            });
    }
}

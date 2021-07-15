import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ReportReason } from "@shared/player-report/report-reason";
import { ReportedPlayersService } from "@siren-app/app/modules/core/report-list/report-list.service";
import { randomString } from "common/utilities";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "app-report-players",
    templateUrl: "./report-players.component.html",
    styleUrls: ["./report-players.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportPlayersComponent implements OnInit, OnDestroy {
    public randomString = randomString;
    public reportReasonOpts = Object.entries(ReportReason);
    public reportPlayerForm = new FormGroup({
        inGameUsername: new FormControl("Enemy" + Math.round(Math.random() * 1000)),
        rosterHash: new FormControl(randomString(32)),
        reportReason: new FormControl(ReportReason.Aimbot),
        isLocalReportOnly: new FormControl(false),
    });
    public newReportedPlayerId?: string;

    private destroy$ = new Subject<void>();

    constructor(private readonly reportedPlayers: ReportedPlayersService, private readonly cdr: ChangeDetectorRef) {}

    public ngOnInit(): void {}

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onReportPlayerFormSubmit(): void {
        const inGameUsername = this.reportPlayerForm.get("inGameUsername")?.value ?? "";
        const rosterHash = this.reportPlayerForm.get("rosterHash")?.value ?? randomString(32);
        const reportReason = this.reportPlayerForm.get("reportReason")?.value ?? "";
        const isLocalReportOnly = this.reportPlayerForm.get("isLocalReportOnly")?.value ?? false;

        if (isLocalReportOnly) {
            this.localReport(randomString(20), inGameUsername, rosterHash, reportReason);
        } else {
            this.reportedPlayers
                .reportPlayer$(inGameUsername, reportReason, rosterHash, "MasterKriff", "MasterKriff")
                .pipe(takeUntil(this.destroy$))
                .subscribe((newReportedPlayerId) => {
                    this.newReportedPlayerId = newReportedPlayerId;
                    this.localReport(newReportedPlayerId, inGameUsername, rosterHash, reportReason);
                    this.cdr.detectChanges();
                });
        }
    }

    private localReport(id: string, inGameUsername: string, rosterHash: string, reportReason: ReportReason): void {
        this.reportedPlayers
            .storeLocalReportedPlayer$(id, inGameUsername, reportReason, rosterHash)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatchRosterPlayer } from "@shared-app/match/roster-player";
import { ReportReason } from "@shared/player-report/report-reason";
import { APP_NAME } from "@siren-app/app/common/app";
import { addMilliseconds } from "date-fns";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatchKillfeedService } from "../../core/match/match-killfeed.service";
import { PlayerService } from "../../core/player.service";
import { HUDReportPlayerWindowService } from "./hud-report-player-window.service";

const AUTO_DISMISS_TIMEOUT = 20000;

/**
 * Cancels the auto dismiss timer on mouse click.
 * When report form is not started:
 * - Pauses the auto dismiss timer when mouse over.
 * - Unpauses the auto dismiss timer when mouse out.
 */
@Component({
    selector: "app-hud-report-player-window",
    templateUrl: "./hud-report-player-window.component.html",
    styleUrls: ["./hud-report-player-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HUDReportPlayerWindowComponent implements OnInit, OnDestroy {
    public primaryTitle = "In Game Report Player";
    public secondaryTitle = "";
    public APP_NAME = APP_NAME;
    public reportReasonOpts = Object.entries(ReportReason);

    public autoDismissDate = this.getAutoDismissDate();
    public isAutoDismissPaused = false;
    public isAutoDismissCanceled = false;
    public killedBy?: MatchRosterPlayer;
    public myName?: string;
    public startReportForm = false;
    public reportForm = new FormGroup({
        reason: new FormControl("", [Validators.required]),
        agreement1: new FormControl(false, [Validators.required]),
        agreement2: new FormControl(false, [Validators.required]),
    });

    public get friendlySelectedReportReason(): string {
        return this.reportForm.value?.reason ?? "";
    }

    private deathDate?: Date;

    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly hudReportPlayerWindow: HUDReportPlayerWindowService,
        private readonly matchKillfeed: MatchKillfeedService,
        private readonly player: PlayerService
    ) {}

    public ngOnInit(): void {
        this.watchKilledByEvent();
        this.setupMyName();
        console.log(this.reportReasonOpts);
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onSubmitReportClick(): void {}

    public onDismissClick(): void {
        this.hudReportPlayerWindow.close().pipe(takeUntil(this.destroy$)).subscribe();
    }

    public pauseAutoDismiss(): void {
        this.isAutoDismissPaused = true;
        this.autoDismissDate = this.getAutoDismissDate();
        this.cdr.detectChanges();
    }

    public unpauseAutoDismiss(): void {
        this.isAutoDismissPaused = false;
        this.autoDismissDate = this.getAutoDismissDate();
        this.cdr.detectChanges();
    }

    public cancelAutoDismiss(): void {
        this.isAutoDismissCanceled = true;
        this.autoDismissDate = this.getAutoDismissDate();
        this.cdr.detectChanges();
    }

    private watchKilledByEvent(): void {
        this.matchKillfeed.killedByEvent$.pipe(takeUntil(this.destroy$)).subscribe((killedByPlayer) => {
            this.deathDate = new Date();
            this.killedBy = killedByPlayer;
            this.cdr.detectChanges();
        });
    }

    private setupMyName(): void {
        this.player.myName$.pipe(takeUntil(this.destroy$)).subscribe((myName) => (this.myName = myName));
    }

    /**
     * @returns dismiss date.
     * @returns {undefined} if paused or canceled
     */
    private getAutoDismissDate(): Optional<Date> {
        if (this.isAutoDismissPaused) return;
        if (this.isAutoDismissCanceled) return;

        return addMilliseconds(new Date(), AUTO_DISMISS_TIMEOUT);
    }
}

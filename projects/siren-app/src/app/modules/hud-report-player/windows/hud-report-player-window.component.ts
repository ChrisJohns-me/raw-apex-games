import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatchRosterPlayer } from "@shared-app/match/roster-player";
import { OverwolfProfileService } from "@shared-app/services/overwolf/overwolf-profile.service";
import { ReportReason } from "@shared/player-report/report-reason";
import { generateRosterHash } from "@shared/roster-hash";
import { APP_NAME } from "@siren-app/app/common/app";
import { isEmpty } from "common/utilities";
import { addMilliseconds } from "date-fns";
import { of, Subject } from "rxjs";
import { catchError, filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { MatchKillfeedService } from "../../core/match/match-killfeed.service";
import { MatchRosterService } from "../../core/match/match-roster.service";
import { PlayerService } from "../../core/player.service";
import { ReportedPlayersService } from "../../core/report-list/report-list.service";
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
        agreement1: new FormControl(false, [Validators.requiredTrue]),
        agreement2: new FormControl(false, [Validators.requiredTrue]),
    });
    public reportingSuccess = false;
    public reportingFailed = false;
    public reportingFailedMsg?: string;
    public get reportingInProgress(): boolean {
        return this._reportingInProgress;
    }
    public set reportingInProgress(value: boolean) {
        if (value) this.reportForm.disable();
        else this.reportForm.enable();
        this._reportingInProgress = value;
    }

    private _reportingInProgress = false;

    public get friendlySelectedReportReason(): string {
        const reasonKey = this.reportForm.value?.reason;
        return Object.entries(ReportReason).find(([, value]) => value === reasonKey)?.[0] ?? "";
    }

    private deathDate?: Date;

    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly hudReportPlayerWindow: HUDReportPlayerWindowService,
        private readonly matchKillfeed: MatchKillfeedService,
        private readonly matchRoster: MatchRosterService,
        private readonly overwolfProfile: OverwolfProfileService,
        private readonly player: PlayerService,
        private readonly reportedPlayers: ReportedPlayersService
    ) {}

    public ngOnInit(): void {
        this.watchKilledByEvent();
        this.setupMyName();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onSubmitReportClick(): void {
        this.reportingInProgress = true;
        this.reportingFailed = false;
        this.reportingSuccess = false;

        const reportedPlayerInGameUsername = this.killedBy?.name ?? "";
        const reportedReason = (Object.entries(ReportReason).find(([, value]) => value === this.reportForm.value?.reason)?.[1] ??
            "") as ReportReason;
        const rosterHash = generateRosterHash(this.matchRoster.matchRoster$.value.allPlayers.map((roster) => roster.name));
        const myInGameUsername = this.player.myName$.value ?? "";
        let myOverwolfUsername: string;
        this.overwolfProfile
            .getCurrentUser()
            .pipe(
                takeUntil(this.destroy$),
                tap((overwolfProfile) => (myOverwolfUsername = overwolfProfile.username ?? "")),
                map(() => {
                    // Validate before reporting
                    if (isEmpty(reportedPlayerInGameUsername)) {
                        this.reportingFailedMsg = `Player's username is missing`;
                        return false;
                    }
                    if (isEmpty(reportedReason) || !Object.values(ReportReason).includes(reportedReason)) {
                        this.reportingFailedMsg = `Reporting reason is missing`;
                        return false;
                    }
                    if (isEmpty(rosterHash)) {
                        this.reportingFailedMsg = `Required match information is missing`;
                        return false;
                    }
                    if (isEmpty(myOverwolfUsername)) {
                        this.reportingFailedMsg = `Your Overwolf username is missing`;
                        return false;
                    }
                    if (isEmpty(myInGameUsername)) {
                        this.reportingFailedMsg = `Your in-game username is missing`;
                        return false;
                    }
                    return true;
                }),
                tap((dataIsValid) => {
                    this.reportingFailed = !dataIsValid;
                    this.reportingInProgress = dataIsValid;
                    this.cdr.detectChanges();
                }),
                filter((dataIsValid) => dataIsValid),
                switchMap(() =>
                    this.reportedPlayers.reportPlayer$(
                        reportedPlayerInGameUsername,
                        reportedReason,
                        rosterHash,
                        myOverwolfUsername,
                        myInGameUsername
                    )
                ),
                catchError((err) => {
                    this.reportingFailed = true;
                    this.reportingFailedMsg = err.message;
                    this.reportingInProgress = false;
                    this.reportingSuccess = false;
                    this.cdr.detectChanges();
                    return of(undefined);
                })
            )
            .subscribe((reportedPlayerId) => {
                if (!isEmpty(reportedPlayerId)) {
                    this.reportingSuccess = true;
                    this.reportingFailed = false;
                    this.reportingInProgress = false;
                    this.cdr.detectChanges();
                }
            });
    }

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

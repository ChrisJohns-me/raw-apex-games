import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { environment } from "@siren-app/environments/environment";
import { addMilliseconds } from "date-fns";
import { Subject, Subscription, timer } from "rxjs";
import { delay, switchMap, takeUntil, tap } from "rxjs/operators";
import { HUDNotification } from "../hud-notification";
import { HUDNotificationWindowService } from "./hud-notification-window.service";
import { HUDNotificationService } from "./hud-notification.service";

const DEFAULT_TIMEOUTMS = 10000;

@Component({
    selector: "app-hud-notification-window",
    templateUrl: "./hud-notification-window.component.html",
    styleUrls: ["./hud-notification-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HUDNotificationWindowComponent implements OnInit, OnDestroy {
    public DEBUG_KEEP_OPEN = environment.DEV && false;
    public primaryTitle = "In Game Notification";
    public secondaryTitle = "";

    public isAutoDismissPaused = false;
    public title?: HUDNotification["title"];
    public body?: HUDNotification["body"];
    public autoDismissDate?: Date;

    private autoDismissTimerSubscription?: Subscription;
    private timeoutMs?: number;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly hudNotification: HUDNotificationService,
        private readonly hudNotificationWindow: HUDNotificationWindowService
    ) {}

    public ngOnInit(): void {
        this.watchNotifications();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public pauseAutoDismiss(): void {
        this.isAutoDismissPaused = true;
        this.autoDismissTimerSubscription?.unsubscribe();
        this.autoDismissDate = undefined;
        console.log("Auto dismiss paused");
    }

    public restartAutoDismiss(): void {
        this.isAutoDismissPaused = false;
        this.resetAutoDismissTimer();
        console.log("Auto dismiss unpaused");
    }

    private watchNotifications(): void {
        this.hudNotification.notification$
            .pipe(
                takeUntil(this.destroy$),
                tap((notification) => {
                    this.title = notification.title;
                    this.body = notification.body;
                    this.timeoutMs = notification.timeoutMs;
                    this.resetAutoDismissTimer();
                })
            )
            .subscribe();
    }

    private resetAutoDismissTimer(): void {
        const duration = this.timeoutMs ?? DEFAULT_TIMEOUTMS;
        this.autoDismissTimerSubscription = timer(0, duration)
            .pipe(
                takeUntil(this.destroy$),
                delay(duration),
                switchMap(() => this.hudNotificationWindow.close())
            )
            .subscribe();
        this.autoDismissDate = addMilliseconds(new Date(), duration);
        this.cdr.detectChanges();
    }
}

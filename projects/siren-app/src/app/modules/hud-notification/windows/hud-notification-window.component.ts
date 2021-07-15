import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { of, Subject } from "rxjs";
import { delay, switchMap, takeUntil } from "rxjs/operators";
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
    public primaryTitle = "In Game Notification";
    public secondaryTitle = "";

    private destroy$ = new Subject<void>();

    constructor(
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

    private watchNotifications(): void {
        this.hudNotification.notification$
            .pipe(
                takeUntil(this.destroy$),
                switchMap((notification) => {
                    return of(undefined).pipe(
                        delay(notification.timeoutMs ?? DEFAULT_TIMEOUTMS),
                        switchMap(() => this.hudNotificationWindow.close())
                    );
                })
            )
            .subscribe();
    }
}

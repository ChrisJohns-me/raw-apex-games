import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { HUDNotification } from "@siren-app/app/modules/hud-notification/hud-notification";
import { HUDNotificationWindowService } from "@siren-app/app/modules/hud-notification/windows/hud-notification-window.service";
import { HUDNotificationService } from "@siren-app/app/modules/hud-notification/windows/hud-notification.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "app-notification-simulator",
    templateUrl: "./notification-simulator.component.html",
    styleUrls: ["./notification-simulator.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSimulatorComponent implements OnInit, OnDestroy {
    public notificationForm = new FormGroup({
        title: new FormControl("Test Notification"),
        body: new FormControl("This is a notification"),
        durationSeconds: new FormControl(10),
    });

    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly hudNotification: HUDNotificationService,
        private readonly hudNotificationWindow: HUDNotificationWindowService
    ) {}

    public ngOnInit(): void {}

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onReportPlayerFormSubmit(): void {
        const newNotification: HUDNotification = {
            title: this.notificationForm.get("title")?.value ?? "",
            body: this.notificationForm.get("body")?.value ?? "",
            timeoutMs: (this.notificationForm.get("durationSeconds")?.value ?? 10) * 1000,
        };

        this.hudNotificationWindow
            .open()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.hudNotification.notification$.next(newNotification);
            });
    }
}

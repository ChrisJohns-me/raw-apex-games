import { Injectable } from "@angular/core";
import { BaseService } from "@shared-app/services/base-service.abstract";
import { GameProcessService } from "@shared-app/services/game-process.service";
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { APP_NAME } from "@siren-app/app/common/app";
import { Subscription } from "rxjs";
import { filter, switchMap, takeUntil } from "rxjs/operators";
import { MatchKillfeedService } from "../core/match/match-killfeed.service";
import { HUDNotification } from "../hud-notification/hud-notification";
import { HUDNotificationWindowService } from "../hud-notification/windows/hud-notification-window.service";
import { HUDNotificationService } from "../hud-notification/windows/hud-notification.service";
import { HUDReportPlayerWindowService } from "../hud-report-player/windows/hud-report-player-window.service";

@Injectable({
    providedIn: "root",
    deps: [GameProcessService, HUDNotificationService, HUDNotificationWindowService, HUDReportPlayerWindowService, MatchKillfeedService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("HUDWindowControllerService", HUDWindowControllerService, deps),
})
export class HUDWindowControllerService extends BaseService {
    private watchEventsSubscription?: Subscription;

    constructor(
        private readonly gameProcess: GameProcessService,
        private readonly hudNotification: HUDNotificationService,
        private readonly hudNotificationWindow: HUDNotificationWindowService,
        private readonly hudReportPlayerWindow: HUDReportPlayerWindowService,
        private readonly matchKillfeed: MatchKillfeedService
    ) {
        super();
    }

    public startWatchEvents(): void {
        this.watchGameStartupEvent();
        this.watchKilledByEvent();
    }

    public stop(): void {
        this.watchEventsSubscription?.unsubscribe();
        this.watchEventsSubscription = undefined;
    }

    private watchGameStartupEvent(): void {
        const newNotification: HUDNotification = {
            title: `${APP_NAME} is running`,
            body: "",
            timeoutMs: 5000,
        };

        this.gameProcess.isRunning$
            .pipe(
                takeUntil(this.destroy$),
                filter((isRunning) => !!isRunning),
                switchMap(() => {
                    this.hudNotification.notification$.next(newNotification);
                    return this.hudNotificationWindow.open();
                })
            )
            .subscribe();
    }

    private watchKilledByEvent(): void {
        this.matchKillfeed.killedByEvent$
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.hudReportPlayerWindow.open())
            )
            .subscribe();
    }
}

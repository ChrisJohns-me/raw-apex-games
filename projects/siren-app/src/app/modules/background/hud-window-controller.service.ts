import { Injectable } from "@angular/core";
import { PlayerState } from "@shared-app/player-state";
import { BaseService } from "@shared-app/services/base-service.abstract";
import { GameProcessService } from "@shared-app/services/game-process.service";
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { APP_NAME } from "@siren-app/app/common/app";
import { MatchService } from "@siren-app/app/modules/core/match/match.service";
import { Subscription } from "rxjs";
import { filter, switchMap, takeUntil } from "rxjs/operators";
import { GameService } from "../core/game.service";
import { MatchPlayerService } from "../core/match/match-player.service";
import { SettingsService } from "../core/settings.service";
import { HUDDeathWindowService } from "../hud-death/windows/hud-death-window.service";
import { Notification } from "../hud-notification/notification";
import { HUDNotificationWindowService } from "../hud-notification/windows/hud-notification-window.service";
import { HUDNotificationService } from "../hud-notification/windows/hud-notification.service";

@Injectable({
    providedIn: "root",
    deps: [
        GameService,
        GameProcessService,
        HUDDeathWindowService,
        HUDNotificationService,
        HUDNotificationWindowService,
        MatchService,
        MatchPlayerService,
        SettingsService,
    ],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("HUDWindowControllerService", HUDWindowControllerService, deps),
})
export class HUDWindowControllerService extends BaseService {
    private watchEventsSubscription?: Subscription;

    constructor(
        private readonly game: GameService,
        private readonly gameProcess: GameProcessService,
        private readonly hudDeathWindow: HUDDeathWindowService,
        private readonly hudNotification: HUDNotificationService,
        private readonly hudNotificationWindow: HUDNotificationWindowService,
        private readonly match: MatchService,
        private readonly matchPlayer: MatchPlayerService,
        private readonly settings: SettingsService
    ) {
        super();
    }

    public startWatchEvents(): void {
        this.watchGameStartupEvents();
        this.watchDeathEvents();
    }

    public stop(): void {
        this.watchEventsSubscription?.unsubscribe();
        this.watchEventsSubscription = undefined;
    }

    private watchGameStartupEvents(): void {
        const newNotification: Notification = {
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

    private watchDeathEvents(): void {
        this.matchPlayer.myState$
            .pipe(
                takeUntil(this.destroy$),
                filter((myState) => myState === PlayerState.Eliminated),
                switchMap(() => this.hudDeathWindow.open())
            )
            .subscribe();
    }
}

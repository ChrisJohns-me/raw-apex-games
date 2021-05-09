import { APP_NAME } from "@allfather-app/app/shared/models/app";
import { GamePhase } from "@allfather-app/app/shared/models/game-phase";
import { environment } from "@allfather-app/environments/environment";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { merge, Subject } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";
import { GameService } from "../core/game.service";
import { DevelopmentToolsWindowService } from "../development-tools/windows/development-tools-window.service";
import { InflictionInsightWindowService } from "../in-game/infliction-insight/windows/infliction-insight-window.service";
import { MatchTimerWindowService } from "../in-game/match-timer/windows/match-timer-window.service";
import { UltTimerWindowService } from "../in-game/ult-timer/windows/ult-timer-window.service";
import { LegendSelectAssistWindowService } from "../legend-select-assist/windows/legend-select-assist-window.service";
import { MainWindowService } from "../main/main-window.service";
import { SystemTrayService } from "./system-tray.service";

@Component({
    selector: "app-background",
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundComponent implements OnInit, OnDestroy {
    private readonly isDestroyed$ = new Subject<void>();

    constructor(
        private readonly mainWindow: MainWindowService,
        private readonly developmentToolsWindow: DevelopmentToolsWindowService,
        private readonly game: GameService,
        private readonly inflictionInsightWindow: InflictionInsightWindowService,
        private readonly legendSelectAssistWindow: LegendSelectAssistWindowService,
        private readonly matchTimerWindow: MatchTimerWindowService,
        private readonly systemTray: SystemTrayService,
        private readonly titleService: Title,
        private readonly ultTimerWindow: UltTimerWindowService
    ) {
        this.titleService.setTitle(`${APP_NAME} - Background`);
        this.setupSystemTray();
    }

    public ngOnInit(): void {
        this.setupUIWindows();
    }

    public ngOnDestroy(): void {
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
    }

    private setupUIWindows(): void {
        if (environment.allowDevTools) this.developmentToolsWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();

        this.mainWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();

        this.game.phase$
            .pipe(
                takeUntil(this.isDestroyed$),
                switchMap((gamePhase) => {
                    const matchTimerWindow$ = gamePhase === GamePhase.InGame ? this.matchTimerWindow.open() : this.matchTimerWindow.close();
                    const ultTimerWindow$ = gamePhase === GamePhase.InGame ? this.ultTimerWindow.open() : this.ultTimerWindow.close();
                    const inflictionInsightWindow$ =
                        gamePhase === GamePhase.InGame ? this.inflictionInsightWindow.open() : this.inflictionInsightWindow.close();
                    const legendSelectAssistWindow$ =
                        gamePhase === GamePhase.LegendSelection
                            ? this.legendSelectAssistWindow.open()
                            : this.legendSelectAssistWindow.close();
                    return merge(matchTimerWindow$, ultTimerWindow$, inflictionInsightWindow$, legendSelectAssistWindow$);
                })
            )
            .subscribe();
    }

    private setupSystemTray(): void {
        this.systemTray.initTray();
    }
}

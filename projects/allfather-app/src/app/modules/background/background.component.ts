import { APP_NAME } from "@allfather-app/app/shared/models/app";
import { GamePhase } from "@allfather-app/app/shared/models/game-phase";
import { environment } from "@allfather-app/environments/environment";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";
import { GameService } from "../core/game.service";
import { LocalStorageKeys } from "../core/local-storage/local-storage-keys";
import { LocalStorageService } from "../core/local-storage/local-storage.service";
import { MatchService } from "../core/match/match.service";
import { OverwolfExtensionService } from "../core/overwolf/overwolf-extension.service";
import { DashboardWindowService } from "../dashboard/dashboard-window.service";
import { DevelopmentToolsWindowService } from "../development-tools/windows/development-tools-window.service";
import { LegendSelectAssistWindowService } from "../legend-select-assist/windows/legend-select-assist-window.service";
import { BackgroundService } from "./background.service";

@Component({
    selector: "app-background",
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundComponent implements OnInit, OnDestroy {
    private readonly isDestroyed$ = new Subject<void>();

    constructor(
        private readonly backgroundService: BackgroundService,
        private readonly dashboardWindow: DashboardWindowService,
        private readonly developmentToolsWindow: DevelopmentToolsWindowService,
        private readonly game: GameService,
        private readonly legendSelectAssistWindow: LegendSelectAssistWindowService,
        private readonly localStorage: LocalStorageService,
        private readonly match: MatchService,
        private readonly overwolfExtension: OverwolfExtensionService,
        private readonly titleService: Title
    ) {
        this.titleService.setTitle(`${APP_NAME} - Background`);
    }

    public ngOnInit(): void {
        console.error(
            `Overwolf Error (see: https://discuss.overwolf.com/t/apex-legends-events-completly-stop-if-overwolf-is-being-relaunched-while-game-is-already-open/495).`
        );
        if (this.needsRelaunch()) {
            console.error(`Relaunching ${APP_NAME}...`);
            this.doRelaunch();
            return;
        }

        console.debug(`${APP_NAME} relaunched.`);
        this.clearRelaunch();
        this.backgroundService.startBackgroundServices();
        this.registerUIWindows();
    }

    public ngOnDestroy(): void {
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
    }

    private registerUIWindows(): void {
        if (environment.allowDevTools) this.developmentToolsWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();

        this.dashboardWindow.open().pipe(takeUntil(this.isDestroyed$)).subscribe();

        this.game.phase$
            .pipe(
                takeUntil(this.isDestroyed$),
                switchMap((gamePhase) => {
                    console.debug(`[BACKGROUND] New Game Phase:`, gamePhase);
                    return gamePhase === GamePhase.LegendSelection
                        ? this.legendSelectAssistWindow.open()
                        : this.legendSelectAssistWindow.close();
                })
            )
            .subscribe((result) => console.debug(`LegendSelectionWindow Result`, result));
    }

    /**
     * @summary On any first run of the app, restart the app to hopefully force the Overwolf Game Event Provider to re-recognize the app.
     * @see https://discuss.overwolf.com/t/apex-legends-events-completly-stop-if-overwolf-is-being-relaunched-while-game-is-already-open/495
     */
    private doRelaunch(): void {
        this.localStorage.set(LocalStorageKeys.OWExtNeedsRelaunch, "true");
        this.overwolfExtension.relaunchApp();
    }

    private needsRelaunch(): boolean {
        return !this.localStorage.get(LocalStorageKeys.OWExtNeedsRelaunch);
    }

    private clearRelaunch(): void {
        const hasRelaunched = !!this.localStorage.get(LocalStorageKeys.OWExtNeedsRelaunch);
        if (hasRelaunched) this.localStorage.clearItem(LocalStorageKeys.OWExtNeedsRelaunch);
    }
}

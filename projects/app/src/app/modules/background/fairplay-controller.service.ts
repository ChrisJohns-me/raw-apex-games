import { GameplayInputService } from "#app/modules/core/gameplay-input.service.js";
import { MatchService } from "#app/modules/core/match/match.service.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, filter, map, merge, Observable, of, switchMap, takeUntil } from "rxjs";
import { BaseService } from "../core/base-service.abstract";
import { MainPage } from "../main/pages/main-page";
import { MainDesktopWindowService } from "../main/windows/main-desktop-window.service";
import { MainInGameWindowService } from "../main/windows/main-ingame-window.service";

/**
 * Monitors the user and gameinput to determine if the user is playing fair.
 *
 * Fairplayin this context is defined as:
 * 1. Not using any cheats or hacks
 * 2. Not using any macros
 * 3. Not using any external tools
 * 4. Not using any hardware that gives an unfair advantage
 * 5. Not using any software that gives an unfair advantage
 * 6. Not using a controller
 */
@Injectable({
    providedIn: "root",
    deps: [GameplayInputService, MainDesktopWindowService, MainInGameWindowService, MatchService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("FairplayControllerService", FairplayControllerService, deps),
})
export class FairplayControllerService extends BaseService {
    /** Emits False on match start. Emits True when a non-mouse input has been detected */
    public readonly isNonMouseInputWarning$ = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly gameplayInput: GameplayInputService,
        private readonly mainDesktopWindow: MainDesktopWindowService,
        private readonly mainInGameWindow: MainInGameWindowService,
        private readonly match: MatchService
    ) {
        super();
        this.monitorGameplayInput();
    }

    private monitorGameplayInput(): void {
        const NON_MOUSE_EVENTS_WARNING = 5; // Damage burst events without mouse movement before warning
        const NON_MOUSE_EVENTS_REPORT = 10; // Damage burst events without mouse movement before reporting to server
        const dmgBurstConfig = { mouseMovementThresholdPx: 250, debounceTimeMs: 10000 };
        let nonMouseEvents = 0;

        const warnObs = (isMouseDetected: boolean): Observable<void> => {
            return of(isMouseDetected).pipe(
                filter((isMouseDetected) => {
                    if (!isMouseDetected) {
                        nonMouseEvents++;
                        console.info(`[Fairplay] Non-mouse damage burst detected; warn ${nonMouseEvents} of ${NON_MOUSE_EVENTS_WARNING}`);
                    }
                    return nonMouseEvents >= NON_MOUSE_EVENTS_WARNING;
                }),
                switchMap(() => {
                    this.isNonMouseInputWarning$.next(true);
                    return this.focusMainWindow();
                })
            );
        };

        const reportObs = (isMouseDetected: boolean): Observable<void> => {
            return of(isMouseDetected).pipe(
                map(() => {})
                // filter((isMouseDetected) => {
                //     if (!isMouseDetected) {
                //         nonMouseEvents++;
                //         console.info(`[Fairplay] Non-mouse damage burst detected; report ${nonMouseEvents} of ${NON_MOUSE_EVENTS_REPORT}`);
                //     }
                //     return nonMouseEvents >= NON_MOUSE_EVENTS_REPORT;
                // }),
                // switchMap(() => /** Report to server */)
            );
        };

        this.match.startedEvent$
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => {
                    nonMouseEvents = 0;
                    this.isNonMouseInputWarning$.next(false);
                    return this.gameplayInput.mouseMovementDetectedOnDamageBurst(dmgBurstConfig);
                }),
                switchMap((isMouseDetected) => merge(warnObs(isMouseDetected), reportObs(isMouseDetected)))
            )
            .pipe()
            .subscribe();
    }

    private focusMainWindow(): Observable<void> {
        return this.mainInGameWindow.focus(MainPage.RawApexGames).pipe(
            catchError(() => {
                console.warn("[Fairplay] Failed to focus main ingame window, attempting to focus main desktop window");
                return this.mainDesktopWindow.focus(MainPage.RawApexGames);
            })
        );
    }
}

import { Injectable, OnDestroy } from "@angular/core";
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { UIWindow } from "@shared-app/_refactor/ui-window";
import { from, Observable, of, Subject } from "rxjs";
import { catchError, concatAll, delay, map, mergeMap, switchMap, takeUntil, tap } from "rxjs/operators";
import { WindowName } from "../core/window-name";
import { SingletonServiceContainerService } from "./singleton-service-container.service";

const BACKGROUND_EXIT_DELAY = 1000;

@Injectable({
    providedIn: "root",
    deps: [SingletonServiceContainerService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("BackgroundService", BackgroundService, deps),
})
export class BackgroundService implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(public readonly singletonServiceContainer: SingletonServiceContainerService) {}

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public exitApp(): void {
        console.trace(`[BackgroundService] Exiting App`);
        const backgroundWindow = new UIWindow(WindowName.Background);
        const closeBackgroundWindow$ = of(undefined).pipe(
            tap(() => console.trace(`[BackgroundService] Exiting App - delaying closing BackgroundService`)),
            delay(BACKGROUND_EXIT_DELAY),
            tap(() => console.trace(`[BackgroundService] Exiting App - closing BackgroundService`)),
            switchMap(() => backgroundWindow.close()),
            tap(() => console.trace(`[BackgroundService] Exiting App - backgroundwindow should be closed`))
        );
        from([this.closeAllWindows$(), closeBackgroundWindow$]).pipe(takeUntil(this.destroy$), concatAll()).subscribe();
    }

    /** Closes all windows except Background */
    private closeAllWindows$(): Observable<void> {
        const allWindowNames = Object.values(WindowName).filter((name) => name !== WindowName.Background);
        const allWindows$ = from(allWindowNames);
        return allWindows$.pipe(
            tap(() => console.trace(`[BackgroundService] Closing all windows`)),
            takeUntil(this.destroy$),
            map((winName) => new UIWindow(winName)),
            mergeMap((uiWindow) => uiWindow.close()),
            catchError((err) => {
                console.error(`[BackgroundService] Closing All windows error:`, err);
                return of(undefined);
            })
        );
    }
}

import { Injectable, OnDestroy } from "@angular/core";
import { OverwolfWindow, OverwolfWindowName } from "@app/app/common/overwolf-window";
import { SingletonServiceProviderFactory } from "@app/app/singleton-service.provider.factory";
import { Observable, Subject, from, of } from "rxjs";
import { catchError, concatAll, delay, map, mergeMap, switchMap, takeUntil, tap } from "rxjs/operators";
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
        const backgroundWindow = new OverwolfWindow(OverwolfWindowName.Background);
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
        const allWindowNames = Object.values(OverwolfWindowName).filter((name) => name !== OverwolfWindowName.Background);
        const allWindows$ = from(allWindowNames);
        return allWindows$.pipe(
            tap(() => console.trace(`[BackgroundService] Closing all windows`)),
            takeUntil(this.destroy$),
            map((winName) => new OverwolfWindow(winName)),
            mergeMap((overwolfWindow) => overwolfWindow.close()),
            catchError((err) => {
                console.warn(`[BackgroundService] Closing All windows warning:`, err);
                return of(undefined);
            })
        );
    }
}

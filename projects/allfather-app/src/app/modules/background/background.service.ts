import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { BehaviorSubject, from, Observable, of } from "rxjs";
import { catchError, concatAll, delay, map, mergeMap, switchMap, takeUntil, tap } from "rxjs/operators";
import { AllfatherService } from "../core/allfather-service.abstract";
import { OverwolfExtensionsService } from "../core/overwolf/overwolf-extensions.service";
import { UIWindow, WindowName } from "../core/_refactor/ui-window";
import { MainWindowService } from "../main/windows/main-window.service";

const BACKGROUND_EXIT_DELAY = 1000;

@Injectable({
    providedIn: "root",
    deps: [MainWindowService, OverwolfExtensionsService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("BackgroundService", BackgroundService, deps),
})
export class BackgroundService extends AllfatherService {
    public isRequestingExit$ = new BehaviorSubject<boolean>(false);

    constructor(private readonly mainWindow: MainWindowService, private readonly overwolfExtensions: OverwolfExtensionsService) {
        super();
    }

    public requestExit(): void {
        const grabFocus$ = this.mainWindow.focus().pipe(tap(() => this.isRequestingExit$.next(true)));
        from([this.mainWindow.restore(), grabFocus$]).pipe(takeUntil(this.isDestroyed$), concatAll()).subscribe();
    }

    public cancelExit(): void {
        this.isRequestingExit$.next(false);
    }

    public relaunchApp(): void {
        this.overwolfExtensions.relaunchApp();
    }

    public exitApp(): void {
        const backgroundWindow = new UIWindow(WindowName.Background);
        const closeBackgroundWindow$ = of(undefined).pipe(
            delay(BACKGROUND_EXIT_DELAY),
            switchMap(() => backgroundWindow.close())
        );
        from([this.closeAllWindows$(), closeBackgroundWindow$]).pipe(takeUntil(this.isDestroyed$), concatAll()).subscribe();
    }

    /** Closes all windows except Background */
    private closeAllWindows$(): Observable<void> {
        const allWindowNames = Object.values(WindowName).filter((name) => name !== WindowName.Background);
        const allWindows$ = from(allWindowNames);
        return allWindows$.pipe(
            takeUntil(this.isDestroyed$),
            map((winName) => new UIWindow(winName)),
            mergeMap((uiWindow) => uiWindow.close()),
            catchError(() => of(undefined))
        );
    }
}

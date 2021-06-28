import { UIWindow, WindowName } from "@allfather-app/app/modules/core/_refactor/ui-window";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, from, Observable, Subject } from "rxjs";
import { concatAll, takeUntil, tap } from "rxjs/operators";
import { MainPage } from "../pages/main-page";

@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MainWindowService", MainWindowService, deps),
})
export class MainWindowService implements OnDestroy {
    public mainPage = new BehaviorSubject<MainPage>(MainPage.Dashboard);
    /** App is still initializing; ie. booting up the app */
    public isStarting$ = new BehaviorSubject<boolean>(false);
    public isRequestingExit$ = new BehaviorSubject<boolean>(false);
    public readonly uiWindow = new UIWindow(WindowName.Main);

    private destroy$ = new Subject<void>();

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public open(page?: MainPage): Observable<void> {
        if (page) this.goToPage(page);
        return this.uiWindow.restore();
    }

    public close(): Observable<void> {
        return this.uiWindow.close();
    }

    public restore(page?: MainPage): Observable<void> {
        if (page) this.goToPage(page);
        return this.uiWindow.restore();
    }

    public focus(page?: MainPage): Observable<void> {
        if (page) this.goToPage(page);
        return this.uiWindow.bringToFront(true);
    }

    public goToPage(page: MainPage): void {
        this.mainPage.next(page);
    }

    /** Set state of if app is still initializing; ie. booting up the app */
    public setIsStarting(value: boolean): void {
        this.isStarting$.next(value);
    }

    public requestExit(): void {
        console.trace(`[MainWindowService] Received request to Exit App; Relaying to Main Window`);
        const grabFocus$ = this.focus().pipe(tap(() => this.isRequestingExit$.next(true)));
        from([this.restore(), grabFocus$]).pipe(takeUntil(this.destroy$), concatAll()).subscribe();
    }

    public cancelExit(): void {
        this.isRequestingExit$.next(false);
    }
}

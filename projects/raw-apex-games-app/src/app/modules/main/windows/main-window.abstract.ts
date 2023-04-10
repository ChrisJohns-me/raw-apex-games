import { Injectable, OnDestroy } from "@angular/core";
import { OverwolfWindow } from "@raw-apex-games-app/app/common/overwolf-window";
import { BehaviorSubject, Observable, Subject, from } from "rxjs";
import { concatAll, map, takeUntil, tap } from "rxjs/operators";
import { MainPage } from "../pages/main-page";

@Injectable()
export abstract class MainWindowService implements OnDestroy {
    /** Needs to be defined by the inheriting class */
    protected overwolfWindow!: OverwolfWindow;

    public mainPage = new BehaviorSubject<MainPage>(MainPage.Dashboard);
    /** App is still initializing; ie. booting up the app */
    public isStarting$ = new BehaviorSubject<boolean>(false);
    public isRequestingExit$ = new BehaviorSubject<boolean>(false);

    private destroy$ = new Subject<void>();

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /** Opens window, then navigates to page */
    public open(page?: MainPage): Observable<void> {
        if (page) this.goToPage(page);
        return this.overwolfWindow.restore();
    }

    public close(): Observable<void> {
        return this.overwolfWindow.close();
    }

    /**
     * @param {boolean} close - If true, the app will close the window instead of minimizing.
     */
    public toggle(close: boolean): Observable<void> {
        return this.overwolfWindow.toggleMinimize(close).pipe(map(() => undefined));
    }

    public restore(page?: MainPage): Observable<void> {
        if (page) this.goToPage(page);
        return this.overwolfWindow.restore();
    }

    public focus(page?: MainPage): Observable<void> {
        if (page) this.goToPage(page);
        return this.overwolfWindow.bringToFront(true);
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

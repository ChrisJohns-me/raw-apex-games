import { UIWindow, WindowName } from "@allfather-app/app/modules/core/_refactor/ui-window";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { MainPage } from "../pages/main-page";

@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MainWindowService", MainWindowService, deps),
})
export class MainWindowService {
    public mainPage = new BehaviorSubject<MainPage>(MainPage.Dashboard);

    private readonly uiWindow = new UIWindow(WindowName.Main);

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
}

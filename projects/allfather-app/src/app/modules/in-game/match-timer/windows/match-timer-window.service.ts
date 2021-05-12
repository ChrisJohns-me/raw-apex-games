import { UIWindow, WindowName } from "@allfather-app/app/modules/core/_refactor/ui-window";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchTimerWindowService", MatchTimerWindowService, deps),
})
export class MatchTimerWindowService {
    private readonly uiWindow = new UIWindow(WindowName.InGameMatchTimer);

    public open(): Observable<void> {
        return this.uiWindow.restore();
    }

    public close(): Observable<void> {
        return this.uiWindow.close();
    }
}

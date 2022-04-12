import { UIWindow } from "@allfather-app/app/common/ui-window";
import { WindowName } from "@allfather-app/app/common/window-name";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("UltTimerWindowService", UltTimerWindowService, deps),
})
export class UltTimerWindowService {
    private readonly uiWindow = new UIWindow(WindowName.HUDUltTimer);

    public open(): Observable<void> {
        return this.uiWindow.restore();
    }

    public close(): Observable<void> {
        return this.uiWindow.close();
    }
}

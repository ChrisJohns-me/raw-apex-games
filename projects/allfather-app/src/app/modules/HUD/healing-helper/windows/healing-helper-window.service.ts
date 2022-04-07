import { WindowName } from "@allfather-app/app/modules/core/window-name";
import { UIWindow } from "@allfather-app/app/modules/core/_refactor/ui-window";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("HealingHelperWindowService", HealingHelperWindowService, deps),
})
export class HealingHelperWindowService {
    private readonly uiWindow = new UIWindow(WindowName.HUDHealingHelper);

    public open(): Observable<void> {
        return this.uiWindow.restore();
    }

    public close(): Observable<void> {
        return this.uiWindow.close();
    }
}

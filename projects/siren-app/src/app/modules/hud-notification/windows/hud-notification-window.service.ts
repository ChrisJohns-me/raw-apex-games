import { Injectable } from "@angular/core";
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { UIWindow } from "@shared-app/_refactor/ui-window";
import { Observable } from "rxjs";
import { WindowName } from "../../core/window-name";

@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("HUDNotificationWindowService", HUDNotificationWindowService, deps),
})
export class HUDNotificationWindowService {
    private readonly uiWindow = new UIWindow(WindowName.HUDNotification);

    public open(): Observable<void> {
        return this.uiWindow.restore();
    }

    public close(): Observable<void> {
        return this.uiWindow.close();
    }
}

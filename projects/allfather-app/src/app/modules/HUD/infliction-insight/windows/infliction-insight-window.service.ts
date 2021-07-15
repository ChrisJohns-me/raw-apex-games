import { WindowName } from "@allfather-app/app/modules/core/window-name";
import { Injectable } from "@angular/core";
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { UIWindow } from "@shared-app/_refactor/ui-window";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("InflictionInsightWindowService", InflictionInsightWindowService, deps),
})
export class InflictionInsightWindowService {
    private readonly uiWindow = new UIWindow(WindowName.HUDInflictionInsight);

    public open(): Observable<void> {
        return this.uiWindow.restore();
    }

    public close(): Observable<void> {
        return this.uiWindow.close();
    }
}

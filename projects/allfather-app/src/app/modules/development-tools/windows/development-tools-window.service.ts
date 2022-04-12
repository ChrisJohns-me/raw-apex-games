import { UIWindow } from "@allfather-app/app/common/ui-window";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { WindowName } from "../../../common/window-name";

@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("DevelopmentToolsWindowService", DevelopmentToolsWindowService, deps),
})
export class DevelopmentToolsWindowService {
    private readonly uiWindow = new UIWindow(WindowName.DevelopmentTools);

    public open(): Observable<void> {
        return this.uiWindow.restore();
    }

    public close(): Observable<void> {
        return this.uiWindow.close();
    }
}

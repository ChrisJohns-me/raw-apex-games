import { Injectable } from "@angular/core";
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { UIWindow, WindowState } from "@shared-app/_refactor/ui-window";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { WindowName } from "../../core/window-name";

@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("LegendSelectAssistWindowService", LegendSelectAssistWindowService, deps),
})
export class LegendSelectAssistWindowService {
    private readonly uiWindow = new UIWindow(WindowName.LegendSelectAssist);

    public isOpen(): Observable<boolean> {
        return this.uiWindow.getState().pipe(map((state) => state !== WindowState.Closed && state !== WindowState.Hidden));
    }

    public open(): Observable<void> {
        return this.uiWindow.restore();
    }

    public close(): Observable<void> {
        return this.uiWindow.close();
    }
}

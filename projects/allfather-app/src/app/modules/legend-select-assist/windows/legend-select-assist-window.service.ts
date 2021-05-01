import { UIWindow, WindowName } from "@allfather-app/app/modules/core/_refactor/ui-window";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class LegendSelectAssistWindowService {
    private readonly uiWindow = new UIWindow(WindowName.LegendSelectAssist);

    public open(): Observable<void> {
        return this.uiWindow.restore();
    }

    public close(): Observable<void> {
        return this.uiWindow.close();
    }
}

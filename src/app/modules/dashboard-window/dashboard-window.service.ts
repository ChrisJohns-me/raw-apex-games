import { Injectable } from "@angular/core";
import { UIWindow, WindowName } from "@core/_refactor/ui-window";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class DashboardWindowService {
    private readonly uiWindow = new UIWindow(WindowName.Dashboard);

    public open(): Observable<void> {
        return this.uiWindow.restore();
    }

    public close(): Observable<void> {
        return this.uiWindow.close();
    }
}

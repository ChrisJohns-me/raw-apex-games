import { Injectable } from "@angular/core";
import { UIWindow, WindowName } from "@core/ui-window";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class InGameTestWindowService {
    private readonly uiWindow = new UIWindow(WindowName.InGameTest);

    public open(): Observable<void> {
        return this.uiWindow.restore();
    }

    public close(): Observable<void> {
        return this.uiWindow.close();
    }
}

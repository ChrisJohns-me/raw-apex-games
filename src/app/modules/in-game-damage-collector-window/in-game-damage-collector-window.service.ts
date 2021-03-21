import { Injectable } from "@angular/core";
import { UIWindow, WindowName } from "@core/_refactor/ui-window";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class InGameDamageCollectorWindowService {
    private readonly uiWindow = new UIWindow(WindowName.InGameDamageCollector);

    public open(): Observable<void> {
        // WIP
        return of();
        // return this.uiWindow.restore();
    }

    public close(): Observable<void> {
        return this.uiWindow.close();
    }
}

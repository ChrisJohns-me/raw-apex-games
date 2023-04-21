import { OverwolfWindow, OverwolfWindowName, OverwolfWindowState } from "#app/models/overwolf-window.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("InGameWindowService", InGameWindowService, deps),
})
export class InGameWindowService {
    private readonly overwolfWindow = new OverwolfWindow(OverwolfWindowName.InGame);

    public isOpen(): Observable<boolean> {
        return this.overwolfWindow
            .getState()
            .pipe(map((state) => state !== OverwolfWindowState.Closed && state !== OverwolfWindowState.Hidden));
    }

    public open(): Observable<void> {
        return this.overwolfWindow.restore();
    }

    public close(): Observable<void> {
        return this.overwolfWindow.close();
    }
}

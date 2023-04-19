import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { OverwolfWindow, OverwolfWindowName, OverwolfWindowState } from "../../../common/overwolf-window";
import { SingletonServiceProviderFactory } from "../../../singleton-service.provider.factory";

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

import { OverwolfWindow, OverwolfWindowName } from "#app/models/overwolf-window.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("DevelopmentToolsWindowService", DevelopmentToolsWindowService, deps),
})
export class DevelopmentToolsWindowService {
    private readonly overwolfWindow = new OverwolfWindow(OverwolfWindowName.DevelopmentTools);

    public open(): Observable<void> {
        return this.overwolfWindow.restore();
    }

    public close(): Observable<void> {
        return this.overwolfWindow.close();
    }
}

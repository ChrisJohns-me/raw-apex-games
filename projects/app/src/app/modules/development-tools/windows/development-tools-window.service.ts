import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { OverwolfWindow, OverwolfWindowName } from "../../../common/overwolf-window";
import { SingletonServiceProviderFactory } from "../../../singleton-service.provider.factory";

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

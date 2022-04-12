import { OverwolfWindow, OverwolfWindowName } from "@allfather-app/app/common/overwolf-window";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("ReticleHelperWindowService", ReticleHelperWindowService, deps),
})
export class ReticleHelperWindowService {
    private readonly overwolfWindow = new OverwolfWindow(OverwolfWindowName.HUDReticleHelper);

    public open(): Observable<void> {
        return this.overwolfWindow.restore();
    }

    public close(): Observable<void> {
        return this.overwolfWindow.close();
    }
}

import { Injectable } from "@angular/core";
import { OverwolfWindow, OverwolfWindowName } from "@raw-apex-games-app/app/common/overwolf-window";
import { SingletonServiceProviderFactory } from "@raw-apex-games-app/app/singleton-service.provider.factory";
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

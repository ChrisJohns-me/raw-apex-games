import { OverwolfWindow, OverwolfWindowName } from "#app/models/overwolf-window.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MiniInventoryWindowService", MiniInventoryWindowService, deps),
})
export class MiniInventoryWindowService {
    private readonly overwolfWindow = new OverwolfWindow(OverwolfWindowName.HUDMiniInventory);

    public open(): Observable<void> {
        return this.overwolfWindow.restore();
    }

    public close(): Observable<void> {
        return this.overwolfWindow.close();
    }
}

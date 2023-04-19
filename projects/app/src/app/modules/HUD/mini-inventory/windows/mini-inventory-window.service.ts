import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { OverwolfWindow, OverwolfWindowName } from "../../../../common/overwolf-window";
import { SingletonServiceProviderFactory } from "../../../../singleton-service.provider.factory";

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

import { Injectable } from "@angular/core";
import { OverwolfWindow, OverwolfWindowName, OverwolfWindowState } from "@raw-apex-games-app/app/common/overwolf-window";
import { SingletonServiceProviderFactory } from "@raw-apex-games-app/app/singleton-service.provider.factory";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("LobbyStatusWindowService", LobbyStatusWindowService, deps),
})
export class LobbyStatusWindowService {
    private readonly overwolfWindow = new OverwolfWindow(OverwolfWindowName.LobbyStatus);

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

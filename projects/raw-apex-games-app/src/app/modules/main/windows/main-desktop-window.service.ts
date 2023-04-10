import { Injectable } from "@angular/core";
import { OverwolfWindow, OverwolfWindowName } from "@raw-apex-games-app/app/common/overwolf-window";
import { SingletonServiceProviderFactory } from "@raw-apex-games-app/app/singleton-service.provider.factory";
import { MainWindowService } from "./main-window.abstract";

@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MainDesktopWindowService", MainDesktopWindowService, deps),
})
export class MainDesktopWindowService extends MainWindowService {
    public readonly overwolfWindow = new OverwolfWindow(OverwolfWindowName.MainDesktop);
}

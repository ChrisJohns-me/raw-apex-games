import { OverwolfWindow, OverwolfWindowName } from "@allfather-app/app/common/overwolf-window";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { MainWindowService } from "./main-window.abstract";

@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MainDesktopWindowService", MainDesktopWindowService, deps),
})
export class MainDesktopWindowService extends MainWindowService {
    public readonly overwolfWindow = new OverwolfWindow(OverwolfWindowName.MainDesktop);
}

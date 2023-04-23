import { OverwolfWindow, OverwolfWindowName } from "#app/models/overwolf-window.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { Injectable } from "@angular/core";
import { MainWindowService } from "./main-window.abstract.js";

@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MainDesktopWindowService", MainDesktopWindowService, deps),
})
export class MainDesktopWindowService extends MainWindowService {
    public readonly overwolfWindow = new OverwolfWindow(OverwolfWindowName.MainDesktop);
}

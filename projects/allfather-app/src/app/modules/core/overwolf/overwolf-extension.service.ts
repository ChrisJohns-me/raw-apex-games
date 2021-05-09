import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { AllfatherService } from "../allfather-service.abstract";
import { ExtensionsDelegate } from "./api/extensions-delegate";

/**
 * @class OverwolfExtensionService
 * @classdesc Wrapper for Overwolf's "overwolf.extensions." API namespace.
 */
@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("OverwolfExtensionService", OverwolfExtensionService, deps),
})
export class OverwolfExtensionService extends AllfatherService {
    private extensionsDelegate = new ExtensionsDelegate();

    public relaunchApp(): void {
        this.extensionsDelegate.relaunchApp();
    }
}

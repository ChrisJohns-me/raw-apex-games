import { Injectable } from "@angular/core";
import { SingletonServiceProviderFactory } from "@app/app/singleton-service.provider.factory";
import { Observable, Subject } from "rxjs";
import { BaseService } from "../base-service.abstract";
import { ExtensionsDelegate } from "./api/extensions-delegate";
import { CurrentDelegate } from "./api/extensions/current-delegate";
import { IODelegate } from "./api/extensions/io-delegate";
import { OWAppLaunchTriggeredEvent, OWGetManifestResult } from "./types/overwolf-types";

/**
 * @class OverwolfExtensionsService
 * @classdesc Wrapper for Overwolf's "overwolf.extensions." API namespace.
 */
@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("OverwolfExtensionsService", OverwolfExtensionsService, deps),
})
export class OverwolfExtensionsService extends BaseService {
    //#region Delegate Outputs
    public get appLaunchTriggeredEvent$(): Subject<OWAppLaunchTriggeredEvent> {
        return this.extensionsDelegate.appLaunchTriggeredEvent$;
    }

    private readonly currentDelegate = new CurrentDelegate();
    private readonly extensionsDelegate = new ExtensionsDelegate();
    private readonly ioDelegate = new IODelegate();
    //#endregion

    constructor() {
        super();
        this.startDelegateEventListeners();
    }

    public ngOnDestroy(): void {
        this.stopDelegateEventListeners();
        super.ngOnDestroy();
    }

    public relaunchApp(): void {
        this.extensionsDelegate.relaunchApp();
    }

    public getManifest(): Observable<OWGetManifestResult> {
        return this.currentDelegate.getManifest();
    }

    public writeTextFile(storageSpace: overwolf.extensions.io.enums.StorageSpace, filePath: string, content: string): Observable<true> {
        return this.ioDelegate.writeTextFile(storageSpace, filePath, content);
    }

    public getStoragePath(storageSpace: overwolf.extensions.io.enums.StorageSpace): Observable<string> {
        return this.ioDelegate.getStoragePath(storageSpace);
    }

    public exist(storageSpace: overwolf.extensions.io.enums.StorageSpace, folderPath: string): Observable<boolean> {
        return this.ioDelegate.exist(storageSpace, folderPath);
    }

    public createDirectory(storageSpace: overwolf.extensions.io.enums.StorageSpace, path: string): Observable<true> {
        return this.ioDelegate.createDirectory(storageSpace, path);
    }

    //#region Delegate event listeners
    private startDelegateEventListeners(): void {
        this.extensionsDelegate.startEventListeners();
        console.debug(`[${this.constructor.name}] Extensions Delegate Event Listeners Started`);
    }

    private stopDelegateEventListeners(): void {
        this.extensionsDelegate.stopEventListeners();
        console.debug(`[${this.constructor.name}] Extensions Delegate Event Listeners Stopped`);
    }
    //#endregion
}

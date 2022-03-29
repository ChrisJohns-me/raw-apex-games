import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseService } from "../base-service.abstract";
import { ExtensionsDelegate } from "./api/extensions-delegate";
import { IODelegate } from "./api/extensions/io-delegate";

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
    private extensionsDelegate = new ExtensionsDelegate();
    private ioDelegate = new IODelegate();

    public relaunchApp(): void {
        this.extensionsDelegate.relaunchApp();
    }

    public writeTextFile(storageSpace: overwolf.extensions.io.enums.StorageSpace, filePath: string, content: string): Observable<true> {
        return this.ioDelegate.writeTextFile(storageSpace, filePath, content);
    }

    public exist(storageSpace: overwolf.extensions.io.enums.StorageSpace, folderPath: string): Observable<boolean> {
        return this.ioDelegate.exist(storageSpace, folderPath);
    }

    public createDirectory(storageSpace: overwolf.extensions.io.enums.StorageSpace, path: string): Observable<true> {
        return this.ioDelegate.createDirectory(storageSpace, path);
    }
}

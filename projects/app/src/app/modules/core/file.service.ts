import { Injectable } from "@angular/core";
import { SingletonServiceProviderFactory } from "@app/app/singleton-service.provider.factory";
import { iif, Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { OverwolfExtensionsService } from "./overwolf/overwolf-extensions.service";

const appDataStorageSpace = overwolf.extensions.io.enums.StorageSpace.appData;

@Injectable({
    providedIn: "root",
    deps: [OverwolfExtensionsService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("FileService", FileService, deps),
})
export class FileService {
    constructor(private readonly overwolfExtensions: OverwolfExtensionsService) {}

    /**
     * Writes to a file in the appData directory.
     * @returns {string} full path to file, if successful
     * @throws {error} if unsuccessful
     */
    public saveFile$(filePath: string, content: string): Observable<string> {
        return this.overwolfExtensions.writeTextFile(appDataStorageSpace, filePath, content).pipe(
            switchMap(() => this.getStoragePath$(appDataStorageSpace)),
            map((directoryPath) => `${directoryPath}/${filePath}`)
        );
    }

    /**
     * Returns the full path of given extension storage space.
     * @param storageSpace The selected Overwolf storage space.
     * @returns {string} Full path of the requested extension storage space
     */
    public getStoragePath$(storageSpace: overwolf.extensions.io.enums.StorageSpace): Observable<string> {
        return this.overwolfExtensions.getStoragePath(storageSpace);
    }

    /** Make sure directory exists */
    public ensureDirectory$(directory: string): Observable<true> {
        const ensureExists$ = (exists: boolean) =>
            iif(() => !exists, this.overwolfExtensions.createDirectory(appDataStorageSpace, directory), of(true)) as Observable<true>;

        return this.overwolfExtensions.exist(appDataStorageSpace, directory).pipe(switchMap((exists) => ensureExists$(exists)));
    }
}

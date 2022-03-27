import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { iif, Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { OverwolfExtensionsService } from "./overwolf/overwolf-extensions.service";

@Injectable({
    providedIn: "root",
    deps: [OverwolfExtensionsService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("FileService", FileService, deps),
})
export class FileService {
    constructor(private readonly overwolfExtensions: OverwolfExtensionsService) {}

    /**
     * Writes to a file in the appData directory.
     * @returns {true} if successful
     * @throws {error} if unsuccessful
     */
    public saveFile$(filePath: string, content: string): Observable<true> {
        return this.overwolfExtensions.writeTextFile("appData" as any, filePath, content);
    }

    /** Make sure directory exists */
    public ensureDirectory$(directory: string): Observable<true> {
        const ensureExists$ = (exists: boolean) =>
            iif(() => !exists, this.overwolfExtensions.createDirectory("appData" as any, directory), of(true)) as Observable<true>;

        return this.overwolfExtensions.exist("appData" as any, directory).pipe(switchMap((exists) => ensureExists$(exists)));
    }
}

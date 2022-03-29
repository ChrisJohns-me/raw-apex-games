import { bindCallback, Observable } from "rxjs";
import { map } from "rxjs/operators";

export class IODelegate {
    /**
     * Writes the provided text content to the provided file within the App's designated Overwolf folder.
     * Make sure all nested folders exist before calling.
     * @param storageSpace Which directory to write to.
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public writeTextFile(storageSpace: overwolf.extensions.io.enums.StorageSpace, filePath: string, content: string): Observable<true> {
        const writeTextFileObs = bindCallback(overwolf.extensions.io.writeTextFile);

        return writeTextFileObs(storageSpace, filePath, content).pipe(
            map((result) => {
                if (result?.success) return true;
                else throw new Error(result?.error || (result as any)?.reason);
            })
        );
    }

    /**
     * Checks for the existance of a folder.
     * @param storageSpace Which directory to check for.
     * @returns {true} if exists
     * @returns {false} false if not exist
     */
    public exist(storageSpace: overwolf.extensions.io.enums.StorageSpace, folderPath: string): Observable<boolean> {
        // TODO: Check to see if they've added this namespace to the types
        type OWIOExistFn = (
            space: overwolf.extensions.io.enums.StorageSpace,
            path: string,
            callback: overwolf.CallbackFunction<overwolf.Result>
        ) => void;
        const existObs = bindCallback((overwolf.extensions.io as any).exist as OWIOExistFn);

        return existObs(storageSpace, folderPath).pipe(map((result) => result?.success ?? false));
    }

    /**
     * @param storageSpace Which directory to write to.
     * @returns {true} if successful
     * @returns {error} if failed
     */
    public createDirectory(storageSpace: overwolf.extensions.io.enums.StorageSpace, path: string): Observable<true> {
        // TODO: Check to see if they've added this namespace to the types
        type OWIOCreateDirectoryFn = (
            space: overwolf.extensions.io.enums.StorageSpace,
            path: string,
            callback: overwolf.CallbackFunction<overwolf.Result>
        ) => void;
        const createDirectoryObs = bindCallback((overwolf.extensions.io as any).createDirectory as OWIOCreateDirectoryFn);

        return createDirectoryObs(storageSpace, path).pipe(
            map((result) => {
                if (result?.success) return true;
                else throw new Error(result?.error || (result as any)?.reason);
            })
        );
    }
}

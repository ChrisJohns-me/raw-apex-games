import { bindCallback, map, Observable } from "rxjs";
import { OWGetManifestResult } from "../../types/overwolf-types.js";

export class CurrentDelegate {
    /**
     * Returns the current extension’s manifest object.
     * @returns {Observable<overwolf.extensions.GetManifestResult>}
     * @returns {error} if failed
     */
    public getManifest(): Observable<OWGetManifestResult> {
        const getManifestObs = bindCallback(overwolf.extensions.current.getManifest);

        return getManifestObs().pipe(
            map((result) => {
                if (result?.success) return result;
                else throw new Error(result?.error || (result as any)?.reason);
            })
        );
    }
}

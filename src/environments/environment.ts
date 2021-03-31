/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import "zone.js/dist/zone-error";
/** Live-reload client script for development */
import "../tooling/livereload-ow";
import { environment as ProdEnvironment } from "./environment.prod";

export const environment: typeof ProdEnvironment = {
    production: false,
};

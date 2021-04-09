import "zone.js/dist/zone-error";
import "../tooling/livereload-ow";
import { environment as ProdEnvironment } from "./environment.prod";

export const environment: typeof ProdEnvironment = {
    production: false,
    allowDevTools: true,
};

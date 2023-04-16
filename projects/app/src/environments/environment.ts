import "zone.js/dist/zone-error";
import { environment as ProdEnvironment } from "./environment.prod";

export const environment: typeof ProdEnvironment = {
    PROD: false,
    DEV: true,
    testAds: true,
    allowDevTools: true,
    forceLocalConfig: true,
    gaID: "UA-196720756-2",
};

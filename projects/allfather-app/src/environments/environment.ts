import "zone.js/dist/zone-error";
import { environment as ProdEnvironment } from "./environment.prod";

const localDatabase = {
    name: "AllfatherApp_DEV",
};

export const environment: typeof ProdEnvironment = {
    PROD: false,
    DEV: true,
    allowDevTools: true,
    localDatabase,
};

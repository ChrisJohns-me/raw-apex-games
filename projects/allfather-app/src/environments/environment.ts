import "zone.js/dist/zone-error";
import { environment as ProdEnvironment } from "./environment.prod";

const localDatabase = {
    name: "AllfatherApp_DEV",
};

export const environment: typeof ProdEnvironment = {
    production: false,
    allowDevTools: true,
    localDatabase,
};

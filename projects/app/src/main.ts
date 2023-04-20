import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { environment } from "@app/../environments/environment.js";
import "@shared/utilities/index.js";
import { AppModule } from "./app/app.module.js";

if (environment.PROD) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));

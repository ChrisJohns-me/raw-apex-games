import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module.js";
import { environment } from "./environments/environment.js";

// Import utilities to ensure they are hoisted
import "#shared/utilities/color.js";
import "#shared/utilities/primitives/array.js";
import "#shared/utilities/primitives/boolean.js";
import "#shared/utilities/primitives/json.js";
import "#shared/utilities/primitives/math.js";
import "#shared/utilities/primitives/number.js";
import "#shared/utilities/primitives/object.js";
import "#shared/utilities/primitives/string.js";
import "#shared/utilities/stopwatch.js";
import "#shared/utilities/switch.js";

if (environment.PROD) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));

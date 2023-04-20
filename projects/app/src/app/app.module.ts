import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { environment } from "@app/../environments/environment.js";
import { AppComponent } from "./app.component.js";
import { BackgroundModule } from "./modules/background/background.module.js";
import { WINDOW_PROVIDERS } from "./modules/core/global-window.provider.js";
import { OverwolfModule } from "./modules/core/overwolf/overwolf.module.js";
import { DesktopModule } from "./modules/desktop/desktop.module.js";
import { DevelopmentToolsModule } from "./modules/development-tools/development-tools.module.js";
import { NoopDevelopmentToolsModule } from "./modules/development-tools/noop-development-tools.module.js";
import { MiniInventoryWindowModule } from "./modules/HUD/mini-inventory/mini-inventory.module.js";
import { InGameWindowModule } from "./modules/in-game/in-game.module.js";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BackgroundModule,
        BrowserModule,
        DesktopModule,
        environment.allowDevTools ? DevelopmentToolsModule : NoopDevelopmentToolsModule,
        HttpClientModule,
        InGameWindowModule,
        MiniInventoryWindowModule,
        OverwolfModule,
    ],
    providers: [WINDOW_PROVIDERS],
    bootstrap: [AppComponent],
})
export class AppModule {}

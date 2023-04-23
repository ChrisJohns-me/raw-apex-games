import { environment } from "#app/../environments/environment.js";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component.js";
import { BackgroundModule } from "./modules/background/background.module.js";
import { WINDOW_PROVIDERS } from "./modules/core/global-window.provider.js";
import { httpInterceptorProviders } from "./modules/core/http-interceptors/index.js";
import { OverwolfModule } from "./modules/core/overwolf/overwolf.module.js";
import { DevelopmentToolsModule } from "./modules/development-tools/development-tools.module.js";
import { NoopDevelopmentToolsModule } from "./modules/development-tools/noop-development-tools.module.js";
import { MiniInventoryWindowModule } from "./modules/HUD/mini-inventory/mini-inventory.module.js";
import { LobbyStatusWindowModule } from "./modules/lobby-status/lobby-status.module";
import { MainModule } from "./modules/main/main.module.js";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BackgroundModule,
        BrowserModule,
        environment.allowDevTools ? DevelopmentToolsModule : NoopDevelopmentToolsModule,
        HttpClientModule,
        LobbyStatusWindowModule,
        MainModule,
        MiniInventoryWindowModule,
        OverwolfModule,
    ],
    providers: [...httpInterceptorProviders, WINDOW_PROVIDERS],
    bootstrap: [AppComponent],
})
export class AppModule {}

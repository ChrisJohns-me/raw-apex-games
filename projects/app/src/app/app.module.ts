import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { environment } from "@app/environments/environment";
import { AppComponent } from "./app.component";
import { MiniInventoryWindowModule } from "./modules/HUD/mini-inventory/mini-inventory.module";
import { BackgroundModule } from "./modules/background/background.module";
import { WINDOW_PROVIDERS } from "./modules/core/global-window.provider";
import { OverwolfModule } from "./modules/core/overwolf";
import { DesktopModule } from "./modules/desktop/desktop.module";
import { DevelopmentToolsModule } from "./modules/development-tools/development-tools.module";
import { NoopDevelopmentToolsModule } from "./modules/development-tools/noop-development-tools.module";
import { InGameWindowModule } from "./modules/in-game/in-game.module";

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

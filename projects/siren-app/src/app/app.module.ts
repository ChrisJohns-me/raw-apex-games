import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { OverwolfModule } from "@shared-app/services/overwolf";
import { WINDOW_PROVIDERS } from "@shared-app/services/window.service";
import { environment } from "@siren-app/environments/environment";
import { AppComponent } from "./app.component";
import { BackgroundModule } from "./modules/background/background.module";
import { DevelopmentToolsModule } from "./modules/development-tools/development-tools.module";
import { NoopDevelopmentToolsModule } from "./modules/development-tools/noop-development-tools.module";
import { HUDDeathWindowModule } from "./modules/hud-death/hud-death.module";
import { HUDNotificationWindowModule } from "./modules/hud-notification/hud-notification.module";
import { MainModule } from "./modules/main/main.module";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BackgroundModule,
        BrowserModule,
        MainModule,
        environment.allowDevTools ? DevelopmentToolsModule : NoopDevelopmentToolsModule,
        HttpClientModule,
        HUDDeathWindowModule,
        HUDNotificationWindowModule,
        OverwolfModule,
    ],
    providers: [WINDOW_PROVIDERS],
    bootstrap: [AppComponent],
})
export class AppModule {}

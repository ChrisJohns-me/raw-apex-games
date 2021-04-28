import { environment } from "@allfather-app/environments/environment";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { BackgroundModule } from "./modules/background/background.module";
import { ConfigurationModule } from "./modules/core/configuration/configuration.module";
import { OverwolfModule } from "./modules/core/overwolf/overwolf.module";
import { WINDOW_PROVIDERS } from "./modules/core/window.service";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { DevelopmentToolsModule } from "./modules/development-tools/development-tools.module";
import { NoopDevelopmentToolsModule } from "./modules/development-tools/noop-development-tools.module";
import { InflictionInsightWindowModule } from "./modules/in-game/infliction-insight/infliction-insight.module";
import { MatchTimerWindowModule } from "./modules/in-game/match-timer/match-timer.module";
import { UltTimerWindowModule } from "./modules/in-game/ult-timer/ult-timer.module";
import { PreferencesModule } from "./modules/preferences/preferences.module";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BackgroundModule,
        BrowserModule,
        ConfigurationModule,
        DashboardModule,
        environment.allowDevTools ? DevelopmentToolsModule : NoopDevelopmentToolsModule,
        HttpClientModule,
        InflictionInsightWindowModule,
        MatchTimerWindowModule,
        OverwolfModule,
        PreferencesModule,
        UltTimerWindowModule,
    ],
    providers: [WINDOW_PROVIDERS],
    bootstrap: [AppComponent],
})
export class AppModule {}

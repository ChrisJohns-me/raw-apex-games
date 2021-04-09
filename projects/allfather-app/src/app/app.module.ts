import { environment } from "@allfather-app/environments/environment";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { BackgroundModule } from "./modules/background/background.module";
import { ConfigurationModule } from "./modules/core/configuration/configuration.module";
import { OverwolfModule } from "./modules/core/overwolf-data-provider/overwolf.module";
import { DevelopmentToolsModule } from "./modules/development-tools/development-tools.module";
import { NoopDevelopmentToolsModule } from "./modules/development-tools/noop-development-tools.module";
import { InflictionInsightWindowModule } from "./modules/in-game/infliction-insight/infliction-insight.module";
import { MatchTimerWindowModule } from "./modules/in-game/match-timer/match-timer.module";
import { UltTimerWindowModule } from "./modules/in-game/ult-timer/ult-timer.module";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BackgroundModule,
        BrowserModule,
        ConfigurationModule,
        environment.allowDevTools ? DevelopmentToolsModule : NoopDevelopmentToolsModule,
        HttpClientModule,
        InflictionInsightWindowModule,
        MatchTimerWindowModule,
        OverwolfModule,
        UltTimerWindowModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
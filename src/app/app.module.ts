import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ConfigurationModule } from "@core/configuration/configuration.module";
import { OverwolfModule } from "@core/overwolf-data-provider/overwolf.module";
import { environment } from "src/environments/environment";
import { AppComponent } from "./app.component";
import { BackgroundModule } from "./modules/background/background.module";
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

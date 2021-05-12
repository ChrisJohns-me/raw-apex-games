import { environment } from "@allfather-app/environments/environment";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { BackgroundModule } from "./modules/background/background.module";
import { OverwolfModule } from "./modules/core/overwolf/overwolf.module";
import { WINDOW_PROVIDERS } from "./modules/core/window.service";
import { DevelopmentToolsModule } from "./modules/development-tools/development-tools.module";
import { NoopDevelopmentToolsModule } from "./modules/development-tools/noop-development-tools.module";
import { InflictionInsightWindowModule } from "./modules/in-game/infliction-insight/infliction-insight.module";
import { MatchTimerWindowModule } from "./modules/in-game/match-timer/match-timer.module";
import { UltTimerWindowModule } from "./modules/in-game/ult-timer/ult-timer.module";
import { LegendSelectAssistWindowModule } from "./modules/legend-select-assist/legend-select-assist.module";
import { MainModule } from "./modules/main/main.module";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BackgroundModule,
        BrowserModule,
        MainModule,
        environment.allowDevTools ? DevelopmentToolsModule : NoopDevelopmentToolsModule,
        HttpClientModule,
        InflictionInsightWindowModule,
        LegendSelectAssistWindowModule,
        MatchTimerWindowModule,
        OverwolfModule,
        UltTimerWindowModule,
    ],
    providers: [WINDOW_PROVIDERS],
    bootstrap: [AppComponent],
})
export class AppModule {}

import { environment } from "@allfather-app/environments/environment";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { BackgroundModule } from "./modules/background/background.module";
import { WINDOW_PROVIDERS } from "./modules/core/global-window.provider";
import { OverwolfModule } from "./modules/core/overwolf";
import { DevelopmentToolsModule } from "./modules/development-tools/development-tools.module";
import { NoopDevelopmentToolsModule } from "./modules/development-tools/noop-development-tools.module";
import { HealingHelperWindowModule } from "./modules/HUD/healing-helper/healing-helper.module";
import { InflictionInsightWindowModule } from "./modules/HUD/infliction-insight/infliction-insight.module";
import { MatchTimerWindowModule } from "./modules/HUD/match-timer/match-timer.module";
import { MiniInventoryWindowModule } from "./modules/HUD/mini-inventory/mini-inventory.module";
import { ReticleHelperWindowModule } from "./modules/HUD/reticle-helper/reticle-helper.module";
import { UltTimerWindowModule } from "./modules/HUD/ult-timer/ult-timer.module";
import { LegendSelectAssistWindowModule } from "./modules/legend-select-assist/legend-select-assist.module";
import { MainModule } from "./modules/main/main.module";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BackgroundModule,
        BrowserModule,
        MainModule,
        environment.allowDevTools ? DevelopmentToolsModule : NoopDevelopmentToolsModule,
        HealingHelperWindowModule,
        HttpClientModule,
        InflictionInsightWindowModule,
        LegendSelectAssistWindowModule,
        MatchTimerWindowModule,
        MiniInventoryWindowModule,
        OverwolfModule,
        ReticleHelperWindowModule,
        UltTimerWindowModule,
    ],
    providers: [WINDOW_PROVIDERS],
    bootstrap: [AppComponent],
})
export class AppModule {}

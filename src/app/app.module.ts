import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { environment } from "src/environments/environment";
import { AppComponent } from "./app.component";
import { BackgroundModule } from "./modules/background/background.module";
import { CoreModule } from "./modules/core/core.module";
import { DevelopmentToolsModule } from "./modules/development-tools/development-tools.module";
import { NoopDevelopmentToolsModule } from "./modules/development-tools/noop-development-tools.module";
import { DamageCollectorWindowModule } from "./modules/in-game/damage-collector/damage-collector.module";
import { MatchTimerWindowModule } from "./modules/in-game/match-timer/match-timer.module";
import { UltTimerWindowModule } from "./modules/in-game/ult-timer/ult-timer.module";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BackgroundModule,
        BrowserModule,
        CoreModule,
        environment.allowDevTools ? DevelopmentToolsModule : NoopDevelopmentToolsModule,
        HttpClientModule,
        DamageCollectorWindowModule,
        MatchTimerWindowModule,
        UltTimerWindowModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}

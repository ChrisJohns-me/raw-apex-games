import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { environment } from "src/environments/environment";
import { AppComponent } from "./app.component";
import { BackgroundModule } from "./modules/background/background.module";
import { CoreModule } from "./modules/core/core.module";
import { DevelopmentToolsModule } from "./modules/development-tools/development-tools.module";
import { NoopDevelopmentToolsModule } from "./modules/development-tools/noop-development-tools.module";
import { InGameDamageCollectorWindowModule } from "./modules/in-game-damage-collector-window/in-game-damage-collector-window.module";
import { InGameMatchTimerWindowModule } from "./modules/in-game-match-timer-window/in-game-match-timer-window.module";
import { InGameUltTimerWindowModule } from "./modules/in-game-ult-timer-window/in-game-ult-timer-window.module";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BackgroundModule,
        BrowserModule,
        CoreModule,
        environment.allowDevTools ? DevelopmentToolsModule : NoopDevelopmentToolsModule,
        HttpClientModule,
        InGameDamageCollectorWindowModule,
        InGameMatchTimerWindowModule,
        InGameUltTimerWindowModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}

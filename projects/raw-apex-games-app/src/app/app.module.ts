import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { environment } from "@raw-apex-games-app/environments/environment";
import { AppComponent } from "./app.component";
import { MatchTimerWindowModule } from "./modules/HUD/match-timer/match-timer.module";
import { MiniInventoryWindowModule } from "./modules/HUD/mini-inventory/mini-inventory.module";
import { BackgroundModule } from "./modules/background/background.module";
import { WINDOW_PROVIDERS } from "./modules/core/global-window.provider";
import { OverwolfModule } from "./modules/core/overwolf";
import { DevelopmentToolsModule } from "./modules/development-tools/development-tools.module";
import { NoopDevelopmentToolsModule } from "./modules/development-tools/noop-development-tools.module";
import { LobbyStatusWindowModule } from "./modules/lobby-status/lobby-status.module";
import { MainModule } from "./modules/main/main.module";
import { MatchSummaryWindowModule } from "./modules/match-summary/match-summary.module";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BackgroundModule,
        BrowserModule,
        MainModule,
        environment.allowDevTools ? DevelopmentToolsModule : NoopDevelopmentToolsModule,
        HttpClientModule,
        LobbyStatusWindowModule,
        MatchSummaryWindowModule,
        MatchTimerWindowModule,
        MiniInventoryWindowModule,
        OverwolfModule,
    ],
    providers: [WINDOW_PROVIDERS],
    bootstrap: [AppComponent],
})
export class AppModule {}

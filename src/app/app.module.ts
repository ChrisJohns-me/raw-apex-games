import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { BackgroundModule } from "./modules/background/background.module";
import { CoreModule } from "./modules/core/core.module";
import { DashboardWindowModule } from "./modules/dashboard-window/dashboard-window.module";
import { InGameMatchTimerWindowModule } from "./modules/in-game-match-timer-window/in-game-match-timer-window.module";
import { InGameTestWindowModule } from "./modules/in-game-test-window/in-game-test-window.module";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BackgroundModule,
        BrowserModule,
        CoreModule,
        DashboardWindowModule,
        InGameMatchTimerWindowModule,
        InGameTestWindowModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}

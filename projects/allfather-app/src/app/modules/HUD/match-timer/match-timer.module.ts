import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { NgModule } from "@angular/core";
import { SharedAppModule } from "@shared-app/shared-app.module";
import { MatchTimerWindowComponent } from "./windows/match-timer-window.component";

@NgModule({
    declarations: [MatchTimerWindowComponent],
    imports: [SharedAppModule, AllfatherSharedModule],
    exports: [MatchTimerWindowComponent],
})
export class MatchTimerWindowModule {}

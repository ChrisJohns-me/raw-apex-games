import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { MatchTimerWindowComponent } from "./windows/match-timer-window.component";

@NgModule({
    declarations: [MatchTimerWindowComponent],
    imports: [AllfatherSharedModule, SharedModule],
    exports: [MatchTimerWindowComponent],
})
export class MatchTimerWindowModule {}

import { SharedModule } from "@allfather-app/app/shared/shared.module";
import { NgModule } from "@angular/core";
import { MatchTimerWindowComponent } from "./windows/match-timer-window.component";

@NgModule({
    declarations: [MatchTimerWindowComponent],
    imports: [SharedModule],
    exports: [MatchTimerWindowComponent],
})
export class MatchTimerWindowModule {}

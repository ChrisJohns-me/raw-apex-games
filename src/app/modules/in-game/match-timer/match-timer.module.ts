import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { MatchTimerWindowComponent } from "./windows/match-timer-window.component";

@NgModule({
    declarations: [MatchTimerWindowComponent],
    imports: [SharedModule],
    exports: [MatchTimerWindowComponent],
})
export class MatchTimerWindowModule {}

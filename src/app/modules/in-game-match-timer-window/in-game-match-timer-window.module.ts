import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { InGameMatchTimerWindowComponent } from "./in-game-match-timer-window.component";

@NgModule({
    declarations: [InGameMatchTimerWindowComponent],
    imports: [SharedModule],
    exports: [InGameMatchTimerWindowComponent],
})
export class InGameMatchTimerWindowModule {}

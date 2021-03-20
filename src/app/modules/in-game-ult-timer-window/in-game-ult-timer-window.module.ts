import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { InGameUltTimerWindowComponent } from "./in-game-ult-timer-window.component";

@NgModule({
    declarations: [InGameUltTimerWindowComponent],
    imports: [SharedModule],
    exports: [InGameUltTimerWindowComponent],
})
export class InGameUltTimerWindowModule {}

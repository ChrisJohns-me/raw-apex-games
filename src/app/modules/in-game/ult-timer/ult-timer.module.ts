import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { UltTimerWindowComponent } from "./windows/ult-timer-window.component";

@NgModule({
    declarations: [UltTimerWindowComponent],
    imports: [SharedModule],
    exports: [UltTimerWindowComponent],
})
export class UltTimerWindowModule {}

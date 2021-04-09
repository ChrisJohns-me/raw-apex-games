import { SharedModule } from "@allfather-app/app/shared/shared.module";
import { NgModule } from "@angular/core";
import { UltTimerWindowComponent } from "./windows/ult-timer-window.component";

@NgModule({
    declarations: [UltTimerWindowComponent],
    imports: [SharedModule],
    exports: [UltTimerWindowComponent],
})
export class UltTimerWindowModule {}

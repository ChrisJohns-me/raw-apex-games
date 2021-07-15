import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { NgModule } from "@angular/core";
import { SharedAppModule } from "@shared-app/shared-app.module";
import { UltTimerWindowComponent } from "./windows/ult-timer-window.component";

@NgModule({
    declarations: [UltTimerWindowComponent],
    imports: [SharedAppModule, AllfatherSharedModule],
    exports: [UltTimerWindowComponent],
})
export class UltTimerWindowModule {}

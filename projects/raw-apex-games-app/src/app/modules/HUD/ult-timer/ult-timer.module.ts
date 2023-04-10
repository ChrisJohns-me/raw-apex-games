import { NgModule } from "@angular/core";
import { RawApexGamesSharedModule } from "@raw-apex-games-app/app/shared/raw-apex-games-shared.module";
import { SharedModule } from "@shared/shared.module";
import { UltTimerWindowComponent } from "./windows/ult-timer-window.component";

@NgModule({
    declarations: [UltTimerWindowComponent],
    imports: [RawApexGamesSharedModule, SharedModule],
    exports: [UltTimerWindowComponent],
})
export class UltTimerWindowModule {}

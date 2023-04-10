import { NgModule } from "@angular/core";
import { RawApexGamesSharedModule } from "@raw-apex-games-app/app/shared/raw-apex-games-shared.module";
import { SharedModule } from "@shared/shared.module";
import { MatchTimerWindowComponent } from "./windows/match-timer-window.component";

@NgModule({
    declarations: [MatchTimerWindowComponent],
    imports: [RawApexGamesSharedModule, SharedModule],
    exports: [MatchTimerWindowComponent],
})
export class MatchTimerWindowModule {}

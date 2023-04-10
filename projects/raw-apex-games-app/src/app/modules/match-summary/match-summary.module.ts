import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RawApexGamesSharedModule } from "@raw-apex-games-app/app/shared/raw-apex-games-shared.module";
import { MatchSummaryWindowComponent } from "./windows/match-summary-window.component";

@NgModule({
    declarations: [MatchSummaryWindowComponent],
    imports: [ReactiveFormsModule, RawApexGamesSharedModule],
    exports: [MatchSummaryWindowComponent],
})
export class MatchSummaryWindowModule {}

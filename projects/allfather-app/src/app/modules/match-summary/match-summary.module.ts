import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatchSummaryWindowComponent } from "./windows/match-summary-window.component";

@NgModule({
    declarations: [MatchSummaryWindowComponent],
    imports: [ReactiveFormsModule, AllfatherSharedModule],
    exports: [MatchSummaryWindowComponent],
})
export class MatchSummaryWindowModule {}

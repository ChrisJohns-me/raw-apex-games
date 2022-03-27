import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { LegendSelectComplimentaryLegendsComponent } from "./components/legend-select-complimentary-legends.component";
import { LegendSelectIconsBoardComponent } from "./components/legend-select-icons-board.component";
import { LegendStatsComponent } from "./components/legend-stats.component";
import { LegendSelectAssistWindowComponent } from "./windows/legend-select-assist-window.component";

@NgModule({
    declarations: [
        LegendSelectAssistWindowComponent,
        LegendSelectComplimentaryLegendsComponent,
        LegendSelectIconsBoardComponent,
        LegendStatsComponent,
    ],
    imports: [ReactiveFormsModule, AllfatherSharedModule],
    exports: [LegendSelectAssistWindowComponent],
})
export class LegendSelectAssistWindowModule {}

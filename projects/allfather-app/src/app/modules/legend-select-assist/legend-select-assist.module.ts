import { SharedModule } from "@allfather-app/app/shared/shared.module";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ComplimentaryLegendsComponent } from "./components/complimentary-legends.component";
import { LegendIconsBoardComponent } from "./components/legend-icons-board.component";
import { LegendStatsComponent } from "./components/legend-stats.component";
import { LegendSelectAssistService } from "./legend-select-assist.service";
import { LegendSelectAssistWindowComponent } from "./windows/legend-select-assist-window.component";

@NgModule({
    declarations: [ComplimentaryLegendsComponent, LegendIconsBoardComponent, LegendSelectAssistWindowComponent, LegendStatsComponent],
    providers: [LegendSelectAssistService],
    imports: [SharedModule, ReactiveFormsModule],
    exports: [LegendSelectAssistWindowComponent],
})
export class LegendSelectAssistWindowModule {}

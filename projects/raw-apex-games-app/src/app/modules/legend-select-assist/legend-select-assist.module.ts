import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RawApexGamesSharedModule } from "@raw-apex-games-app/app/shared/raw-apex-games-shared.module";
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
    imports: [ReactiveFormsModule, RawApexGamesSharedModule],
    exports: [LegendSelectAssistWindowComponent],
})
export class LegendSelectAssistWindowModule {}

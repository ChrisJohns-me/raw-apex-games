import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RawApexGamesSharedModule } from "@app/shared/app-shared.module.js";
import { SharedModule } from "@shared/angular/shared.module.js";
import { ChartingPageComponent } from "./charting-page.component.js";
import { GameModeLineupChartComponent } from "./components/game-mode-lineup-chart.component.js";
import { GameModePlayrateChartComponent } from "./components/game-mode-playrate-chart.component.js";
import { LegendLineupChartComponent } from "./components/legend-lineup-chart.component.js";
import { LegendPickrateChartComponent } from "./components/legend-pickrate-chart.component.js";
import { RankedChartComponent } from "./components/ranked-chart.component.js";
import { StatsChartComponent } from "./components/stats-chart.component.js";

@NgModule({
    declarations: [
        ChartingPageComponent,
        GameModeLineupChartComponent,
        GameModePlayrateChartComponent,
        LegendLineupChartComponent,
        LegendPickrateChartComponent,
        RankedChartComponent,
        StatsChartComponent,
    ],
    imports: [CommonModule, RawApexGamesSharedModule, SharedModule],
    providers: [],
    exports: [ChartingPageComponent],
})
export class ChartingPageModule {}

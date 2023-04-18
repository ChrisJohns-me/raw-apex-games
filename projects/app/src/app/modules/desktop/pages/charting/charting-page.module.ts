import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RawApexGamesSharedModule } from "@app/app/shared/app-shared.module";
import { SharedModule } from "@shared/shared.module";
import { ChartingPageComponent } from "./charting-page.component";
import { GameModeLineupChartComponent } from "./components/game-mode-lineup-chart.component";
import { GameModePlayrateChartComponent } from "./components/game-mode-playrate-chart.component";
import { LegendLineupChartComponent } from "./components/legend-lineup-chart.component";
import { LegendPickrateChartComponent } from "./components/legend-pickrate-chart.component";
import { RankedChartComponent } from "./components/ranked-chart.component";
import { StatsChartComponent } from "./components/stats-chart.component";

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

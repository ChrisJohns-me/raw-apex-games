import { SharedModule } from "@allfather-app/app/shared/shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { DailyAverageGraphComponent } from "./components/charting/daily-average-graph.component";
import { ComplimentaryLegendsComponent } from "./components/dashboard/complimentary-legends.component";
import { LegendIconsBoardComponent } from "./components/dashboard/legend-icons-board.component";
import { NavbarComponent } from "./components/navbar.component";
import { ChartingPageComponent } from "./pages/charting-page.component";
import { DashboardPageComponent } from "./pages/dashboard-page.component";
import { MatchExplorerPageComponent } from "./pages/match-explorer-page.component";
import { SettingsPageComponent } from "./pages/settings-page.component";
import { MainWindowComponent } from "./windows/main-window.component";

@NgModule({
    declarations: [
        ChartingPageComponent,
        ComplimentaryLegendsComponent,
        DailyAverageGraphComponent,
        DashboardPageComponent,
        LegendIconsBoardComponent,
        MainWindowComponent,
        MatchExplorerPageComponent,
        NavbarComponent,
        SettingsPageComponent,
    ],
    imports: [CommonModule, ReactiveFormsModule, SharedModule],
    providers: [],
    exports: [MainWindowComponent],
})
export class MainModule {}

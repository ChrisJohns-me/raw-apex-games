import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RawApexGamesSharedModule } from "@app/shared/app-shared.module.js";
import { SharedModule } from "@shared/angular/shared.module.js";
import { AccountStatsDisplayComponent } from "./components/account-stats-display.component.js";
import { LegendIconsBoardComponent } from "./components/legend-icons-board.component.js";
import { DashboardPageComponent } from "./dashboard-page.component.js";

@NgModule({
    declarations: [AccountStatsDisplayComponent, DashboardPageComponent, LegendIconsBoardComponent],
    imports: [CommonModule, ReactiveFormsModule, RawApexGamesSharedModule, SharedModule],
    providers: [],
    exports: [DashboardPageComponent],
})
export class DashboardPageModule {}

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../../../../../../shared/shared.module";
import { RawApexGamesSharedModule } from "../../../../shared/app-shared.module";
import { AccountStatsDisplayComponent } from "./components/account-stats-display.component";
import { LegendIconsBoardComponent } from "./components/legend-icons-board.component";
import { DashboardPageComponent } from "./dashboard-page.component";

@NgModule({
    declarations: [AccountStatsDisplayComponent, DashboardPageComponent, LegendIconsBoardComponent],
    imports: [CommonModule, ReactiveFormsModule, RawApexGamesSharedModule, SharedModule],
    providers: [],
    exports: [DashboardPageComponent],
})
export class DashboardPageModule {}

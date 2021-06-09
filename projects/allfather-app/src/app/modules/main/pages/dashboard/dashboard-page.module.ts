import { SharedModule } from "@allfather-app/app/shared/shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AccountStatsDisplayComponent } from "./components/account-stats-display.component";
import { ComplimentaryLegendsComponent } from "./components/complimentary-legends.component";
import { LegendIconsBoardComponent } from "./components/legend-icons-board.component";
import { MapRotationDisplayComponent } from "./components/map-rotation-display.component";
import { DashboardPageComponent } from "./dashboard-page.component";

@NgModule({
    declarations: [
        AccountStatsDisplayComponent,
        ComplimentaryLegendsComponent,
        DashboardPageComponent,
        LegendIconsBoardComponent,
        MapRotationDisplayComponent,
    ],
    imports: [CommonModule, ReactiveFormsModule, SharedModule],
    providers: [],
    exports: [DashboardPageComponent],
})
export class DashboardPageModule {}

import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedAppModule } from "@shared-app/shared-app.module";
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
    imports: [CommonModule, ReactiveFormsModule, SharedAppModule, AllfatherSharedModule],
    providers: [],
    exports: [DashboardPageComponent],
})
export class DashboardPageModule {}

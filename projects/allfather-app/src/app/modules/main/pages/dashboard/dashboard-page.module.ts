import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@shared/shared.module";
import { AccountStatsDisplayComponent } from "./components/account-stats-display.component";
import { ComplimentaryLegendsComponent } from "./components/complimentary-legends.component";
import { ComplimentaryWeaponsComponent } from "./components/complimentary-weapons.component";
import { LegendIconsBoardComponent } from "./components/legend-icons-board.component";
import { MapRotationDisplayComponent } from "./components/map-rotation-display.component";
import { DashboardPageComponent } from "./dashboard-page.component";

@NgModule({
    declarations: [
        AccountStatsDisplayComponent,
        ComplimentaryLegendsComponent,
        ComplimentaryWeaponsComponent,
        DashboardPageComponent,
        LegendIconsBoardComponent,
        MapRotationDisplayComponent,
    ],
    imports: [CommonModule, ReactiveFormsModule, AllfatherSharedModule, SharedModule],
    providers: [],
    exports: [DashboardPageComponent],
})
export class DashboardPageModule {}

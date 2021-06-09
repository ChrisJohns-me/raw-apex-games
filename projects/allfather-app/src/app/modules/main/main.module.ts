import { SharedModule } from "@allfather-app/app/shared/shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NavbarComponent } from "./components/navbar.component";
import { ChartingPageModule } from "./pages/charting/charting-page.module";
import { DashboardPageModule } from "./pages/dashboard/dashboard-page.module";
import { DatasheetPageModule } from "./pages/datasheet/datasheet-page.module";
import { MapExplorerPageModule } from "./pages/map-explorer/map-explorer-page.module";
import { MatchExplorerPageModule } from "./pages/match-explorer/match-explorer-page.module";
import { SettingsPageModule } from "./pages/settings/settings-page.module";
import { MainWindowComponent } from "./windows/main-window.component";

const PAGES = [
    ChartingPageModule,
    DashboardPageModule,
    DatasheetPageModule,
    MapExplorerPageModule,
    MatchExplorerPageModule,
    SettingsPageModule,
];

@NgModule({
    declarations: [MainWindowComponent, NavbarComponent],
    imports: [...PAGES, CommonModule, ReactiveFormsModule, SharedModule],
    providers: [],
    exports: [MainWindowComponent],
})
export class MainModule {}

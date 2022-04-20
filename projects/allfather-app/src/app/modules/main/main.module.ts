import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@shared/shared.module";
import { NavbarComponent } from "./components/navbar.component";
import { AboutPageModule } from "./pages/about/about-page.module";
import { AcademyPageModule } from "./pages/academy/academy-page.module";
import { ChartingPageModule } from "./pages/charting/charting-page.module";
import { DashboardPageModule } from "./pages/dashboard/dashboard-page.module";
import { DatasheetPageModule } from "./pages/datasheet/datasheet-page.module";
import { FirstRunPageModule } from "./pages/first-run/first-run-page.module";
import { MapExplorerPageModule } from "./pages/map-explorer/map-explorer-page.module";
import { MatchExplorerPageModule } from "./pages/match-explorer/match-explorer-page.module";
import { SettingsPageModule } from "./pages/settings/settings-page.module";
import { MainWindowComponent } from "./windows/main-window.component";

const PAGES = [
    AboutPageModule,
    AcademyPageModule,
    ChartingPageModule,
    DashboardPageModule,
    DatasheetPageModule,
    FirstRunPageModule,
    MapExplorerPageModule,
    MatchExplorerPageModule,
    SettingsPageModule,
];

@NgModule({
    declarations: [MainWindowComponent, NavbarComponent],
    imports: [...PAGES, CommonModule, ReactiveFormsModule, AllfatherSharedModule, SharedModule],
    providers: [],
    exports: [MainWindowComponent],
})
export class MainModule {}

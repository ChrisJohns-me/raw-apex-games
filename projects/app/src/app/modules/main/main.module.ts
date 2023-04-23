import { RawApexGamesSharedModule } from "#app/shared/app-shared.module.js";
import { SharedModule } from "#shared/angular/shared.module.js";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NavbarComponent } from "./components/navbar.component.js";
import { AboutPageModule } from "./pages/about/about-page.module.js";
import { ChartingPageModule } from "./pages/charting/charting-page.module.js";
import { DashboardPageModule } from "./pages/dashboard/dashboard-page.module.js";
import { FirstRunPageModule } from "./pages/first-run/first-run-page.module.js";
import { MapExplorerPageModule } from "./pages/map-explorer/map-explorer-page.module.js";
import { MatchExplorerPageModule } from "./pages/match-explorer/match-explorer-page.module.js";
import { RawApexGamesPageModule } from "./pages/raw-apex-games/raw-apex-games-page.module.js";
import { SettingsPageModule } from "./pages/settings/settings-page.module.js";
import { MainWindowComponent } from "./windows/main-window.component.js";

const PAGES = [
    AboutPageModule,
    ChartingPageModule,
    DashboardPageModule,
    FirstRunPageModule,
    MapExplorerPageModule,
    MatchExplorerPageModule,
    RawApexGamesPageModule,
    SettingsPageModule,
];

@NgModule({
    declarations: [MainWindowComponent, NavbarComponent],
    imports: [...PAGES, CommonModule, ReactiveFormsModule, RawApexGamesSharedModule, SharedModule],
    providers: [],
    exports: [MainWindowComponent],
})
export class MainModule {}

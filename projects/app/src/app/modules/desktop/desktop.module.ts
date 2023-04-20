import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RawApexGamesSharedModule } from "@app/shared/app-shared.module.js";
import { SharedModule } from "@shared/angular/shared.module.js";
import { NavbarComponent } from "./components/navbar.component.js";
import { AboutPageModule } from "./pages/about/about-page.module.js";
import { ChartingPageModule } from "./pages/charting/charting-page.module.js";
import { DashboardPageModule } from "./pages/dashboard/dashboard-page.module.js";
import { FirstRunPageModule } from "./pages/first-run/first-run-page.module.js";
import { MapExplorerPageModule } from "./pages/map-explorer/map-explorer-page.module.js";
import { MatchExplorerPageModule } from "./pages/match-explorer/match-explorer-page.module.js";
import { SettingsPageModule } from "./pages/settings/settings-page.module.js";
import { DesktopWindowComponent } from "./windows/desktop-window.component.js";

const PAGES = [
    AboutPageModule,
    ChartingPageModule,
    DashboardPageModule,
    FirstRunPageModule,
    MapExplorerPageModule,
    MatchExplorerPageModule,
    SettingsPageModule,
];

@NgModule({
    declarations: [DesktopWindowComponent, NavbarComponent],
    imports: [...PAGES, CommonModule, ReactiveFormsModule, RawApexGamesSharedModule, SharedModule],
    providers: [],
    exports: [DesktopWindowComponent],
})
export class DesktopModule {}

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RawApexGamesSharedModule } from "@app/app/shared/app-shared.module";
import { SharedModule } from "@shared/shared.module";
import { NavbarComponent } from "./components/navbar.component";
import { AboutPageModule } from "./pages/about/about-page.module";
import { ChartingPageModule } from "./pages/charting/charting-page.module";
import { DashboardPageModule } from "./pages/dashboard/dashboard-page.module";
import { FirstRunPageModule } from "./pages/first-run/first-run-page.module";
import { MapExplorerPageModule } from "./pages/map-explorer/map-explorer-page.module";
import { MatchExplorerPageModule } from "./pages/match-explorer/match-explorer-page.module";
import { SettingsPageModule } from "./pages/settings/settings-page.module";
import { DesktopWindowComponent } from "./windows/desktop-window.component";

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

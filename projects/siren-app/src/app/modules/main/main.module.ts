import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedAppModule } from "@shared-app/shared-app.module";
import { SirenSharedModule } from "@siren-app/app/shared/siren-shared.module";
import { SidebarComponent } from "./components/sidebar.component";
import { DashboardPageModule } from "./pages/dashboard/dashboard-page.module";
import { MyReportsPageModule } from "./pages/my-reports/my-reports-page.module";
import { ReportedPlayersPageModule } from "./pages/reported-players/reported-players-page.module";
import { SettingsPageModule } from "./pages/settings/settings-page.module";
import { MainWindowComponent } from "./windows/main-window.component";

const PAGES = [DashboardPageModule, ReportedPlayersPageModule, MyReportsPageModule, SettingsPageModule];

@NgModule({
    declarations: [MainWindowComponent, SidebarComponent],
    imports: [...PAGES, CommonModule, ReactiveFormsModule, SharedAppModule, SirenSharedModule],
    providers: [],
    exports: [MainWindowComponent],
})
export class MainModule {}

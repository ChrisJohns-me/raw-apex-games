import { SharedModule } from "@allfather-app/app/shared/shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MapExplorerPageComponent } from "./pages/map-explorer-page.component";
import { DashboardWindowComponent } from "./windows/dashboard-window.component";

@NgModule({
    declarations: [DashboardWindowComponent, MapExplorerPageComponent],
    imports: [CommonModule, ReactiveFormsModule, SharedModule],
    providers: [],
    exports: [DashboardWindowComponent],
})
export class DashboardModule {}

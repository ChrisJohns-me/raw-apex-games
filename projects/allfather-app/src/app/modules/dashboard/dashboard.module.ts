import { SharedModule } from "@allfather-app/app/shared/shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DashboardWindowComponent } from "./windows/dashboard-window.component";

@NgModule({
    declarations: [DashboardWindowComponent],
    imports: [SharedModule, CommonModule],
    exports: [DashboardWindowComponent],
})
export class DashboardModule {}

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DashboardWindowComponent } from "./dashboard-window.component";

@NgModule({
    declarations: [DashboardWindowComponent],
    imports: [CommonModule],
    exports: [DashboardWindowComponent],
})
export class DashboardWindowModule {}

import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { DashboardWindowComponent } from "./dashboard-window.component";

@NgModule({
    declarations: [DashboardWindowComponent],
    imports: [SharedModule],
    exports: [DashboardWindowComponent],
})
export class DashboardWindowModule {}

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedAppModule } from "@shared-app/shared-app.module";
import { SirenSharedModule } from "@siren-app/app/shared/siren-shared.module";
import { DashboardPageComponent } from "./dashboard-page.component";

@NgModule({
    declarations: [DashboardPageComponent],
    imports: [CommonModule, ReactiveFormsModule, SharedAppModule, SirenSharedModule],
    providers: [],
    exports: [DashboardPageComponent],
})
export class DashboardPageModule {}

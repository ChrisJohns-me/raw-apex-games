import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedAppModule } from "@shared-app/shared-app.module";
import { SirenSharedModule } from "@siren-app/app/shared/siren-shared.module";
import { ReportTableComponent } from "./components/report-table.component";
import { ReportedPlayersPageComponent } from "./reported-players-page.component";

@NgModule({
    declarations: [ReportedPlayersPageComponent, ReportTableComponent],
    imports: [CommonModule, ReactiveFormsModule, SharedAppModule, SirenSharedModule],
    providers: [],
    exports: [ReportedPlayersPageComponent],
})
export class ReportedPlayersPageModule {}

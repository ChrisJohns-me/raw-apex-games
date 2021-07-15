import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedAppModule } from "@shared-app/shared-app.module";
import { SirenSharedModule } from "@siren-app/app/shared/siren-shared.module";
import { HUDReportPlayerWindowComponent } from "./windows/hud-report-player-window.component";

@NgModule({
    declarations: [HUDReportPlayerWindowComponent],
    imports: [ReactiveFormsModule, SharedAppModule, SirenSharedModule],
    exports: [HUDReportPlayerWindowComponent],
})
export class HUDReportPlayerModule {}

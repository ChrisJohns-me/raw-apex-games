import { SharedModule } from "@allfather-app/app/shared/shared.module";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { LegendSelectAssistService } from "./legend-select-assist.service";
import { LegendSelectAssistWindowComponent } from "./windows/legend-select-assist-window.component";

@NgModule({
    declarations: [LegendSelectAssistWindowComponent],
    providers: [LegendSelectAssistService],
    imports: [SharedModule, ReactiveFormsModule],
    exports: [LegendSelectAssistWindowComponent],
})
export class LegendSelectAssistWindowModule {}

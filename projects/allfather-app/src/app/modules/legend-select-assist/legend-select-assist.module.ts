import { SharedModule } from "@allfather-app/app/shared/shared.module";
import { NgModule } from "@angular/core";
import { LegendSelectAssistService } from "./legend-select-assist.service";
import { LegendSelectAssistWindowComponent } from "./windows/legend-select-assist-window.component";

@NgModule({
    declarations: [LegendSelectAssistWindowComponent],
    providers: [LegendSelectAssistService],
    imports: [SharedModule],
    exports: [LegendSelectAssistWindowComponent],
})
export class LegendSelectAssistWindowModule {}

import { SharedModule } from "@allfather-app/app/shared/shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ChartingPageComponent } from "./charting-page.component";
import { DailyAverageGraphComponent } from "./components/daily-average-graph.component";

@NgModule({
    declarations: [ChartingPageComponent, DailyAverageGraphComponent],
    imports: [CommonModule, ReactiveFormsModule, SharedModule],
    providers: [],
    exports: [ChartingPageComponent],
})
export class ChartingPageModule {}

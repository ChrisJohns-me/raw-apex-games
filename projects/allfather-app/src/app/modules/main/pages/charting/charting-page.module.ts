import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ChartingPageComponent } from "./charting-page.component";
import { LineGraphComponent } from "./components/line-graph.component";

@NgModule({
    declarations: [ChartingPageComponent, LineGraphComponent],
    imports: [CommonModule, ReactiveFormsModule],
    providers: [],
    exports: [ChartingPageComponent],
})
export class ChartingPageModule {}

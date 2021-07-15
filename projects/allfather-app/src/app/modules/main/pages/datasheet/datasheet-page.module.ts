import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { DatasheetPageComponent } from "./datasheet-page.component";

@NgModule({
    declarations: [DatasheetPageComponent],
    imports: [CommonModule, ReactiveFormsModule],
    providers: [],
    exports: [DatasheetPageComponent],
})
export class DatasheetPageModule {}

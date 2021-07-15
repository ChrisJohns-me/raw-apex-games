import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedAppModule } from "@shared-app/shared-app.module";
import { SirenSharedModule } from "@siren-app/app/shared/siren-shared.module";
import { MyReportsPageComponent } from "./my-reports-page.component";

@NgModule({
    declarations: [MyReportsPageComponent],
    imports: [CommonModule, ReactiveFormsModule, SharedAppModule, SirenSharedModule],
    providers: [],
    exports: [MyReportsPageComponent],
})
export class MyReportsPageModule {}

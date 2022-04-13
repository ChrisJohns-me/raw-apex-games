import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { AcademyPageComponent } from "./academy-page.component";

@NgModule({
    declarations: [AcademyPageComponent],
    imports: [CommonModule, AllfatherSharedModule, SharedModule],
    providers: [],
    exports: [AcademyPageComponent],
})
export class AcademyPageModule {}

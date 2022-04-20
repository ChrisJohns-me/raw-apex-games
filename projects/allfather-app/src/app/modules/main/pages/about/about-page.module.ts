import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { AboutPageComponent } from "./about-page.component";

@NgModule({
    declarations: [AboutPageComponent],
    imports: [CommonModule, AllfatherSharedModule, SharedModule],
    providers: [],
    exports: [AboutPageComponent],
})
export class AboutPageModule {}

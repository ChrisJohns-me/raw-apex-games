import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { FirstRunPageComponent } from "./first-run-page.component";

@NgModule({
    declarations: [FirstRunPageComponent],
    imports: [CommonModule, AllfatherSharedModule, SharedModule],
    providers: [],
    exports: [FirstRunPageComponent],
})
export class FirstRunPageModule {}

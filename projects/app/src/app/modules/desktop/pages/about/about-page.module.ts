import { RawApexGamesSharedModule } from "#app/shared/app-shared.module.js";
import { SharedModule } from "#shared/angular/shared.module.js";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AboutPageComponent } from "./about-page.component.js";

@NgModule({
    declarations: [AboutPageComponent],
    imports: [CommonModule, RawApexGamesSharedModule, SharedModule],
    providers: [],
    exports: [AboutPageComponent],
})
export class AboutPageModule {}

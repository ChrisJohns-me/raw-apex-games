import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RawApexGamesSharedModule } from "@app/shared/app-shared.module.js";
import { SharedModule } from "@shared/angular/shared.module.js";
import { FirstRunPageComponent } from "./first-run-page.component.js";

@NgModule({
    declarations: [FirstRunPageComponent],
    imports: [CommonModule, RawApexGamesSharedModule, SharedModule],
    providers: [],
    exports: [FirstRunPageComponent],
})
export class FirstRunPageModule {}

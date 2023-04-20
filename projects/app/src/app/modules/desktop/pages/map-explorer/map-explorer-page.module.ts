import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RawApexGamesSharedModule } from "@app/shared/app-shared.module.js";
import { SharedModule } from "@shared/angular/shared.module.js";
import { MapExplorerPageComponent } from "./map-explorer-page.component.js";

@NgModule({
    declarations: [MapExplorerPageComponent],
    imports: [CommonModule, ReactiveFormsModule, RawApexGamesSharedModule, SharedModule],
    providers: [],
    exports: [MapExplorerPageComponent],
})
export class MapExplorerPageModule {}

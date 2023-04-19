import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../../../../../../shared/shared.module";
import { RawApexGamesSharedModule } from "../../../../shared/app-shared.module";
import { MapExplorerPageComponent } from "./map-explorer-page.component";

@NgModule({
    declarations: [MapExplorerPageComponent],
    imports: [CommonModule, ReactiveFormsModule, RawApexGamesSharedModule, SharedModule],
    providers: [],
    exports: [MapExplorerPageComponent],
})
export class MapExplorerPageModule {}

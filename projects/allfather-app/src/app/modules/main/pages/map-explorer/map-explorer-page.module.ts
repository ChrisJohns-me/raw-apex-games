import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedAppModule } from "@shared-app/shared-app.module";
import { MapExplorerPageComponent } from "./map-explorer-page.component";

@NgModule({
    declarations: [MapExplorerPageComponent],
    imports: [CommonModule, ReactiveFormsModule, SharedAppModule, AllfatherSharedModule],
    providers: [],
    exports: [MapExplorerPageComponent],
})
export class MapExplorerPageModule {}

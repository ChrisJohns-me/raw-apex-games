import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedAppModule } from "@shared-app/shared-app.module";
import { SelectedGameModesComponent } from "./components/selected-game-modes.component";
import { SelectedLegendsComponent } from "./components/selected-legends.component";
import { SelectedMapsComponent } from "./components/selected-maps.component";
import { MatchExplorerPageComponent } from "./match-explorer-page.component";

@NgModule({
    declarations: [MatchExplorerPageComponent, SelectedMapsComponent, SelectedGameModesComponent, SelectedLegendsComponent],
    imports: [CommonModule, ReactiveFormsModule, SharedAppModule, AllfatherSharedModule],
    providers: [],
    exports: [MatchExplorerPageComponent],
})
export class MatchExplorerPageModule {}

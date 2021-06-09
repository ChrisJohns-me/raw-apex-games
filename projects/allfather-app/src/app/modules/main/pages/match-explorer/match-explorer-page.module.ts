import { SharedModule } from "@allfather-app/app/shared/shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SelectedGameModesComponent } from "./components/selected-game-modes.component";
import { SelectedLegendsComponent } from "./components/selected-legends.component";
import { SelectedMapsComponent } from "./components/selected-maps.component";
import { MatchExplorerPageComponent } from "./match-explorer-page.component";

@NgModule({
    declarations: [MatchExplorerPageComponent, SelectedMapsComponent, SelectedGameModesComponent, SelectedLegendsComponent],
    imports: [CommonModule, ReactiveFormsModule, SharedModule],
    providers: [],
    exports: [MatchExplorerPageComponent],
})
export class MatchExplorerPageModule {}

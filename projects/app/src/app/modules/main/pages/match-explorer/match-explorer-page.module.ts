import { RawApexGamesSharedModule } from "#app/shared/app-shared.module.js";
import { SharedModule } from "#shared/angular/shared.module.js";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatchExplorerPageComponent } from "./match-explorer-page.component.js";

@NgModule({
    declarations: [MatchExplorerPageComponent],
    imports: [CommonModule, ReactiveFormsModule, RawApexGamesSharedModule, SharedModule],
    providers: [],
    exports: [MatchExplorerPageComponent],
})
export class MatchExplorerPageModule {}
